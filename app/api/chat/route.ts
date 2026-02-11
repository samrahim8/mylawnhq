import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { routeQuestion, logRequest, calculateCost } from "@/lib/kb-router";
import { WeatherData, CalendarActivity, ChatImage } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { checkAiChatUsage, incrementAiChatUsage } from "@/lib/usage";
import { FREE_TIER_LIMITS } from "@/lib/stripe";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper to format weather context for the AI
function formatWeatherContext(weather: WeatherData): string {
  const today = weather.forecast[0];
  const upcoming = weather.forecast.slice(1, 4);

  let context = `\n\n## Current Weather Context\n`;
  context += `Location: ${weather.location}\n`;
  context += `Current: ${weather.current.temp}°F (feels like ${weather.current.feelsLike}°F), ${weather.current.condition}\n`;
  context += `Humidity: ${weather.current.humidity}%, Wind: ${weather.current.windSpeed} mph, UV Index: ${weather.current.uvIndex}\n`;
  context += `Today's forecast: High ${today?.high || weather.current.temp}°F, Low ${today?.low || weather.current.temp}°F\n`;
  context += `\nUpcoming days:\n`;
  upcoming.forEach(day => {
    context += `- ${day.dayName}: ${day.condition}, High ${day.high}°F, Low ${day.low}°F\n`;
  });

  return context;
}

// Helper to format activities context for the AI
function formatActivitiesContext(activities: CalendarActivity[]): string {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter to recent activities (last 30 days)
  const recentActivities = activities.filter(a => {
    const activityDate = new Date(a.date);
    return activityDate >= thirtyDaysAgo && activityDate <= today;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (recentActivities.length === 0) {
    return "\n\n## Recent Lawn Activities\nNo activities logged in the past 30 days.";
  }

  const activityLabels: Record<string, string> = {
    mow: "Mowed",
    water: "Watered",
    fertilize: "Fertilized",
    aerate: "Aerated",
    pest: "Pest Control",
    weedControl: "Weed Control",
    seed: "Seeded",
    other: "Other"
  };

  let context = `\n\n## Recent Lawn Activities (Last 30 Days)\n`;
  recentActivities.forEach(activity => {
    const date = new Date(activity.date);
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const daysAgo = daysDiff === 0 ? "Today" : daysDiff === 1 ? "Yesterday" : `${daysDiff} days ago`;

    let details = `- ${activityLabels[activity.type] || activity.type}: ${daysAgo}`;
    if (activity.notes) details += ` (${activity.notes})`;
    if (activity.height) details += ` at ${activity.height}`;
    if (activity.product) details += ` with ${activity.product}`;
    context += details + "\n";
  });

  return context;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, profile, weatherContext, activitiesContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Check usage limits for authenticated users
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;

      if (userId) {
        const usageCheck = await checkAiChatUsage(userId);

        if (!usageCheck.allowed) {
          return NextResponse.json(
            {
              error: "limit_reached",
              limitType: "ai_chat",
              message: `You've used all ${FREE_TIER_LIMITS.AI_CHAT} free AI chat messages this month. Upgrade to Pro for unlimited access.`,
              usage: {
                used: usageCheck.currentCount,
                limit: usageCheck.limit,
                plan: usageCheck.plan,
              },
            },
            { status: 402 } // Payment Required
          );
        }
      }
    } catch (authError) {
      // Continue without auth - allow anonymous usage
      console.log("No auth context, allowing anonymous chat");
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a helpful mock response if API key is not configured
      return NextResponse.json({
        content: "I'm currently in demo mode. To enable full AI responses, please add your ANTHROPIC_API_KEY to the .env file.\n\nIn the meantime, here are some general lawn care tips:\n\n1. **Water deeply but infrequently** - This encourages deep root growth\n2. **Mow at the right height** - For Bermuda, keep it at 1-2 inches; for Zoysia, 1-2.5 inches\n3. **Don't remove more than 1/3** of the grass blade in a single mowing\n4. **Fertilize during active growth** - Late spring through summer for warm-season grasses",
      });
    }

    // Extract last user message for routing
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user") as
      | { role: string; content: string; images?: ChatImage[] }
      | undefined;
    const questionText = lastUserMsg?.content || "";
    const hasImages = (lastUserMsg?.images?.length ?? 0) > 0;

    // Format context strings
    const weatherStr = weatherContext
      ? formatWeatherContext(weatherContext as WeatherData)
      : undefined;
    const activitiesStr =
      activitiesContext && Array.isArray(activitiesContext) && activitiesContext.length > 0
        ? formatActivitiesContext(activitiesContext as CalendarActivity[])
        : undefined;

    // Route question → model + minimal system prompt (async — may call Pl@ntNet)
    const routeResult = await routeQuestion(questionText, profile || {}, {
      hasImages,
      images: lastUserMsg?.images,
      weatherContext: weatherStr,
      activitiesContext: activitiesStr,
    });

    // Convert messages to Anthropic format with vision support.
    // When stripImages is true (Pl@ntNet identified the weed), we do NOT
    // send photos to Claude — the weed name + treatment are in the system prompt.
    const anthropicMessages = messages.map((msg: { role: string; content: string; images?: ChatImage[] }) => {
      // If message has images AND we're not stripping them, create a multi-part content array
      if (msg.images && msg.images.length > 0 && msg.role === "user" && !routeResult.stripImages) {
        const contentParts: Anthropic.MessageParam["content"] = [];

        // Add images first
        msg.images.forEach((img: ChatImage) => {
          contentParts.push({
            type: "image",
            source: {
              type: "base64",
              media_type: img.mimeType,
              data: img.data,
            },
          });
        });

        // Add text content if present
        if (msg.content) {
          contentParts.push({
            type: "text",
            text: msg.content,
          });
        }

        return {
          role: msg.role as "user" | "assistant",
          content: contentParts,
        };
      }

      // Regular text message
      return {
        role: msg.role as "user" | "assistant",
        content: msg.content,
      };
    });

    const response = await anthropic.messages.create({
      model: routeResult.model,
      max_tokens: 1024,
      system: routeResult.systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === "text");
    const content = textContent ? textContent.text : "I apologize, but I couldn't generate a response. Please try again.";

    // Increment usage for authenticated users
    if (userId) {
      try {
        await incrementAiChatUsage(userId);
      } catch (usageError) {
        console.error("Failed to increment usage:", usageError);
        // Don't fail the request if usage tracking fails
      }
    }

    // Log request for cost tracking
    const usage = response.usage as {
      input_tokens: number;
      output_tokens: number;
      cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number;
    };
    const pn = routeResult.plantnet;
    logRequest({
      timestamp: new Date().toISOString(),
      model: routeResult.model,
      modelTier: routeResult.modelTier,
      sectionsInjected: routeResult.sections,
      grassType: (profile as { grassType?: string })?.grassType || null,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
      estimatedCostUSD: calculateCost(
        routeResult.modelTier,
        usage.input_tokens,
        usage.output_tokens,
        usage.cache_read_input_tokens ?? 0
      ),
      questionPreview: questionText.slice(0, 100),
      plantnetCalled: pn?.called ?? false,
      plantnetSpecies: pn?.species ?? null,
      plantnetConfidence: pn?.confidence ?? null,
      plantnetFallback: pn?.fallbackReason ?? null,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
