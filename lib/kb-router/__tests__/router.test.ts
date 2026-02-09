/**
 * KB Router test suite
 *
 * Run with: npx tsx lib/kb-router/__tests__/router.test.ts
 *
 * Tests routing logic: question → model + sections selection.
 * Does NOT call the Anthropic API.
 *
 * For Pl@ntNet tests, we mock the image-classifier module to simulate
 * API responses without needing a real API key or network call.
 */

import { routeQuestion, RouteResult } from "../index";
import { getKBIndex } from "../section-parser";
import { classifyQuestion } from "../question-classifier";
import { selectModel } from "../model-selector";

// ---------------------------------------------------------------------------
// Test cases — existing (synchronous routing, no images passed to routeQuestion)
// ---------------------------------------------------------------------------

interface TestCase {
  name: string;
  question: string;
  grassType: string;
  hasImages: boolean;
  expectedModel: "haiku" | "sonnet" | "opus";
  expectedSections: number[];
  expectedSharedRefs: boolean;
  expectedWeedIdIntent?: boolean;
}

const TEST_CASES: TestCase[] = [
  {
    name: "Simple mowing question → Haiku",
    question: "How tall should I mow my bermuda grass?",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [2],
    expectedSharedRefs: false,
  },
  {
    name: "Fertilizer + season → Haiku (both simple)",
    question: "What fertilizer should I use in spring?",
    grassType: "fescue-kbg",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [4, 5],
    expectedSharedRefs: false,
  },
  {
    name: "Brown patches + pulls up → Sonnet (pest/disease/troubleshoot)",
    question: "I have brown patches and the grass pulls up easily",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "sonnet",
    expectedSections: [8, 11],
    expectedSharedRefs: false,
  },
  {
    name: "Weed ID with photo (no Pl@ntNet) → Sonnet (image, no multi-factor)",
    question: "What is this weed?",
    grassType: "st-augustine",
    hasImages: true,
    expectedModel: "sonnet",
    expectedSections: [6],
    expectedSharedRefs: false,
    expectedWeedIdIntent: true,
  },
  {
    name: "Pre-emergent timing → Haiku (weed control = simple)",
    question: "When should I apply pre-emergent?",
    grassType: "zoysia",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [5, 6],
    expectedSharedRefs: false,
  },
  {
    name: "Mostly weeds → Sonnet (troubleshooting = reasoning)",
    question: "My lawn is mostly weeds, what should I do?",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "sonnet",
    expectedSections: [6, 11],
    expectedSharedRefs: false,
  },
  {
    name: "Product for grubs → Sonnet + shared refs",
    question: "What product should I buy for grubs?",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "sonnet",
    expectedSections: [7, 12],
    expectedSharedRefs: true,
  },
  {
    name: "Watering frequency → Haiku",
    question: "How often should I water?",
    grassType: "fescue-kbg",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [3],
    expectedSharedRefs: false,
  },
  {
    name: "Multi-symptom with photo → Opus (multi-factor + image)",
    question: "My grass is turning yellow with brown spots and I see bugs",
    grassType: "st-augustine",
    hasImages: true,
    expectedModel: "opus",
    expectedSections: [7, 8, 11],
    expectedSharedRefs: false,
  },
  {
    name: "Soil pH → Haiku",
    question: "Tell me about my soil pH",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [9],
    expectedSharedRefs: false,
  },
  {
    name: "Unknown question → Haiku (fallback to Section 1+5)",
    question: "Hello, nice to meet you",
    grassType: "bermuda",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [1, 5],
    expectedSharedRefs: false,
  },
  {
    name: "New lawn establishment → Haiku",
    question: "I want to seed a new lawn from scratch",
    grassType: "fescue-kbg",
    hasImages: false,
    expectedModel: "haiku",
    expectedSections: [10],
    expectedSharedRefs: false,
  },
];

// ---------------------------------------------------------------------------
// Weed ID intent unit tests (classifier only — no async needed)
// ---------------------------------------------------------------------------

interface WeedIdTest {
  name: string;
  question: string;
  expectedWeedIdIntent: boolean;
}

const WEED_ID_TESTS: WeedIdTest[] = [
  {
    name: "\"What is this weed?\" → weed ID intent",
    question: "What is this weed?",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"Identify this plant\" → weed ID intent",
    question: "Identify this plant",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"What's growing in my lawn\" → weed ID intent",
    question: "What's growing in my lawn?",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"Is this crabgrass?\" → weed ID intent",
    question: "Is this crabgrass?",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"What kind of weed is this\" → weed ID intent",
    question: "What kind of weed is this?",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"Help me identify this\" → weed ID intent",
    question: "Help me identify this",
    expectedWeedIdIntent: true,
  },
  {
    name: "\"How tall should I mow?\" → NOT weed ID intent",
    question: "How tall should I mow?",
    expectedWeedIdIntent: false,
  },
  {
    name: "\"When to apply pre-emergent?\" → NOT weed ID intent",
    question: "When should I apply pre-emergent?",
    expectedWeedIdIntent: false,
  },
  {
    name: "\"How does my lawn look overall?\" → NOT weed ID intent",
    question: "How does my lawn look overall?",
    expectedWeedIdIntent: false,
  },
];

// ---------------------------------------------------------------------------
// Pl@ntNet model selection simulation tests (uses selectModel directly)
// ---------------------------------------------------------------------------

interface PlantNetModelTest {
  name: string;
  hasImages: boolean;
  isWeedIdIntent: boolean;
  plantnetSuccess: boolean;
  matchedSections: number[];
  maxComplexity: "simple" | "reasoning";
  expectedModel: "haiku" | "sonnet" | "opus";
}

const PLANTNET_MODEL_TESTS: PlantNetModelTest[] = [
  {
    name: "Weed photo + Pl@ntNet success → Haiku (no image to Claude)",
    hasImages: true,
    isWeedIdIntent: true,
    plantnetSuccess: true,
    matchedSections: [6],
    maxComplexity: "simple",
    expectedModel: "haiku",
  },
  {
    name: "Weed photo + Pl@ntNet low confidence → Sonnet (image to Claude)",
    hasImages: true,
    isWeedIdIntent: true,
    plantnetSuccess: false,
    matchedSections: [6],
    maxComplexity: "simple",
    expectedModel: "sonnet",
  },
  {
    name: "Non-weed photo (\"how does my lawn look?\") → Sonnet, skips Pl@ntNet",
    hasImages: true,
    isWeedIdIntent: false,
    plantnetSuccess: false,
    matchedSections: [1, 5],
    maxComplexity: "simple",
    expectedModel: "sonnet",
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

async function run() {
  console.log("\n=== KB Router Test Suite ===\n");

  // Verify KB index loaded
  const kbIndex = getKBIndex();
  console.log(`KB files loaded: ${kbIndex.size}`);
  kbIndex.forEach((parsed, key) => {
    console.log(`  ${key}: ${parsed.sections.size} sections, meta-prompt: ${parsed.metaPrompt.length > 0 ? "yes" : "NO"}`);
  });
  console.log();

  let passed = 0;
  let failed = 0;

  // ---- Section 1: Core routing tests (async) ----
  console.log("--- Core routing tests ---\n");

  for (const tc of TEST_CASES) {
    const result: RouteResult = await routeQuestion(
      tc.question,
      { grassType: tc.grassType },
      { hasImages: tc.hasImages }
    );

    const modelOk = result.modelTier === tc.expectedModel;
    const sectionsOk = arraysEqual(result.sections, tc.expectedSections);
    const refsOk = result.sharedReferencesIncluded === tc.expectedSharedRefs;
    const weedIdOk =
      tc.expectedWeedIdIntent === undefined ||
      result.isWeedIdIntent === tc.expectedWeedIdIntent;
    const allOk = modelOk && sectionsOk && refsOk && weedIdOk;

    if (allOk) {
      passed++;
      console.log(`  PASS  ${tc.name}`);
      console.log(`        Model: ${result.modelTier} | Sections: [${result.sections}] | SharedRefs: ${result.sharedReferencesIncluded} | WeedId: ${result.isWeedIdIntent}`);
    } else {
      failed++;
      console.log(`  FAIL  ${tc.name}`);
      console.log(`        Question: "${tc.question}"`);
      if (!modelOk)
        console.log(`        Model:    expected=${tc.expectedModel}, got=${result.modelTier}`);
      if (!sectionsOk)
        console.log(`        Sections: expected=[${tc.expectedSections}], got=[${result.sections}]`);
      if (!refsOk)
        console.log(`        SharedRefs: expected=${tc.expectedSharedRefs}, got=${result.sharedReferencesIncluded}`);
      if (!weedIdOk)
        console.log(`        WeedIdIntent: expected=${tc.expectedWeedIdIntent}, got=${result.isWeedIdIntent}`);
    }
    console.log();
  }

  // ---- Section 2: Weed ID intent classifier tests ----
  console.log("--- Weed ID intent tests ---\n");

  for (const tc of WEED_ID_TESTS) {
    const classification = classifyQuestion(tc.question);
    const ok = classification.isWeedIdIntent === tc.expectedWeedIdIntent;

    if (ok) {
      passed++;
      console.log(`  PASS  ${tc.name}`);
    } else {
      failed++;
      console.log(`  FAIL  ${tc.name}`);
      console.log(`        Expected isWeedIdIntent=${tc.expectedWeedIdIntent}, got=${classification.isWeedIdIntent}`);
    }
    console.log();
  }

  // ---- Section 3: Pl@ntNet model selection tests ----
  console.log("--- Pl@ntNet model selection tests ---\n");

  for (const tc of PLANTNET_MODEL_TESTS) {
    const { modelTier } = selectModel(
      tc.maxComplexity,
      tc.matchedSections,
      {
        hasImages: tc.hasImages,
        isWeedIdIntent: tc.isWeedIdIntent,
        plantnetSuccess: tc.plantnetSuccess,
      }
    );
    const ok = modelTier === tc.expectedModel;

    if (ok) {
      passed++;
      console.log(`  PASS  ${tc.name}`);
      console.log(`        Model: ${modelTier}`);
    } else {
      failed++;
      console.log(`  FAIL  ${tc.name}`);
      console.log(`        Expected model=${tc.expectedModel}, got=${modelTier}`);
    }
    console.log();
  }

  // Summary
  const total = TEST_CASES.length + WEED_ID_TESTS.length + PLANTNET_MODEL_TESTS.length;
  console.log("─".repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed, ${total} total`);
  console.log("─".repeat(50));

  // Also show prompt size for a sample question
  const sampleResult = await routeQuestion(
    "How tall should I mow my bermuda grass?",
    { grassType: "bermuda", zipCode: "30301" }
  );
  const totalChars = sampleResult.systemPrompt.reduce((sum, b) => sum + b.text.length, 0);
  console.log(`\nSample prompt size (simple mowing question):`);
  console.log(`  ${sampleResult.systemPrompt.length} blocks, ~${totalChars} chars, ~${Math.round(totalChars / 4)} tokens`);
  console.log(`  Block 1 (cached): ${sampleResult.systemPrompt[0]?.text.length ?? 0} chars`);
  if (sampleResult.systemPrompt[1])
    console.log(`  Block 2 (sections): ${sampleResult.systemPrompt[1]?.text.length ?? 0} chars`);
  if (sampleResult.systemPrompt[2])
    console.log(`  Block 3 (context): ${sampleResult.systemPrompt[2]?.text.length ?? 0} chars`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
