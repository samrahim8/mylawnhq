import { DecisionTree } from "@/types";

export const BERMUDA_DECISION_TREES: DecisionTree[] = [
  {
    id: "bdt-mostly-weeds",
    trigger_question: "My lawn is mostly weeds, what do I do?",
    slug: "mostly-weeds",
    keywords: [
      "weeds",
      "mostly weeds",
      "full of weeds",
      "weed problem",
      "curtain of death",
      "weed lawn",
      "too many weeds",
      "overrun",
      "all weeds",
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Use the 'Curtain of Death' protocol during warm/hot months.",
        condition: "Lawn is 70%+ weeds",
        next_step: 2,
      },
      {
        step: 2,
        instruction:
          "Apply a mix of ALL weed killers + pre-emergent during warm months.",
        products: [
          "b-q4-plus",
          "b-southern-ag-24d",
          "b-bioadvanced-aio",
          "b-granular-pe",
        ],
        next_step: 3,
      },
      {
        step: 3,
        instruction:
          "Bermuda will brown out too — but it won't die. This is expected.",
        next_step: 4,
      },
      {
        step: 4,
        instruction: "Fertilize with PGF Complete + water heavily.",
        products: ["b-pgf-complete"],
        next_step: 5,
      },
      {
        step: 5,
        instruction:
          "Only Bermuda comes back. Weeds die, Bermuda recovers.",
        next_step: 6,
      },
      {
        step: 6,
        instruction:
          "Next year: start a strict pre-emergent program to prevent new weeds.",
        products: ["b-granular-pe", "b-liquid-pe"],
        next_step: null,
      },
    ],
  },

  {
    id: "bdt-seed-or-wait",
    trigger_question: "Should I seed or wait?",
    slug: "seed-or-wait",
    keywords: [
      "seed",
      "seeding",
      "should I seed",
      "overseed",
      "bare spots",
      "thin lawn",
      "bare patches",
      "plant seed",
      "reseed",
      "fill in",
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Is lawn 70%+ Bermuda? → DON'T seed. Let it spread naturally. 99% of lawns can be restored without seeding.",
        condition: "Lawn is 70%+ Bermuda",
        next_step: null,
      },
      {
        step: 2,
        instruction:
          "Have bare spots? → Steal runners from sidewalk/driveway edges and transplant them.",
        condition: "Bare spots present",
        next_step: null,
      },
      {
        step: 3,
        instruction:
          "Must seed? → Use quality seed varieties (Arden 15, LaPrima XD, Yukon, Black Jack). NEVER use big box common seed.",
        products: [
          "b-seed-arden-15",
          "b-seed-laprima-xd",
          "b-seed-yukon",
          "b-seed-black-jack",
        ],
        next_step: 4,
      },
      {
        step: 4,
        instruction: "Are daytime temps in the 80s? → Good to go, plant now.",
        condition: "Temps in 80s",
        next_step: null,
      },
      {
        step: 5,
        instruction: "Below 80s? → Wait until temps reach the 80s.",
        condition: "Temps below 80s",
        next_step: null,
      },
    ],
  },

  {
    id: "bdt-yellow-grass",
    trigger_question: "My grass is yellow",
    slug: "yellow-grass",
    keywords: [
      "yellow",
      "yellowing",
      "yellow grass",
      "yellow blades",
      "chlorosis",
      "turning yellow",
      "pale",
      "light green",
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Check watering — are you over-watering? Constantly wet soil causes chlorosis.",
        next_step: 2,
      },
      {
        step: 2,
        instruction:
          "Check pH — is it too high? High pH locks up iron so grass can't access it.",
        next_step: 3,
      },
      {
        step: 3,
        instruction:
          "Check fertilizer — are you using high-phosphorus products like Milorganite? Excess phosphorus locks up other nutrients.",
        next_step: 4,
      },
      {
        step: 4,
        instruction: "Quick fix: Spray Super Juice + extra liquid iron.",
        products: ["b-super-juice"],
        next_step: 5,
      },
      {
        step: 5,
        instruction:
          "Long-term: Get a soil test to identify the root cause.",
        products: ["b-soil-test-kit"],
        next_step: null,
      },
    ],
  },

  {
    id: "bdt-brown-patches",
    trigger_question: "Brown patches appearing",
    slug: "brown-patches",
    keywords: [
      "brown patches",
      "brown spots",
      "dead spots",
      "dying patches",
      "brown areas",
      "dead areas",
      "patches dying",
      "brown patch",
      "dollar spot",
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Pull test: Does the brown grass lift up easily? If YES → likely GRUBS (check 2-6 inches deep for white worms).",
        condition: "Grass lifts easily",
        next_step: 3,
      },
      {
        step: 2,
        instruction:
          "Doesn't lift? → Likely FUNGUS (dollar spot = small circular patches, brown patch = larger irregular patches).",
        condition: "Grass doesn't lift",
        next_step: 4,
      },
      {
        step: 3,
        instruction:
          "Grubs confirmed → Apply Dou-Kill at HEAVY rate, water heavily into ground to reach grubs at 2-6 inch depth.",
        products: ["b-dou-kill"],
        next_step: null,
      },
      {
        step: 4,
        instruction:
          "Fungus confirmed → Apply PRO DG fungicide at bag rate. After 3 applications, rotate to BioAdvanced spray to prevent resistance.",
        products: ["b-pro-dg-fungicide", "b-bioadvanced-fungicide"],
        next_step: null,
      },
    ],
  },

  {
    id: "bdt-spring-start",
    trigger_question: "When do I start in spring?",
    slug: "spring-start",
    keywords: [
      "spring",
      "when to start",
      "start in spring",
      "spring schedule",
      "beginning of season",
      "wake up",
      "first thing",
      "early spring",
      "kick start",
      "getting started",
    ],
    steps: [
      {
        step: 1,
        instruction:
          "Soil temps hit 50°F → Apply Kick Start: pre-emergent + HUMICHAR + PGF 10-10-10 simultaneously.",
        products: ["b-granular-pe", "b-humichar", "b-pgf-balance"],
        condition: "Soil temps ~50°F",
        next_step: 2,
      },
      {
        step: 2,
        instruction:
          "Green haze appears across lawn + daily temps in 70s → Spring scalp to 50% of desired height.",
        products: ["b-mclane-reel"],
        condition: "Green haze + daily 70s",
        next_step: 3,
      },
      {
        step: 3,
        instruction:
          "Soil temps hit 51-53°F → First pre-emergent application (granular).",
        products: ["b-granular-pe"],
        condition: "Soil temps 51-53°F",
        next_step: 4,
      },
      {
        step: 4,
        instruction:
          "After scalping → Second pre-emergent application (liquid with post-emergent properties).",
        products: ["b-liquid-pe"],
        next_step: 5,
      },
      {
        step: 5,
        instruction:
          "Temps in 80s → First PGF Complete application + begin Super Juice spray program every 2-3 weeks.",
        products: ["b-pgf-complete", "b-super-juice"],
        condition: "Temps in 80s",
        next_step: null,
      },
    ],
  },
];

export function getDecisionTreeBySlug(
  slug: string
): DecisionTree | undefined {
  return BERMUDA_DECISION_TREES.find((dt) => dt.slug === slug);
}

export function matchDecisionTree(
  query: string
): DecisionTree | undefined {
  const lower = query.toLowerCase();
  return BERMUDA_DECISION_TREES.find((dt) =>
    dt.keywords.some((kw) => lower.includes(kw))
  );
}
