import { KnowledgeArticle } from "@/types";

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "ka-soil-testing",
    topic_slug: "soil-testing",
    title: "Soil Testing for Cool Season Lawns",
    content:
      "A healthy soil makes great lawns. Think of lawn soil as a bank for nutrients. Step #1: Get a soil test. Focus on two critical factors: phosphorus level and pH level. The ideal pH for most lawn grasses is ~6.5. When pH gets too high or too low, certain nutrients get locked up or are depleted easily. Use the same quality testing lab year after year. Florida residents: UF/IFAS Extension offices offer free soil test kits — order at https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx or pick up from your local county Extension office.",
    related_products: ["pgf-complete-16-4-8", "pgf-16-0-8", "pgf-balance-10-10-10"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["winter", "late_winter"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [
      {
        author: "Pope",
        note: "Use the same quality testing lab year after year due to varying standards between labs.",
      },
      {
        author: "Doc",
        note: "Don't read too much into the report — focus on wild spikes and pH levels.",
      },
    ],
    external_references: [
      {
        title: "How To with Doc — Soil Testing Walkthrough",
        url: "https://www.youtube.com/c/HowTowithDoc/videos",
      },
      {
        title: "UF/IFAS Free Soil Test Kit (Florida residents)",
        url: "https://ifasbooks.ifas.ufl.edu/p-1761-soil-test-kit-powered-by-soilkit.aspx",
      },
    ],
  },
  {
    id: "ka-spoon-feeding",
    topic_slug: "spoon-feeding",
    title: "Summer Spoon Feeding for Cool Season Grasses",
    content:
      "The common rule is don't fertilize in summer. This exists because average homeowners apply strong slow-release fertilizers causing a surge of growth during stress, leading to damage. The exception is spoon feeding: applying small amounts of nutrients more frequently. This benefits the plant without causing excess growth. Often includes iron for darker green color. Conditions required: not in drought, have irrigation or rain approaching, haven't recently applied strong slow-release.",
    related_products: ["green-shocker", "super-juice"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["summer"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [],
  },
  {
    id: "ka-aeration",
    topic_slug: "aeration",
    title: "Lawn Aeration Guide",
    content:
      "Aeration should be done during a strong growing period for recovery and fill-in. It relieves soil compaction and allows water and oxygen deep into soil. Prep: cut lawn fairly short first — hard to pick up plugs otherwise. Use a core-pulling aerator (not spike). Pick up plugs after aeration. Late summer through early fall is the primary aeration window for cool season grasses.",
    related_products: ["humichar"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["spring", "late_summer"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "How To with Doc — Aeration",
        url: "https://www.youtube.com/c/HowTowithDoc/videos",
      },
    ],
  },
  {
    id: "ka-dethatching",
    topic_slug: "dethatching",
    title: "Dethatching Cool Season Lawns",
    content:
      "Short lawns (0.25-1 inch) seldom need dethatching — small clippings decompose quickly. About 0.5 inch thatch layer is healthy. Longer cool season lawns often get excess buildup. Use a spring tine dethatcher to pull up dead grass, then rake it up. Best timing is late winter/early spring cleanup or during growing season. Increasing good microbes and fungus through organic matter helps reduce thatch buildup naturally.",
    related_products: ["dirt-booster"],
    related_grass_types: [
      "tall-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["late_winter", "early_spring", "spring"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "Pitchcare — Thatch Article",
        url: "https://www.pitchcare.com/news-media/thatch-your-friend-and-food-for-fine-grass.html",
      },
    ],
  },
  {
    id: "ka-fertilizer-program",
    topic_slug: "fertilizer-program",
    title: "Cool Season Fertilizer Program",
    content:
      "Without a soil test, use a 4-1-2 ratio (N-P-K) such as 16-4-8. PGF Complete 16-4-8 is the recommended primary base fertilizer — mild, slow release, ideal ratio, tiny particles for best distribution, contains iron, micronutrients, and Humic DG. You feed the SOIL, not the plant. The plant draws what it needs. Excess nutrients do NOT improve results and can cause harm (e.g., high phosphorus locks up other nutrients). Only vary fertilizer numbers when soil test shows excess/deficiency or for seasonal timing.",
    related_products: [
      "pgf-complete-16-4-8",
      "pgf-16-0-8",
      "pgf-balance-10-10-10",
      "green-shocker",
      "super-juice",
    ],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: [
      "late_winter",
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
      "late_fall",
    ],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "Illinois Extension — Choosing Lawn Fertilizers",
        url: "https://extension.illinois.edu/lawntalk/planting/choosing_fertilizers_for_home_lawns.cfm",
      },
      {
        title: "Missouri Extension — Fertilizer Calculator",
        url: "http://agebb.missouri.edu/fertcalc/",
      },
    ],
  },
  {
    id: "ka-pre-emergent",
    topic_slug: "pre-emergent",
    title: "Pre-Emergent Program for Cool Season Lawns",
    content:
      "Use a split program: Step 1 is granular DG pre-emergent (dispersible granule breaks into 1000s of sub-particles). Step 2 is spray pre-emergent which also has POST-emergent killing effect on young crabgrass that broke through Step 1. Spring timing: apply when soil temp reaches 51-53\u00B0F, ideally 2 weeks early. Winter timing: apply in late fall when growth totally stops. IMPORTANT: Do NOT apply pre-emergent if you plan to seed.",
    related_products: ["dg-pre-emergent", "spray-pre-emergent"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["late_winter", "early_spring", "late_fall"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "GreenCast Soil Temperature Map",
        url: "https://www.greencastonline.com/tools/soil-temperature",
      },
    ],
  },
  {
    id: "ka-weed-control",
    topic_slug: "weed-control",
    title: "Weed Control for Cool Season Lawns",
    content:
      "Don't use granular weed-killing products or 'weed and feed' combos — they don't work well. Prefer liquid weed killers. Always read the label. Most weed killers should NOT be applied above 85\u00B0F or during heat stress. Process: identify weeds first using Weed Alert / Weed ID, then use ready-to-spray hose-end bottles from most stores.",
    related_products: [],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["early_spring", "spring", "fall"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "Weed Alert — Weed ID",
        url: "https://www.weedalert.com/",
      },
    ],
  },
  {
    id: "ka-pest-management",
    topic_slug: "pest-management",
    title: "Pest & Disease Management",
    content:
      "Two most common pests: White grubs (eat roots, cause medium to large brown patches, come from beetles) and Armyworms (eat grass blades, cause surface damage, come from moth eggs). Treatment schedule: late spring and late summer/early fall. Primary product is Duocide Granules. For fungal disease, apply granular fungicide (Prophesy) preventatively in spring as weather warms. Fungus usually appears during slower growth / summer stress months.",
    related_products: ["duocide", "prophesy-fungicide"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["spring", "summer", "late_summer"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [
      {
        author: "Pope",
        note: "Duocide at 4 lb rate. Also effective for ants, fleas, ticks. Treatment timing: last week of May and 2nd week Aug to 1st week Sept.",
      },
    ],
    external_references: [
      {
        title: "Purdue University — Lawn Disease Guide (PDF)",
        url: "https://www.extension.purdue.edu/extmedia/BP/BP-124-W.pdf",
      },
      {
        title: "GreenCast Disease Guide (with pictures)",
        url: "https://www.greencastonline.com/diseaseguide",
      },
    ],
  },
  {
    id: "ka-seeding",
    topic_slug: "seeding",
    title: "Seeding Cool Season Grasses",
    content:
      "Rule of thumb: seed cool season grasses in the FALL — roots develop before summer heat. Spring overseeding is possible with good results, especially with irrigation. Planting depth: shallow, 1/8 to 1/2 inch in soil. Scarify the lawn after spreading seed. Cool season seeds germinate quickly and lawns establish fast. General recommendation for grass mixing: pick ONE grass type first, use mixing/blending as a FIX for problems. Best practice: select one type in a mix of 3 improved varieties recommended for your zone.",
    related_products: [],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["late_summer", "fall", "spring"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [
      {
        author: "Pope",
        note: "If your cool season lawn isn't performing well, consider introducing diversity where the primary species isn't performing.",
      },
    ],
    external_references: [
      {
        title: "MSU — Grass Mixing Article (PDF)",
        url: "https://archive.lib.msu.edu/tic/holen/article/2000jul23.pdf",
      },
    ],
  },
  {
    id: "ka-winterizing",
    topic_slug: "winterizing",
    title: "Winterizing Cool Season Lawns",
    content:
      "If you've followed the program (16-4-8 or 16-0-8 through the year), you probably don't need to winterize. Nutrients are still in the soil. Potassium enhances cold tolerance but only supplement if soil test shows LOW potassium. Rate: 1 lb potash per 1,000 sqft. Sandy soils with excessive rainfall may need extra.",
    related_products: ["pgf-balance-10-10-10"],
    related_grass_types: [
      "tall-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: ["late_fall"],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [],
  },
  {
    id: "ka-soil-carbon",
    topic_slug: "soil-carbon",
    title: "Carbon & Biochar for Soil Health",
    content:
      "Carbon is the lifeblood of soil. Every lawn benefits from adding pure carbon. HumiChar is a pelletized form of 50% biochar + 50% humic acid. Benefits: improves poor soils, holds nutrients, creates good environment for soil microbes, lasts for decades, reduces long-term need for fertilizer. It is NOT a nutrient — it is a soil structure improvement. Apply any time of year.",
    related_products: ["humichar", "dirt-booster"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: [
      "winter",
      "late_winter",
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
      "late_fall",
    ],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [
      {
        title: "HumiChar Product",
        url: "https://www.humichar.com/",
      },
    ],
  },
  {
    id: "ka-mowing",
    topic_slug: "mowing",
    title: "Mowing Cool Season Lawns",
    content:
      "Rotary mowers are best for the majority of cool season lawns (lifts and cuts longer blades). Reel mowers are for lawns cut below 1 inch and do NOT perform well on longer grass. Keep blades sharp — buy extra blades and rotate. Dull blades rip and tear grass. Cut MORE often and take LESS off each time. Never let lawn overgrow then cut way down. During growing season: mow every week minimum. During peak growth: may need every 2-3 days. Raise cutting height 0.5-1 inch in shade areas.",
    related_products: ["mclane-reel-mower"],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: [
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
    ],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [],
  },
  {
    id: "ka-watering",
    topic_slug: "watering",
    title: "Watering Cool Season Lawns",
    content:
      "Established lawns should NOT be kept wet all the time (causes fungus and chlorosis). Normal cycle: deep watering then dry out. 1 inch of water per week, water deeper and less often. New lawns/newly seeded/newly sodded: short waterings 2-3 times per day for first few weeks, then every other day once established, then 3-4 times per week during heat. Hot spots over tree roots or construction debris dry out 5x faster and may need hand watering.",
    related_products: [],
    related_grass_types: [
      "tall-fescue",
      "fine-fescue",
      "perennial-ryegrass",
      "kentucky-bluegrass",
    ],
    related_seasons: [
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
    ],
    source_url: "https://www.freelawncareguide.com/",
    expert_notes: [],
    external_references: [],
  },
];

export function getArticleBySlug(
  slug: string
): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find((a) => a.topic_slug === slug);
}

export function getArticlesByGrassType(
  grassTypeId: string
): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter((a) =>
    a.related_grass_types.includes(grassTypeId)
  );
}

export function getArticlesBySeason(season: string): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter((a) =>
    a.related_seasons.includes(season as KnowledgeArticle["related_seasons"][number])
  );
}

export function getArticlesByProduct(
  productId: string
): KnowledgeArticle[] {
  return KNOWLEDGE_ARTICLES.filter((a) =>
    a.related_products.includes(productId)
  );
}
