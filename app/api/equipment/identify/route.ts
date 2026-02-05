import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ChatImage, EquipmentIdentificationResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EQUIPMENT_SYSTEM_PROMPT = `You are an expert at identifying lawn care and outdoor power equipment. Your task is to identify equipment from photos, find owner's manual links, and provide warranty information.

## Instructions

When shown a photo of equipment:
1. Identify the BRAND (e.g., Honda, Toro, John Deere, Scotts, EGO, Stihl, Husqvarna, Fiskars)
2. Identify the MODEL number (e.g., HRX217VKA, BR 800 C-E, RZ54i)
3. Categorize the equipment TYPE (e.g., "Self-Propelled Mower", "Backpack Blower", "Zero-Turn Mower")
4. Search your knowledge for the official owner's manual URL
5. Provide the typical WARRANTY duration in months for residential use

For "sticker_photo" method:
- Focus on reading text from model/serial number stickers
- These are usually on the deck, near the engine, or on the frame
- Look for model numbers (typically a mix of letters and numbers like "HRX217VKA")

For "equipment_photo" method:
- Look at the overall shape, color scheme, and visible branding
- Identify distinguishing features
- If the model isn't visible, make your best guess based on the design

## Known Manual URL Patterns

Use these verified URL patterns when possible:
- Honda Power Equipment: http://cdn.powerequipment.honda.com/pe/pdf/manuals/[manual-id].pdf
- EGO: https://www.manualslib.com/manual/[id]/Ego-[model].html
- Stihl: https://www.manualslib.com/manual/[id]/Stihl-[model].html
- Scotts (Home Depot PDFs): https://images.thdstatic.com/catalog/pdfImages/[hash].pdf
- Fiskars: https://www.manualslib.com/manual/[id]/Fiskars-[model].html
- Husqvarna: https://www.manualslib.com/manual/[id]/Husqvarna-[model].html

If you cannot find a verified manual URL, set manualUrl to null.

## Known Warranty Periods (Residential Use)

Use these typical warranty durations:
- Honda Power Equipment: 36 months
- EGO (battery tools): 60 months for batteries, 36 months for tools
- Husqvarna: 24-48 months (use 36 for most residential equipment)
- Toro: 24-36 months (use 24 for most models)
- John Deere: 24-48 months (use 24 for residential)
- Stihl: 24 months
- Scotts spreaders: 36 months
- Fiskars: 24 months
- Greenworks: 48 months
- Ryobi: 36 months
- DeWalt outdoor: 36 months
- Milwaukee outdoor: 36 months

If unsure about warranty, use 24 months as a reasonable default.

## Response Format

You MUST respond with valid JSON only, no other text:
{
  "brand": "string",
  "model": "string",
  "type": "string",
  "manualUrl": "string or null",
  "confidence": "high" | "medium" | "low",
  "warrantyMonths": number
}

Confidence levels:
- "high": Clear brand and model visible, certain of identification
- "medium": Brand visible but model unclear, or making educated guess
- "low": Cannot clearly identify, best guess based on shape/features`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, method } = body as {
      image: ChatImage;
      method: "equipment_photo" | "sticker_photo";
    };

    if (!image || !image.data || !image.mimeType) {
      return NextResponse.json(
        { error: "Image is required", success: false },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock response for demo mode
      return NextResponse.json({
        success: true,
        result: {
          brand: "Demo",
          model: "Equipment",
          type: "Self-Propelled Mower",
          manualUrl: null,
          confidence: "low" as const,
          warrantyMonths: 24,
        },
      });
    }

    const userPrompt =
      method === "sticker_photo"
        ? "This is a photo of an equipment model sticker or label. Please read the text carefully and identify the brand, model number, and equipment type. Then find the owner's manual URL if possible."
        : "This is a photo of lawn care equipment. Please identify the brand, model, and type. Then find the owner's manual URL if possible.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: EQUIPMENT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mimeType,
                data: image.data,
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No response from AI", success: false },
        { status: 500 }
      );
    }

    // Parse JSON response
    try {
      // Extract JSON from response (in case there's any surrounding text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const result: EquipmentIdentificationResult = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!result.brand || !result.model || !result.type) {
        throw new Error("Missing required fields in response");
      }

      return NextResponse.json({
        success: true,
        result,
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", textContent.text);
      return NextResponse.json(
        {
          error: "Failed to parse equipment identification",
          success: false,
          rawResponse: textContent.text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Equipment identify API error:", error);
    return NextResponse.json(
      { error: "Failed to identify equipment", success: false },
      { status: 500 }
    );
  }
}
