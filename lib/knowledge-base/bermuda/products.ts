import { KBProduct } from "@/types";

export const BERMUDA_PRODUCTS: KBProduct[] = [
  // ============================================
  // FERTILIZERS
  // ============================================
  {
    id: "b-pgf-complete",
    name: "PGF Complete 16-4-8",
    product_type: "fertilizer",
    npk_ratio: "16-4-8",
    release_type: "slow_release",
    use_case:
      "Main growing season fertilizer. 4-1-2 ratio, 3% Iron + micro nutrients + Humic Acid. 3 forms of high-quality nitrogen. Tiny particle size for pro-grade coverage. 0.58 lbs N per 1,000 sq ft. Can stack every 3-6 weeks during push times.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: "https://www.pgfcomplete.com",
    notes:
      "Lab-designed as the 'perfect lawn fertilizer'. No bio products, waste, sewage, or manures.",
    is_base_fertilizer: true,
  },
  {
    id: "b-pgf-balance",
    name: "PGF Balance 10-10-10",
    product_type: "fertilizer",
    npk_ratio: "10-10-10",
    release_type: "fast_release",
    use_case:
      "Kick Start program in late winter. Fills soil with balanced nutrients without strong N push. Apply simultaneously with pre-emergent and HUMICHAR.",
    application_season: ["late_winter"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-pgf-zero-phos",
    name: "PGF Zero Phosphorus 16-0-8",
    product_type: "fertilizer",
    npk_ratio: "16-0-8",
    release_type: "slow_release",
    use_case:
      "For lawns with high phosphorus levels or in phosphorus-restricted areas.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: null,
    notes: null,
    is_base_fertilizer: true,
  },
  {
    id: "b-greenshocker",
    name: "GreenShocker",
    product_type: "supplement",
    npk_ratio: null,
    release_type: "fast_release",
    use_case:
      "100% fast-release fertilizer supplement. Results visible in 3 days. Mild enough for summer use. Works on warm and cool season grasses.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: "https://www.greenshocker.com/",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-super-juice",
    name: "Super Juice",
    product_type: "supplement",
    npk_ratio: null,
    release_type: "supplement",
    use_case:
      "Spray supplement applied every 2-3 weeks during growing season. Reaches every blade, provides nutrients between granular feedings. Contains iron for deep green. Mixable with fungicides and pest controls. In fall: STOP granulars and use ONLY Super Juice until first frost.",
    application_season: ["spring", "summer", "late_summer", "fall"],
    product_url: "https://www.superjuicefertilizer.com/",
    notes: "Doc's formulation. Adds humic and fulvic acid (increases soil CEC).",
    is_base_fertilizer: false,
  },
  {
    id: "b-dgl",
    name: "DGL Dark Green Lawn 25-0-0",
    product_type: "supplement",
    npk_ratio: "25-0-0",
    release_type: "fast_release",
    use_case: "All fast release + 6% Iron for quick green-up.",
    application_season: ["spring", "summer", "late_summer"],
    product_url: "https://darkgreenlawn.com/",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-innova",
    name: "INNOVA Organic Fertilizer",
    product_type: "fertilizer",
    npk_ratio: null,
    release_type: "slow_release",
    use_case:
      "Soy-based organic fertilizer. Great for thick, healthy lawns during summer. Adds carbon and amino acids. Cannot burn the lawn. Treat as supplemental feeding — won't push weak lawns to thicken.",
    application_season: ["summer", "late_summer"],
    product_url: "https://www.howtowithdoc.com/best-organic-lawn-fertilizer/",
    notes:
      "Weak/thin lawn: use PGF Complete instead. Healthy/thick lawn in summer: INNOVA is fine.",
    is_base_fertilizer: false,
  },

  // ============================================
  // SOIL AMENDMENTS
  // ============================================
  {
    id: "b-humichar",
    name: "HUMICHAR DG",
    product_type: "soil_amendment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "50/50 blend of Humic Acid + Biochar in DG particles. Improves soil CEC, adds carbon, increases microbial activity, improves water holding capacity. Contains NO nutrients — safe anytime with any product. Cannot over-apply.",
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
    notes:
      "Great after aeration — blow particles into holes. Humic acid works fast, biochar works slow and lasts longer.",
    is_base_fertilizer: false,
  },
  {
    id: "b-dirt-booster",
    name: "DirtBooster",
    product_type: "soil_amendment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Natural compost starter + soil amendment. Apply via spreader, then spray with included microbe + fungus booster pack. Apply when temps above 80°F.",
    application_season: ["summer", "late_summer"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-soil-test-kit",
    name: "Online Soil Test Kit",
    product_type: "soil_amendment",
    npk_ratio: null,
    release_type: null,
    use_case: "Lab soil analysis to identify deficiencies and pH level.",
    application_season: ["winter", "late_winter"],
    product_url: null,
    notes: "90% of people skip this — but it is Step 1 of the Kick Start program.",
    is_base_fertilizer: false,
  },

  // ============================================
  // PRE-EMERGENTS
  // ============================================
  {
    id: "b-granular-pe",
    name: "Granular Pre-Emergent (Doc's Pick)",
    product_type: "pre_emergent",
    npk_ratio: null,
    release_type: null,
    use_case:
      "First application of split PE program. Apply BEFORE soil temps hit 51-53°F. Long-lasting granular. Apply while soil is dry, water in immediately.",
    application_season: ["late_winter", "early_spring"],
    product_url: null,
    notes: "Be a little early rather than late.",
    is_base_fertilizer: false,
  },
  {
    id: "b-liquid-pe",
    name: "Liquid Pre-Emergent Concentrate",
    product_type: "pre_emergent",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Second application of split PE program. Apply JUST AFTER target date. Has POST-emergent properties on crabgrass. Catches surface seeds disturbed by spring scalping.",
    application_season: ["early_spring"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-fall-pe",
    name: "Fall Pre-Emergent",
    product_type: "pre_emergent",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Prevents winter weeds (Poa annua). Apply when first cold weather hits (~November). Will NOT prevent spring weeds.",
    application_season: ["late_fall"],
    product_url: null,
    notes: "Not critical unless heavy winter weeds previous year.",
    is_base_fertilizer: false,
  },

  // ============================================
  // PEST CONTROL
  // ============================================
  {
    id: "b-dou-kill",
    name: "Dou-Kill (Doucide)",
    product_type: "pest_control",
    npk_ratio: null,
    release_type: null,
    use_case:
      "ONLY recommended product for grubs and army worms. Apply at HEAVY rate, water heavily into ground. DO NOT use other products even if bag claims grub control.",
    application_season: ["spring", "late_summer"],
    product_url: "https://www.howtowithdoc.com/best-grub-and-armyworm-killer/",
    notes: "At least 1 grub treatment per year recommended. Army worms may require 2 treatments (egg hatch cycle).",
    is_base_fertilizer: false,
  },

  // ============================================
  // FUNGICIDE
  // ============================================
  {
    id: "b-pro-dg-fungicide",
    name: "PRO DG Fungicide",
    product_type: "fungicide",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Preventative fungicide. Apply when temps reach 80s in spring. DG particles provide superior coverage + longer lasting than most sprays. Apply up to 3 times at bag rate.",
    application_season: ["spring", "summer"],
    product_url: null,
    notes: "After 3 applications, SWITCH to BioAdvanced spray (fungus develops resistance). Rotating chemicals prevents resistance.",
    is_base_fertilizer: false,
  },
  {
    id: "b-bioadvanced-fungicide",
    name: "BioAdvanced Spray Fungicide",
    product_type: "fungicide",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Rotation fungicide product. Use after 3 applications of PRO DG to prevent fungus resistance.",
    application_season: ["summer", "late_summer"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },

  // ============================================
  // WEED KILLERS
  // ============================================
  {
    id: "b-q4-plus",
    name: "Q4 Plus",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Concentrate spray for multiple weeds (broadleaf + grassy).",
    application_season: ["early_spring", "spring", "fall"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-southern-ag-24d",
    name: "Southern Ag 2,4-D",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Affordable broadleaf weed killer concentrate. 1 qt treats ~1.25 acres.",
    application_season: ["early_spring", "spring", "fall"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-bioadvanced-aio",
    name: "BioAdvanced All-In-One Weed Killer",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Broadleaf + Crabgrass killer (200+ weeds). NOT for St. Augustine, Carpet grass, Centipede, or Dichondra.",
    application_season: ["early_spring", "spring", "fall"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-bioadvanced-kp",
    name: "BioAdvanced Kill & Prevent",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "2-in-1 post-emergent + pre-emergent with 6 month prevention.",
    application_season: ["early_spring", "spring"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-drive-quinclorac",
    name: "Drive (Quinclorac)",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Professional-grade for heavy crabgrass problems. May yellow hybrid Bermuda temporarily.",
    application_season: ["spring", "summer"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-image-herbicide",
    name: "Image Herbicide",
    product_type: "weed_killer",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Concentrate + Hose end for Poa annua + Nutsedge. Critical for nutsedge control since pre-emergents don't control nutsedge.",
    application_season: ["early_spring", "spring", "fall"],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },

  // ============================================
  // SEED
  // ============================================
  {
    id: "b-seed-arden-15",
    name: "Arden 15 Bermuda Seed",
    product_type: "seed",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Pennington's upgrade to Princess 77. Improved cold tolerance, dark green, medium fine texture. $22-$32/lb.",
    application_season: ["spring", "summer"],
    product_url: "https://www.amazon.com/gp/product/B07PPBJ478",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-seed-laprima-xd",
    name: "LaPrima XD Bermuda Seed",
    product_type: "seed",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Blend of Yukon + Royal Bengal. X-treme Density, fast establishment. $16-$29/lb.",
    application_season: ["spring", "summer"],
    product_url: "https://www.amazon.com/gp/product/B07Q3NYY37",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-seed-black-jack",
    name: "Black Jack Bermuda Seed",
    product_type: "seed",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Fine-textured, dark green, cold tolerant, good for overseeding. $7-$9/lb.",
    application_season: ["spring", "summer"],
    product_url: "https://www.amazon.com/gp/product/B0721J5B6Y",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-seed-yukon",
    name: "Yukon Bermuda Seed",
    product_type: "seed",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Oklahoma State developed, most cold tolerant seeded Bermuda. Best for transition zones. $20-$29/lb.",
    application_season: ["spring", "summer"],
    product_url: "https://www.amazon.com/gp/product/B071X2V5K2",
    notes: null,
    is_base_fertilizer: false,
  },

  // ============================================
  // EQUIPMENT
  // ============================================
  {
    id: "b-mclane-reel",
    name: "McLane 25\" Reel Mower (w/ front roller)",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Top pick for Bermuda. Lighter than Tru-Cut, less maintenance, easier on body. All golf courses use reel mowers.",
    application_season: [],
    product_url: "https://www.howtowithdoc.com/power-reel-mower/",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-sun-joe-dethatcher",
    name: "Sun Joe AJ801E Dethatcher",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Bladed dethatcher safe for Bermuda. DO NOT use prong-type dethatchers on runner-growing grasses.",
    application_season: [],
    product_url:
      "https://www.amazon.com/Sun-Joe-AJ801E-Dethatcher-Collection/dp/B01FEATL2I",
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-scarifier",
    name: "Scarifier/Dethatcher (Doc's Pick)",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case:
      "Soil loosening for seeding. Bladed scarifier to loosen soil before seed spreading.",
    application_season: [],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-spreader",
    name: "Lawn Spreader (2024 Top Pick)",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case: "Large broadcast spreader for granular products.",
    application_season: [],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
  {
    id: "b-hose-end-sprayer",
    name: "Hose End Spray Bottles (20:1)",
    product_type: "equipment",
    npk_ratio: null,
    release_type: null,
    use_case: "For applying Super Juice and other spray products.",
    application_season: [],
    product_url: null,
    notes: null,
    is_base_fertilizer: false,
  },
];

export function getBermudaProductById(id: string): KBProduct | undefined {
  return BERMUDA_PRODUCTS.find((p) => p.id === id);
}

export function getBermudaProductsByType(
  type: KBProduct["product_type"]
): KBProduct[] {
  return BERMUDA_PRODUCTS.filter((p) => p.product_type === type);
}
