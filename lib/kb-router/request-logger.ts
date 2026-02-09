import { ModelTier } from "./model-selector";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RequestLogEntry {
  timestamp: string;
  model: string;
  modelTier: ModelTier;
  sectionsInjected: number[];
  grassType: string | null;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  estimatedCostUSD: number;
  questionPreview: string;
  // Pl@ntNet image classification tracking
  plantnetCalled: boolean;
  plantnetSpecies: string | null;
  plantnetConfidence: number | null;
  plantnetFallback: string | null; // null = success, otherwise reason (e.g. "low confidence", "timeout", "not in lookup")
}

// ---------------------------------------------------------------------------
// Cost rates per million tokens (approximate, early 2026)
// ---------------------------------------------------------------------------

const COST_PER_M_INPUT: Record<ModelTier, number> = {
  haiku: 0.80,
  sonnet: 3.00,
  opus: 15.00,
};

const COST_PER_M_OUTPUT: Record<ModelTier, number> = {
  haiku: 4.00,
  sonnet: 15.00,
  opus: 75.00,
};

// Cached input tokens are cheaper (typically 90% discount)
const COST_PER_M_CACHE_READ: Record<ModelTier, number> = {
  haiku: 0.08,
  sonnet: 0.30,
  opus: 1.50,
};

// ---------------------------------------------------------------------------
// Cost calculation
// ---------------------------------------------------------------------------

export function calculateCost(
  modelTier: ModelTier,
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number = 0
): number {
  // Non-cached input tokens = total input - cache read tokens
  const uncachedInput = Math.max(0, inputTokens - cacheReadTokens);
  return (
    (uncachedInput / 1_000_000) * COST_PER_M_INPUT[modelTier] +
    (cacheReadTokens / 1_000_000) * COST_PER_M_CACHE_READ[modelTier] +
    (outputTokens / 1_000_000) * COST_PER_M_OUTPUT[modelTier]
  );
}

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------

export function logRequest(entry: RequestLogEntry): void {
  console.log(
    JSON.stringify({
      type: "kb-router-request",
      ...entry,
    })
  );
}
