import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EquipmentIdentificationResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EQUIPMENT_LOOKUP_PROMPT = `You are an expert at identifying lawn care and outdoor power equipment. Your task is to identify equipment from a model number or serial number and provide complete details.

## Instructions

When given a model number or serial number:
1. Identify the BRAND (e.g., Honda, Toro, John Deere, Scotts, EGO, Stihl, Husqvarna, Fiskars, EarthWay)
2. Confirm or derive the MODEL number
3. Categorize the equipment TYPE (e.g., "Self-Propelled Mower", "Push Mower", "Broadcast Spreader", "Riding Mower", "String Trimmer")
4. Search your knowledge for the official owner's manual URL
5. Provide the typical WARRANTY duration in months for residential use

## Model Number Patterns

Common model number patterns to recognize:
- Honda mowers: HRX217, HRR216, HRN216 (letters + numbers)
- Toro: 21xxx, 22xxx series
- John Deere: E, S, X series (E100, S130, X350)
- EGO: LM2xxx (mowers), ST15xx (trimmers)
- Stihl: BR xxx (blowers), MS xxx (saws)
- EarthWay: 2xxx series spreaders (2150, 2600, 2050)
- Scotts: spreader numbers like 76121, 71133

## Serial Number Patterns

Serial numbers often contain:
- Manufacturing codes and dates
- Model identification prefixes
- For Honda: MZCG, MAAA, etc.

## Known Manual URL Patterns

Use these verified URL patterns when possible:
- Honda Power Equipment: http://cdn.powerequipment.honda.com/pe/pdf/manuals/[manual-id].pdf
- EGO: https://egopowerplus.com/support/
- Stihl: https://www.stihl.com/
- EarthWay: https://earthway.com/product-support/
- Scotts: https://www.scotts.com/en-us/support

If you cannot find a verified manual URL, set manualUrl to null.

## Known Warranty Periods (Residential Use)

Use these typical warranty durations:
- Honda Power Equipment: 36 months
- EGO (battery tools): 60 months for batteries, 36 months for tools
- Husqvarna: 36 months
- Toro: 24 months
- John Deere: 24 months (residential)
- Stihl: 24 months
- Scotts spreaders: 36 months
- EarthWay spreaders: 24 months
- Fiskars: 24 months
- Greenworks: 48 months
- Ryobi: 36 months

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
- "high": Clear model number match, certain of identification
- "medium": Partial match or common model pattern recognized
- "low": Best guess based on number pattern`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier } = body as {
      identifier: string;
    };

    if (!identifier || identifier.trim().length < 2) {
      return NextResponse.json(
        { error: "Model or serial number is required", success: false },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock response for demo mode
      return NextResponse.json({
        success: true,
        result: {
          brand: "Demo",
          model: identifier.trim(),
          type: "Equipment",
          manualUrl: null,
          confidence: "low" as const,
          warrantyMonths: 24,
        },
      });
    }

    const userPrompt = `Please identify this lawn equipment from the model number or serial number: "${identifier.trim()}"

Identify the brand, full model name, equipment type, owner's manual URL, and warranty period. If this looks like a serial number, try to determine the brand and model from the serial number pattern.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: EQUIPMENT_LOOKUP_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
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
          error: "Failed to identify equipment from that number",
          success: false,
          rawResponse: textContent.text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Equipment lookup API error:", error);
    return NextResponse.json(
      { error: "Failed to look up equipment", success: false },
      { status: 500 }
    );
  }
}
