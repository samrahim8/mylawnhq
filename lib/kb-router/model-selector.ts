import { Complexity } from "./section-parser";

// ---------------------------------------------------------------------------
// Model tiers and IDs
// ---------------------------------------------------------------------------

export type ModelTier = "haiku" | "sonnet" | "opus";

export const MODEL_IDS: Record<ModelTier, string> = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-5-20250929",
  opus: "claude-opus-4-6",
};

// ---------------------------------------------------------------------------
// Model selection logic
// ---------------------------------------------------------------------------

/**
 * Select the cheapest model that can handle the question's complexity.
 *
 * Priority (highest to lowest):
 * 1. Opus  — multi-factor troubleshooting WITH images (Section 11 + 2+ reasoning sections + photo)
 * 2. Sonnet — image present (non-weed intent, or weed intent where Pl@ntNet failed), OR reasoning
 * 3. Haiku  — everything else, INCLUDING weed ID when Pl@ntNet succeeded (no image sent)
 *
 * When plantnetSuccess is true the image is NOT sent to Claude — Haiku gets
 * the weed name + treatment protocol from the lookup table instead.
 */
export function selectModel(
  maxComplexity: Complexity,
  matchedSections: number[],
  options: {
    hasImages: boolean;
    isWeedIdIntent?: boolean;
    plantnetSuccess?: boolean;
  }
): { model: string; modelTier: ModelTier } {
  // Count how many reasoning sections (7, 8, 11) were matched
  const reasoningSections = matchedSections.filter((s) =>
    [7, 8, 11].includes(s)
  );
  const isMultiFactorTroubleshooting =
    matchedSections.includes(11) && reasoningSections.length >= 2;

  // Priority 0: Weed ID + Pl@ntNet success → Haiku (no image to Claude)
  if (options.isWeedIdIntent && options.plantnetSuccess) {
    return { model: MODEL_IDS.haiku, modelTier: "haiku" };
  }

  // Priority 1: Opus — multi-factor troubleshooting WITH images
  if (options.hasImages && isMultiFactorTroubleshooting) {
    return { model: MODEL_IDS.opus, modelTier: "opus" };
  }

  // Priority 2: Sonnet — any image, OR any reasoning section
  if (options.hasImages || maxComplexity === "reasoning") {
    return { model: MODEL_IDS.sonnet, modelTier: "sonnet" };
  }

  // Priority 3: Haiku — default
  return { model: MODEL_IDS.haiku, modelTier: "haiku" };
}
