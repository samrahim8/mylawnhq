import { getKBIndex, getSharedReferences } from "./section-parser";

// ---------------------------------------------------------------------------
// Types for Anthropic system prompt blocks
// ---------------------------------------------------------------------------

export interface TextBlockParam {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" } | null;
}

// ---------------------------------------------------------------------------
// Static response guidelines (extracted from lib/lawn-knowledge.ts lines 153-214)
// These are identical across all requests and all grass types.
// ---------------------------------------------------------------------------

const RESPONSE_GUIDELINES = `## Response Guidelines

- Be concise but thorough
- Provide specific, actionable advice
- Consider the user's local climate and conditions
- Suggest timing based on current season and weather
- Warn about common mistakes
- Recommend when professional help might be needed
- Use measurement units (inches, degrees F, sq ft)
- Be encouraging but realistic about expectations

## Safety Reminders

- Always recommend reading product labels
- Suggest protective equipment for chemical applications
- Note environmental considerations (rain, wind, heat)
- Mention pet and child safety when relevant

## Photo Analysis

When users share photos, you can identify and provide advice on:

### Grass Identification
- Identify grass types (Bermuda, Zoysia, Fescue, St. Augustine, Kentucky Bluegrass, etc.)
- Assess grass health from color, density, and blade condition
- Identify stress signs (drought, nutrient deficiency, disease, dormancy)

### Weed Identification
- Identify common lawn weeds (crabgrass, dandelion, clover, nutsedge, chickweed, henbit, etc.)
- Classify as broadleaf vs grassy weeds
- Recommend appropriate treatment based on:
  - Current season and user's climate (use their zip code)
  - Safest application method for their grass type
  - Pre-emergent vs post-emergent timing
  - Spot treatment vs broadcast application
- Always note if a weed is particularly aggressive or difficult to control

### Product Identification
When users share photos of lawn care products (fertilizer bags, weed sprays, etc.):
- Read and interpret the product label information visible
- Explain the NPK ratio and what each nutrient does
- Calculate appropriate application rates based on:
  - User's lawn size (if in their profile)
  - Product label recommendations
  - Their grass type and current season
- Provide spreader settings if possible
- Warn about any precautions (watering requirements, pet/child safety, temperature restrictions)
- Suggest optimal timing for application

### Pest & Disease Identification
- Identify common lawn pests (grubs, chinch bugs, armyworms, etc.)
- Recognize disease patterns (brown patch, dollar spot, fungal issues)
- Recommend treatment based on severity and season

When analyzing photos:
1. Describe what you see clearly
2. Provide your identification with confidence level
3. Give specific, actionable recommendations
4. Consider the user's profile (grass type, location, lawn size) when recommending treatments
5. If uncertain, suggest additional photos or professional consultation

Remember: You're helping DIY homeowners achieve professional-looking lawns. Be their trusted lawn care advisor!`;

const TODAY_INSTRUCTIONS = `\n\n## Today's Recommendation Instructions
When the user asks "What should I do today?" or similar questions:
1. Review the current weather conditions and forecast
2. Consider what activities have been done recently (avoid suggesting activities done in the last few days)
3. Account for upcoming weather (e.g., don't suggest watering if rain is expected)
4. Provide 2-3 specific, actionable recommendations based on:
   - Time since last mowing, watering, fertilizing, etc.
   - Current and upcoming weather conditions
   - Optimal lawn care schedules for their grass type
5. Explain WHY each recommendation makes sense given the conditions`;

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

/**
 * Build a minimal system prompt as TextBlockParam[] for the Anthropic API.
 *
 * Block 1: KB meta-prompt + response guidelines (CACHED — identical per grass type)
 * Block 2: Only the matched KB sections + shared references if flagged
 * Block 3: User profile + weather + activities context
 */
export function buildSystemPrompt(
  grassTypeKey: string,
  matchedSections: number[],
  profile: {
    zipCode?: string;
    grassType?: string;
    lawnSize?: string;
    sunExposure?: string;
    soilType?: string;
  },
  options: {
    injectSharedReferences: boolean;
    weatherContext?: string;
    activitiesContext?: string;
    extraContext?: string;
  }
): TextBlockParam[] {
  const kbIndex = getKBIndex();
  const parsedKB = kbIndex.get(grassTypeKey);

  const blocks: TextBlockParam[] = [];

  // ---- Block 1: Cacheable meta-prompt + response guidelines ----
  const metaPrompt = parsedKB?.metaPrompt || "You are LawnHQ's AI assistant, an expert in lawn care.";
  blocks.push({
    type: "text",
    text: `${metaPrompt}\n\n${RESPONSE_GUIDELINES}`,
    cache_control: { type: "ephemeral" },
  });

  // ---- Block 2: Matched KB sections (dynamic per question) ----
  let sectionsContent = "";
  if (parsedKB) {
    for (const secNum of matchedSections) {
      const section = parsedKB.sections.get(secNum);
      if (section) {
        sectionsContent += section.content + "\n\n";
      }
    }
  }

  if (options.injectSharedReferences) {
    const sharedRefs = getSharedReferences();
    if (sharedRefs) {
      sectionsContent += "\n\n" + sharedRefs;
    }
  }

  if (sectionsContent.trim()) {
    blocks.push({
      type: "text",
      text: sectionsContent.trim(),
    });
  }

  // ---- Block 3: User context (profile + weather + activities) ----
  let contextText = "";

  // User profile
  const profileParts: string[] = [];
  if (profile.zipCode) profileParts.push(`Location: ${profile.zipCode}`);
  if (profile.grassType) profileParts.push(`Grass type: ${profile.grassType}`);
  if (profile.lawnSize) profileParts.push(`Lawn size: ${profile.lawnSize}`);
  if (profile.sunExposure) profileParts.push(`Sun exposure: ${profile.sunExposure}`);
  if (profile.soilType) profileParts.push(`Soil type: ${profile.soilType}`);

  if (profileParts.length > 0) {
    contextText += `## User's Lawn Profile\n${profileParts.join("\n")}\n\nUse this information to personalize your advice.`;
  }

  // Weather context
  if (options.weatherContext) {
    contextText += options.weatherContext;
  }

  // Activities context
  if (options.activitiesContext) {
    contextText += options.activitiesContext;
  }

  // Extra context (e.g. Pl@ntNet weed identification results)
  if (options.extraContext) {
    contextText += options.extraContext;
  }

  // Today's recommendation instructions (only when weather or activities present)
  if (options.weatherContext || options.activitiesContext) {
    contextText += TODAY_INSTRUCTIONS;
  }

  if (contextText.trim()) {
    blocks.push({
      type: "text",
      text: contextText.trim(),
    });
  }

  return blocks;
}
