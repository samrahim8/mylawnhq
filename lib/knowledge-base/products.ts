import { KBProduct } from "@/types";

export const KB_PRODUCTS: KBProduct[] = [
  // ============================================
  // FERTILIZERS
  // ============================================
  {
    id: "pgf-complete-16-4-8",
    name: "PGF Complete 16-4-8",
    product_type: "fertilizer",
    npk_ratio: "16-4-8",
    release_type: "slow_release",
    use_case:
      "Primary base fertilizer for spring and fall. Mild, slow release with ideal 4-1-2 ratio. Tiny particles for best distribution. Contains iron, micronutrients, and Humic DG. Can be applied every 3-8 weeks during growing season.",
    application_season: ["early_spring", "spring", "late_summer", "fall"],
    product_url: "https://www.pgfcomplete.com/",
    notes: null,
    is_base_fertilizer: true,
  },
  {
    id: "pgf-16-0-8",
    name: "PGF Complete 16-0-8",
    product_type: "fertilizer",
    npk_ratio: "16-0-8",
    release_type: "slow_release",
    use_case:
      "Base fertilizer for lawns with HIGH phosphorus levels (per soil test). Same benefits as PGF Complete without adding more phosphorus.",
    application_season: ["early_spring", "spring", "late_summer", "fall"],
    product_url: "https://www.pgfcomplete.com/",
    notes: "Use when soil test shows excess phosphorus.",
    is_base_fertilizer: true,
  },
  {
    id: "pgf-balance-10-10-10",
    name: "PGF Balance 10-10-10",
    product_type: "fertilizer",
    npk_ratio: "10-10-10",
    release_type: "fast_release",
    use_case:
      "Jump Start program (late winter with pre-emergent) and final feeding (late fall). Fast release, balanced nutrients. Super fine particles + iron. Also used for low phosphorus boost.",
    application_season: ["late_winter", "late_fall"],
    product_url: null,
    notes: "Search 'PGF Balance 10-10-10'.",
    is_base_fertilizer: false,
  },

  // ============================================
  // SUPPLEMENTS
  // ============================================
  {
    id: "green-shocker",
    name: "Green Shocker",
    product_type: "supplement",
    npk_ratio: "7-1-2",
    release_type: "supplement",
    use_case:
      "Mild fast-release supplement for quick green-up anytime during growing season. Summer spoon feeding. Results in 3 days. Works on any grass type.",
    application_season: [
      "spring",
      "summer",
      "late_summer",
      "fall",
    ],
    product_url: "https://www.greenshocker.com/",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "super-juice",
    name: "Super Juice",
    product_type: "supplement",
    npk_ratio: null,
    release_type: "supplement",
    use_case:
      "Liquid supplement for summer spoon feeding and green-up. Contains iron for deeper green color and humic/fulvic acid. Mix with water and apply with hose-end sprayer. Very mild — won't push growth.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: "https://www.superjuicefertilizer.com/",
    notes: null,
    is_base_fertilizer: false,
  },

  // ============================================
  // SOIL AMENDMENTS
  // ============================================
  {
    id: "humichar",
    name: "HumiChar",
    product_type: "soil_amendment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "50% biochar + 50% humic acid pelletized. Long-term soil improvement — holds nutrients, creates good environment for soil microbes. Lasts for decades. NOT a nutrient, it is a soil structure improvement. Reduces long-term need for fertilizer.",
    application_season: [
      "winter",
      "late_winter",
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
      "late_fall",
    ],
    product_url: "https://www.humichar.com/",
    notes: "Can be applied any time of year. Carbon is the lifeblood of soil.",
    is_base_fertilizer: false,
  },
  {
    id: "dirt-booster",
    name: "Dirt Booster",
    product_type: "soil_amendment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "All-natural compost starter / soil amendment. Contains corn distillates, molasses, biochar, humic acid. Includes microbe and fungus booster spray pack. Feeds soil microbes and mycorrhizal fungi. Helps reduce thatch buildup.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: "https://www.dirtbooster.com/",
    notes:
      "Apply when soil temps 65\u00B0F+ and air temps above 80\u00B0F. As often as desired.",
    is_base_fertilizer: false,
  },

  // ============================================
  // PRE-EMERGENTS
  // ============================================
  {
    id: "dg-pre-emergent",
    name: "Granular DG Pre-Emergent",
    product_type: "pre_emergent",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Step 1 of split pre-emergent program. Dispersible granule breaks into 1000s of sub-particles for thorough coverage. Apply when soil temp reaches 51-53\u00B0F, ideally 2 weeks before target date.",
    application_season: ["late_winter", "late_fall"],
    product_url: null,
    notes:
      "Search 'Andersons DG Pro pre-emergent'. Available in 18 and 40 lb bags.",
    is_base_fertilizer: false,
  },
  {
    id: "spray-pre-emergent",
    name: "Spray Pre-Emergent Concentrate",
    product_type: "pre_emergent",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Step 2 of split pre-emergent program. Liquid concentrate that also has POST-emergent killing effect on young crabgrass that broke through Step 1.",
    application_season: ["late_winter", "early_spring"],
    product_url: null,
    notes: "Search 'Andersons pre-emergent concentrate'.",
    is_base_fertilizer: false,
  },

  // ============================================
  // PEST CONTROL
  // ============================================
  {
    id: "duocide",
    name: "Duocide Granules",
    product_type: "pest_control",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Dual-action granular insecticide. Kills grubs, mole crickets, armyworms, ants, fleas, ticks, and more. Spread on lawn and water in. Apply at 4 lb rate.",
    application_season: ["spring", "late_summer"],
    product_url: null,
    notes:
      "Search 'Andersons Duocide'. Two treatments per year: late spring and late summer/early fall.",
    is_base_fertilizer: false,
  },

  // ============================================
  // FUNGICIDE
  // ============================================
  {
    id: "prophesy-fungicide",
    name: "Prophesy Granular Fungicide",
    product_type: "fungicide",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Preventative fungicide application in spring as weather warms. DG Pro granule carrier for uniform spreading.",
    application_season: ["spring", "summer"],
    product_url: null,
    notes: "Search 'Andersons Prophesy fungicide'.",
    is_base_fertilizer: false,
  },

  // ============================================
  // EQUIPMENT
  // ============================================
  {
    id: "mclane-reel-mower",
    name: "McLane Low Cut Series Reel Mower",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Gas reel mower for very short lawns (below 1 inch). Required for KBG and perennial ryegrass sod-grade cuts.",
    application_season: [],
    product_url: "https://mclanelawnmowers.com/",
    notes: null,
    is_base_fertilizer: false,
  },
];

export function getKBProductById(id: string): KBProduct | undefined {
  return KB_PRODUCTS.find((p) => p.id === id);
}

export function getKBProductsByType(
  type: KBProduct["product_type"]
): KBProduct[] {
  return KB_PRODUCTS.filter((p) => p.product_type === type);
}

export function getBaseFertilizers(): KBProduct[] {
  return KB_PRODUCTS.filter((p) => p.is_base_fertilizer);
}

export function getKBProductsBySeason(season: string): KBProduct[] {
  return KB_PRODUCTS.filter((p) =>
    p.application_season.includes(season as KBProduct["application_season"][number])
  );
}
