import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getContextualPrompt } from "@/lib/lawn-knowledge";
import { WeatherData, CalendarActivity } from "@/types";

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

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a helpful mock response if API key is not configured
      return NextResponse.json({
        content: "I'm currently in demo mode. To enable full AI responses, please add your ANTHROPIC_API_KEY to the .env file.\n\nIn the meantime, here are some general lawn care tips:\n\n1. **Water deeply but infrequently** - This encourages deep root growth\n2. **Mow at the right height** - For Bermuda, keep it at 1-2 inches; for Zoysia, 1-2.5 inches\n3. **Don't remove more than 1/3** of the grass blade in a single mowing\n4. **Fertilize during active growth** - Late spring through summer for warm-season grasses",
      });
    }

    let systemPrompt = getContextualPrompt(profile || {});

    // Add weather context if provided
    if (weatherContext) {
      systemPrompt += formatWeatherContext(weatherContext as WeatherData);
    }

    // Add activities context if provided
    if (activitiesContext && Array.isArray(activitiesContext) && activitiesContext.length > 0) {
      systemPrompt += formatActivitiesContext(activitiesContext as CalendarActivity[]);
    }

    // Add special instructions for "What should I do today?" type questions
    if (weatherContext || activitiesContext) {
      systemPrompt += `\n\n## Today's Recommendation Instructions
When the user asks "What should I do today?" or similar questions:
1. Review the current weather conditions and forecast
2. Consider what activities have been done recently (avoid suggesting activities done in the last few days)
3. Account for upcoming weather (e.g., don't suggest watering if rain is expected)
4. Provide 2-3 specific, actionable recommendations based on:
   - Time since last mowing, watering, fertilizing, etc.
   - Current and upcoming weather conditions
   - Optimal lawn care schedules for their grass type
5. Explain WHY each recommendation makes sense given the conditions`;
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === "text");
    const content = textContent ? textContent.text : "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
