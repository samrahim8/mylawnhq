import { lookupWeed, WeedEntry } from "./weed-lookup";

// ---------------------------------------------------------------------------
// Pl@ntNet image classification
//
// Sends a base64 image to the Pl@ntNet Identify API and checks the result
// against our weed lookup table. If the species is recognized AND confidence
// is ≥ 70%, we return the weed entry so Haiku can answer without ever
// seeing the photo.
// ---------------------------------------------------------------------------

const PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify/all";
const PLANTNET_TIMEOUT_MS = 3_000;
const CONFIDENCE_THRESHOLD = 0.7;

export interface PlantNetResult {
  called: boolean;
  species: string | null;
  commonName: string | null;
  confidence: number | null;
  weedEntry: WeedEntry | null;
  fallbackReason: string | null;
}

/**
 * Classify an image via Pl@ntNet.
 *
 * @param base64Data - Raw base64 image data (no data: prefix)
 * @param mimeType   - MIME type of the image
 * @returns PlantNetResult with the species match or fallback reason
 */
export async function classifyImage(
  base64Data: string,
  mimeType: string
): Promise<PlantNetResult> {
  const apiKey = process.env.PLANTNET_API_KEY;

  if (!apiKey) {
    return {
      called: false,
      species: null,
      commonName: null,
      confidence: null,
      weedEntry: null,
      fallbackReason: "PLANTNET_API_KEY not configured",
    };
  }

  try {
    // Pl@ntNet accepts multipart/form-data with image files.
    // We convert base64 to a Blob and send as form data.
    const imageBuffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([imageBuffer], { type: mimeType });

    const formData = new FormData();
    formData.append("images", blob, `photo.${mimeType.split("/")[1] || "jpg"}`);
    // Organs hint — "leaf" is a reasonable default for lawn weed photos
    formData.append("organs", "auto");

    const url = `${PLANTNET_BASE_URL}?include-related-images=false&no-reject=false&nb-results=3&lang=en&api-key=${apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PLANTNET_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        called: true,
        species: null,
        commonName: null,
        confidence: null,
        weedEntry: null,
        fallbackReason: `Pl@ntNet API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = (await response.json()) as PlantNetAPIResponse;

    // Pl@ntNet returns results sorted by score (highest first)
    const topResult = data.results?.[0];
    if (!topResult) {
      return {
        called: true,
        species: null,
        commonName: null,
        confidence: null,
        weedEntry: null,
        fallbackReason: "Pl@ntNet returned no results",
      };
    }

    const scientificName = topResult.species?.scientificNameWithoutAuthor ?? "";
    const confidence = topResult.score ?? 0;

    // Check confidence threshold
    if (confidence < CONFIDENCE_THRESHOLD) {
      return {
        called: true,
        species: scientificName || null,
        commonName: null,
        confidence,
        weedEntry: null,
        fallbackReason: `Low confidence: ${(confidence * 100).toFixed(1)}% (threshold: ${CONFIDENCE_THRESHOLD * 100}%)`,
      };
    }

    // Check if the species is in our weed lookup table
    const weedEntry = lookupWeed(scientificName);
    if (!weedEntry) {
      return {
        called: true,
        species: scientificName,
        commonName: null,
        confidence,
        weedEntry: null,
        fallbackReason: `Species "${scientificName}" not in weed lookup table`,
      };
    }

    // Success — we have a high-confidence weed match
    return {
      called: true,
      species: scientificName,
      commonName: weedEntry.commonName,
      confidence,
      weedEntry,
      fallbackReason: null,
    };
  } catch (error: unknown) {
    const isTimeout =
      error instanceof DOMException && error.name === "AbortError";
    return {
      called: true,
      species: null,
      commonName: null,
      confidence: null,
      weedEntry: null,
      fallbackReason: isTimeout
        ? "Pl@ntNet timeout (>3s)"
        : `Pl@ntNet error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Pl@ntNet API response types (subset we care about)
// ---------------------------------------------------------------------------

interface PlantNetAPIResponse {
  results?: PlantNetAPIResult[];
}

interface PlantNetAPIResult {
  score?: number;
  species?: {
    scientificNameWithoutAuthor?: string;
    scientificNameAuthorship?: string;
    genus?: { scientificNameWithoutAuthor?: string };
    family?: { scientificNameWithoutAuthor?: string };
    commonNames?: string[];
  };
}
