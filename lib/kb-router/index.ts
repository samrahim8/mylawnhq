export type { Complexity, KBSection, ParsedKBFile } from "./section-parser";
export { getKBIndex, getSharedReferences, getAvailableGrassTypes } from "./section-parser";

export type { ClassificationResult } from "./question-classifier";
export { classifyQuestion } from "./question-classifier";

export type { ModelTier } from "./model-selector";
export { MODEL_IDS, selectModel } from "./model-selector";

export type { TextBlockParam } from "./prompt-builder";
export { buildSystemPrompt } from "./prompt-builder";

export type { RequestLogEntry } from "./request-logger";
export { logRequest, calculateCost } from "./request-logger";

export type { WeedEntry, WeedType } from "./weed-lookup";
export { lookupWeed, WEED_LOOKUP } from "./weed-lookup";

export type { PlantNetResult } from "./image-classifier";
export { classifyImage } from "./image-classifier";

import { classifyQuestion } from "./question-classifier";
import { selectModel } from "./model-selector";
import { buildSystemPrompt, TextBlockParam } from "./prompt-builder";
import { ModelTier } from "./model-selector";
import { Complexity } from "./section-parser";
import { classifyImage, PlantNetResult } from "./image-classifier";
import { ChatImage } from "@/types";

// ---------------------------------------------------------------------------
// Public API types
// ---------------------------------------------------------------------------

export interface RouteResult {
  model: string;
  modelTier: ModelTier;
  systemPrompt: TextBlockParam[];
  sections: number[];
  complexity: Complexity;
  sharedReferencesIncluded: boolean;
  isWeedIdIntent: boolean;
  plantnet: PlantNetResult | null;
  /** When true, images should NOT be sent to Claude — Pl@ntNet handled it */
  stripImages: boolean;
}

// Grass type keys that map to KB files (matches UserProfile.grassType)
const VALID_GRASS_TYPES = new Set([
  "bermuda",
  "zoysia",
  "st-augustine",
  "fescue-kbg",
]);

// ---------------------------------------------------------------------------
// routeQuestion — single entry point for the router
// ---------------------------------------------------------------------------

/**
 * Route a user question to the appropriate model and build a minimal system prompt.
 *
 * Now async because it may call the Pl@ntNet API for weed/plant image classification.
 *
 * @param question - The user's question text
 * @param profile  - The user's lawn profile (grassType, zipCode, etc.)
 * @param options  - Optional: hasImages, images, weatherContext, activitiesContext
 * @returns RouteResult with model, systemPrompt, sections, complexity, plantnet data
 */
export async function routeQuestion(
  question: string,
  profile: {
    zipCode?: string;
    grassType?: string;
    lawnSize?: string;
    sunExposure?: string;
    soilType?: string;
  },
  options?: {
    hasImages?: boolean;
    images?: ChatImage[];
    weatherContext?: string;
    activitiesContext?: string;
  }
): Promise<RouteResult> {
  const hasImages = options?.hasImages ?? false;

  // 1. Map grass type to KB key (default to bermuda if unknown)
  const grassTypeKey = VALID_GRASS_TYPES.has(profile.grassType ?? "")
    ? profile.grassType!
    : "bermuda";

  // 2. Classify question → matched sections + weed ID intent
  const classification = classifyQuestion(question);

  // 3. If weed ID intent + images present → try Pl@ntNet first
  let plantnet: PlantNetResult | null = null;
  let plantnetSuccess = false;

  if (classification.isWeedIdIntent && hasImages && options?.images?.length) {
    const firstImage = options.images[0];
    plantnet = await classifyImage(firstImage.data, firstImage.mimeType);
    plantnetSuccess = plantnet.called && plantnet.weedEntry !== null;
  }

  // 4. Select model based on complexity + images + plantnet result
  const { model, modelTier } = selectModel(
    classification.maxComplexity,
    classification.matchedSections,
    {
      hasImages,
      isWeedIdIntent: classification.isWeedIdIntent,
      plantnetSuccess,
    }
  );

  // 5. Build system prompt (only matched sections + context)
  //    If Pl@ntNet succeeded, inject the weed name + treatment into context
  let extraContext: string | undefined;
  if (plantnetSuccess && plantnet?.weedEntry) {
    const w = plantnet.weedEntry;
    extraContext = [
      `\n\n## Identified Weed (via Pl@ntNet image recognition)`,
      `- **Species:** ${plantnet.species}`,
      `- **Common name:** ${w.commonName}`,
      `- **Type:** ${w.type} weed`,
      `- **Confidence:** ${((plantnet.confidence ?? 0) * 100).toFixed(1)}%`,
      `- **Treatment protocol:** ${w.kbTreatment}`,
      ``,
      `Use the treatment protocol above as the primary answer. Section 6 (Weed Control) is included as backup context. Tailor the advice to the user's grass type and region.`,
    ].join("\n");
  }

  const systemPrompt = buildSystemPrompt(
    grassTypeKey,
    classification.matchedSections,
    profile,
    {
      injectSharedReferences: classification.injectSharedReferences,
      weatherContext: options?.weatherContext,
      activitiesContext: options?.activitiesContext,
      extraContext,
    }
  );

  return {
    model,
    modelTier,
    systemPrompt,
    sections: classification.matchedSections,
    complexity: classification.maxComplexity,
    sharedReferencesIncluded: classification.injectSharedReferences,
    isWeedIdIntent: classification.isWeedIdIntent,
    plantnet,
    stripImages: plantnetSuccess,
  };
}
