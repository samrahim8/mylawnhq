import { KnowledgeArticle } from "@/types";

const BERMUDA_GRASS_IDS = ["bermuda-common", "bermuda-hybrid"];
const SOURCE = "https://www.bermudalawnguide.com/";

export const BERMUDA_ARTICLES: KnowledgeArticle[] = [
  // Section 1 — Overview & Philosophy
  {
    id: "bka-overview",
    topic_slug: "bermuda-overview",
    title: "Bermuda Lawn Care Overview & Philosophy",
    content:
      "ANYONE can have a great Bermuda lawn — even if 70%+ weeds. Bermuda is the MOST aggressive spreading grass in the US and is very forgiving. Problem/solution methodology using professional-grade products from the golf course and pro-turf industry. Recommendation: Drop the lawn service — for the same price you get twice the treatments DIY. #1 expense is WATER (can exceed $200/month during drought in the South).",
    related_products: ["b-pgf-complete"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: [],
    source_url: SOURCE,
    expert_notes: [
      { author: "Doc", note: "Skip one night out a month to cover most product costs." },
    ],
    external_references: [
      { title: "Bermuda Lawn Guide", url: "https://www.bermudalawnguide.com/" },
      { title: "HowtowithDoc", url: "https://www.howtowithdoc.com/" },
    ],
  },

  // Section 2 — Bermuda Grass Fundamentals
  {
    id: "bka-fundamentals",
    topic_slug: "bermuda-fundamentals",
    title: "Bermuda Grass Fundamentals",
    content:
      "Most aggressive spreading grass in the US. Loves heat (85-90°F ideal). Requires 8+ hours full sun daily. Roots can reach 60 inches deep (most lawns 8-16 inches). Grows via rhizomes (underground) and stolons (above ground). Both have nodes — reproductive points that grow new plants. Ideal pH 6.0-6.5. Hybrid Bermuda has fine dense blades (sold as sod/plugs), common Bermuda has thick coarse blades (sold as seed). DO NOT overseed hybrid sod with cheap common Bermuda seed.",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: [],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 3 — Seasonal Stages
  {
    id: "bka-seasonal-stages",
    topic_slug: "bermuda-seasonal-stages",
    title: "Bermuda Seasonal Stages",
    content:
      "Winter: Dormant, brown, still alive — DO NOT use total-kill products like RoundUp. Early Spring (50-70°F): Waking up, slow growth, green shoots appear. Late Spring (70-80°F): Growth accelerates, runners appear, spreading and thickening. Early Summer (85-90°F): Growth SURGES. Mid Summer (90°F+): Continuous growth if water is available. Fall: Growth slows, stays green until frost.",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: [
      "winter",
      "early_spring",
      "spring",
      "summer",
      "late_summer",
      "fall",
    ],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 4 — Sunlight Requirements
  {
    id: "bka-sunlight",
    topic_slug: "bermuda-sunlight",
    title: "Bermuda Sunlight Requirements",
    content:
      "RULE #1: Bermuda needs 8 hours of FULL sun per day. No truly shade-tolerant Bermuda variety exists. Shaded areas are ALWAYS weaker — fertilizer will NOT fix this. Solutions: lift the canopy by trimming trees up very high to reduce shadow, cut the tree down (last resort), or allow shaded areas to grow slightly taller (marginal help).",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: [],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 5 — Seed, Sod & Establishment
  {
    id: "bka-seeding",
    topic_slug: "bermuda-seeding",
    title: "Bermuda Seed, Sod & Establishment",
    content:
      "SEEDING: Best when daytime temps in the 80s (late spring/early summer). Treat for weeds 2-3 weeks before, no pre-emergent for 3 months prior. Seed depth 1/8\" to 1/4\". Water 2-3x daily until germination, then once daily for 2 more weeks. No weed killers for first 2 months. Fertilize with PGF Complete — NOT starter fertilizer. SOD: Best in early to late spring. DO NOT apply pre-emergent before laying. Apply HUMICHAR. Week 1 water 3x/day, Week 2 2x/day, Week 3 1x/day. NO pre-emergent for 8-12 months on new sod.",
    related_products: [
      "b-pgf-complete",
      "b-humichar",
      "b-seed-arden-15",
      "b-seed-laprima-xd",
      "b-seed-black-jack",
      "b-seed-yukon",
    ],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 6 — How Bermuda Grows
  {
    id: "bka-growth",
    topic_slug: "bermuda-growth",
    title: "How Bermuda Grows",
    content:
      "Roots can reach 60 inches deep (most lawns 8-16 inches). Rhizomes are underground horizontal stems that rise up. Stolons are above-ground runners that can be stolen. Both have NODES — reproductive points that grow new roots and plants. Transplanting: let runners grow on sidewalk/driveway, steal the runners, plant in bare spots. Seed heads are normal in late spring through summer, mostly sterile, just keep cutting.",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 7 — Mowing & Cutting
  {
    id: "bka-mowing",
    topic_slug: "bermuda-mowing",
    title: "Bermuda Mowing & Cutting Guide",
    content:
      "Ideal height: 3/4\" to 1.5\" during growing season. The longer it gets, the more brown scalping when cut. Tall Bermuda stalks: 30% green, 70% brown. Peak season: cut every 2-3 days for short lawns. Golf fairways: every 1-2 days. Best mower: McLane 25\" Reel Mower with front roller. If using rotary/riding mower: MUST have scalp wheels, change cutting patterns often (horizontal, vertical, diagonals). Avoid cutting on wet soft soil.",
    related_products: ["b-mclane-reel"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer", "fall"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 8 — Clippings, Dethatching & Rolling
  {
    id: "bka-dethatching",
    topic_slug: "bermuda-dethatching",
    title: "Bermuda Clippings, Dethatching & Rolling",
    content:
      "Always return clippings when cutting frequently. Thatch layer holds moisture — only dethatch if exceeds 1/2\". Exception: bag/rake after hard cuts. Excess clipping PILES will kill Bermuda and cause fungus. DO NOT use prong-type dethatchers on Bermuda — runner-growing grasses are damaged by prong dethatching. Use a BLADED dethatcher (Sun Joe AJ801E) or DirtBooster + microbe booster spray. Rolling is generally NOT recommended.",
    related_products: ["b-sun-joe-dethatcher", "b-dirt-booster"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 9 — Lawn Leveling
  {
    id: "bka-leveling",
    topic_slug: "bermuda-leveling",
    title: "Bermuda Lawn Leveling",
    content:
      "Use leveling mix: 70% sand + 30% organic matter. Clean sand is acceptable. ONLY during growing season (dormant season = washed away). Scalp grass to ground first — leveling the GROUND not the grass. Multiple treatments needed for truly level lawn. For large yards with massive ruts: invest in a reel mower + off-season rolling. 1/4\" to 1/2\" of leveling sand won't fix 2-3\" ruts.",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 10 — Fertilizer & NPK
  {
    id: "bka-fertilizer",
    topic_slug: "bermuda-fertilizer",
    title: "Bermuda Fertilizer & NPK Guide",
    content:
      "NPK = Nitrogen, Phosphorus, Potassium (percentages by weight). Recommended ratio without soil test: 4-1-2 (e.g., 16-4-8 = PGF Complete). PGF Complete has 3% Iron + micro nutrients + Humic Acid, 3 forms of nitrogen, tiny particle size. 0.58 lbs N per 1,000 sq ft — can stack every 3-6 weeks. Avoid specialty fertilizers, combo weed & feed, and excess nutrients. Fertilizers feed the SOIL — plant uptakes what it needs. Get a soil test.",
    related_products: ["b-pgf-complete", "b-pgf-balance", "b-pgf-zero-phos"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer"],
    source_url: SOURCE,
    expert_notes: [
      { author: "Doc", note: "Excess nutrients do NOT produce greater results." },
    ],
    external_references: [],
  },

  // Section 11 — Organic Fertilizers
  {
    id: "bka-organic-fertilizer",
    topic_slug: "bermuda-organic-fertilizer",
    title: "Bermuda Organic Fertilizers",
    content:
      "Types: waste-based (poo) or grain-based (soybean). Preferred: soy-based like INNOVA. Pros: great for thick healthy lawns in summer, adds carbon and amino acids, cannot burn lawn. Cons: very mild, must be digested by microbes first, won't push weak lawns to thicken, can't target exact nutrient deficiencies. Recommendation: weak/thin lawn → use PGF Complete. Healthy/thick lawn in summer → INNOVA organic is fine. Treat organics as supplemental.",
    related_products: ["b-innova", "b-pgf-complete"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 12 — Spray Supplements
  {
    id: "bka-spray-supplements",
    topic_slug: "bermuda-spray-supplements",
    title: "Bermuda Spray Supplements (Super Juice & GreenShocker)",
    content:
      "Super Juice: reaches every blade, provides nutrients between granular feedings, very mild, safe during stress, broad spectrum, contains iron for deep green, mixable with fungicides. Apply every 2-3 weeks. In fall STOP granulars and use ONLY Super Juice until first frost. GreenShocker: 100% fast-release, results in 3 days, mild enough for summer. Key rule: granulars = bulk nutrients + noticeable growth. Spray supplements = mild + better overall health.",
    related_products: ["b-super-juice", "b-greenshocker"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer", "fall"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [
      { title: "Super Juice Fertilizer", url: "https://www.superjuicefertilizer.com/" },
      { title: "GreenShocker", url: "https://www.greenshocker.com/" },
    ],
  },

  // Section 13 — Soil Treatments (HUMICHAR)
  {
    id: "bka-humichar",
    topic_slug: "bermuda-humichar",
    title: "Bermuda Soil Treatments (HUMICHAR)",
    content:
      "HUMICHAR is 50/50 Humic Acid + Biochar in DG particles. Contains NO nutrients — safe anytime with any product. Cannot over-apply. Humic acid improves CEC (nutrient hold/release), adds carbon, improves seed germination, increases microbial activity. Biochar improves water holding capacity, stimulates microbes, decreases fertilizer leaching. Humic acid works fast, biochar works slow and lasts longer. Lawns never get natural organic matter — HUMICHAR replaces missing carbon.",
    related_products: ["b-humichar"],
    related_grass_types: BERMUDA_GRASS_IDS,
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
    source_url: "https://www.humichar.com/",
    expert_notes: [],
    external_references: [
      { title: "HUMICHAR Product", url: "https://www.humichar.com/" },
    ],
  },

  // Section 14 — Lawn pH
  {
    id: "bka-ph",
    topic_slug: "bermuda-ph",
    title: "Bermuda Lawn pH Guide",
    content:
      "Ideal range: 6.0-6.5. pH doesn't directly affect grass — it affects nutrient availability. High pH means grass can't access iron in soil. Low pH: add lime. High pH: pelletized sulfur at 5 lbs per 1,000 sq ft, only when air temps below 75°F, recheck in 3 months, may take several years for large changes. Preferred timing: dormant season.",
    related_products: ["b-soil-test-kit"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["winter", "late_winter"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 15 — Fungus, Dead Spots & Discoloration
  {
    id: "bka-fungus",
    topic_slug: "bermuda-fungus",
    title: "Bermuda Fungus, Dead Spots & Discoloration",
    content:
      "Prevention: apply PRO DG Fungicide when temps reach 80s in spring. Most common fungi: Dollar Spot (small circular patches) and Brown Patch (larger irregular patches). Treatment: apply P-DG fungicide at bag rate up to 3 times, then SWITCH to BioAdvanced spray (rotating chemicals prevents resistance). Yellow blades (chlorosis): caused by over-watering, high phosphorus, or pH imbalance. Quick fix: Super Juice + extra liquid iron. Red/purple blades: usually stress/cold damage or lack of phosphorus.",
    related_products: [
      "b-pro-dg-fungicide",
      "b-bioadvanced-fungicide",
      "b-super-juice",
    ],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 16 — Grubs & Grub Damage
  {
    id: "bka-grubs",
    topic_slug: "bermuda-grubs",
    title: "Bermuda Grubs & Grub Damage",
    content:
      "Grubs feed underground on ROOTS at 2-6 inches deep. Signs: brown dying patches that pull up easily, crows on lawn, armadillos/skunks digging. Treatment timing: spring AND late summer/early fall. ONLY recommended product: Dou-Kill at HEAVY rate, water heavily into ground. After killing grubs: apply PGF Complete, lawn heals in ~6 weeks. At least 1 grub treatment per year recommended.",
    related_products: ["b-dou-kill", "b-pgf-complete"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 17 — Fall Army Worms
  {
    id: "bka-army-worms",
    topic_slug: "bermuda-army-worms",
    title: "Bermuda Fall Army Worms",
    content:
      "Army worms live and eat ABOVE soil (unlike grubs). Hide in thatch layer. Feed morning and early evening on grass BLADES — visual damage, not root damage. Eggs laid by moths, spreads from neighbors. Typical battle: August-September. May require 2 treatments due to egg hatch cycle. Use same Dou-Kill product as grubs. Detect early for best results.",
    related_products: ["b-dou-kill"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 18 — Aeration
  {
    id: "bka-aeration",
    topic_slug: "bermuda-aeration",
    title: "Bermuda Aeration Guide",
    content:
      "Use CORE PULLING aerator only — NOT spike units. Remove cores from lawn. Timing: spring to early summer (active growing season). Post-aeration: great time for heavy HUMICHAR application — blow particles into holes. Will NOT ruin pre-emergent treatments (studies confirm minimal impact).",
    related_products: ["b-humichar"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [
      {
        title: "Aeration + PE study (Walter Reeves)",
        url: "https://www.walterreeves.com/landscaping/aerate-instructions/",
      },
    ],
  },

  // Section 19 — Kick Start Program
  {
    id: "bka-kick-start",
    topic_slug: "bermuda-kick-start",
    title: "Bermuda Kick Start Program (Late Winter/Early Spring)",
    content:
      "Prepare the soil BEFORE Bermuda wakes up. Step 1: Soil test (winter) — identifies deficiencies + pH. Step 2 (soil temps ~50°F): Apply simultaneously: early granular pre-emergent, HUMICHAR at bag rate, PGF 10-10-10 Balanced. Late Feb/early March in GA. Step 3: Kill existing weeds while grass is still asleep. Use Bermuda-safe weed killer spray. DO NOT use RoundUp — myth that it's safe during dormancy.",
    related_products: [
      "b-granular-pe",
      "b-humichar",
      "b-pgf-balance",
      "b-soil-test-kit",
    ],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["late_winter", "early_spring"],
    source_url: SOURCE,
    expert_notes: [
      {
        author: "Doc",
        note: "Like a programmable thermostat warming the house before you get up.",
      },
    ],
    external_references: [],
  },

  // Section 20 — Pre-Emergent (Spring)
  {
    id: "bka-pre-emergent-spring",
    topic_slug: "bermuda-pre-emergent-spring",
    title: "Bermuda Spring Pre-Emergent Program",
    content:
      "Pre-emergent is 'God's gift to Bermuda lawn owners.' With proper PE program you need ZERO weed killers. Split application: First app BEFORE soil temps hit 51-53°F — long-lasting granular PE. Second app JUST AFTER — liquid with post-emergent properties on crabgrass. Why split? Safety net covers before + after weed germination. Second spray catches surface seeds disturbed by spring scalping. Apply while soil is dry, water in immediately. Be early rather than late. Don't use on new sod.",
    related_products: ["b-granular-pe", "b-liquid-pe"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["late_winter", "early_spring"],
    source_url: SOURCE,
    expert_notes: [
      { author: "Doc", note: "Pre-Emergent is God's gift to Bermuda lawn owners." },
    ],
    external_references: [],
  },

  // Section 21 — Pre-Emergent (Fall)
  {
    id: "bka-pre-emergent-fall",
    topic_slug: "bermuda-pre-emergent-fall",
    title: "Bermuda Fall Pre-Emergent",
    content:
      "Hold off as long as possible — NOT September. Apply when first cold weather hits (~November 15 in GA). Prevents winter weeds (Poa annua). Will NOT prevent spring weeds. Not critical unless heavy winter weeds previous year.",
    related_products: ["b-fall-pe"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["late_fall"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 22 — Spring Scalping
  {
    id: "bka-scalping",
    topic_slug: "bermuda-scalping",
    title: "Bermuda Spring Scalping",
    content:
      "Dead brown grass (2.5\"+ from fall) blocks green growth below — must remove dead layer. Scalp to 50% of desired growing height (want 1.5\" → scalp to 3/4\"). When to scalp: when full green haze appears across entire lawn, daily temps consistently reaching 70s. Late March-early April in GA. Very hard on equipment. Can scalp gradually over 4-6 weeks instead of one day.",
    related_products: ["b-mclane-reel"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["early_spring"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 23 — Watering
  {
    id: "bka-watering",
    topic_slug: "bermuda-watering",
    title: "Bermuda Watering Guide",
    content:
      "General rules: 1 inch of water per week, deep and heavy beats frequent light waterings. Drought protocol (3+ weeks no rain + 90°F): switch to short cycle program — light waterings morning + late afternoon, 6-9 minutes per zone. Hotspots (construction debris, tree roots, septic drains, sand zones) need frequent light waterings. Constantly wet soil/overwatering causes chlorosis (yellowing).",
    related_products: [],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["spring", "summer", "late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },

  // Section 24 — Weed Killing
  {
    id: "bka-weed-killing",
    topic_slug: "bermuda-weed-killing",
    title: "Bermuda Weed Killing Guide",
    content:
      "Weed categories by difficulty: broadleaf (easy), grassy (easy), crabgrass (medium), nutsedge (medium), dallisgrass/goosegrass (very hard). Best defense: strong pre-emergent program. Dallisgrass/goosegrass: spot treat with cloth + RoundUp on plant only. Nutsedge: PEs don't control it — treat separately with Image Herbicide. Winter: wait for warm spell. Summer/drought: use caution. 'Curtain of Death' for 70%+ weed lawns: apply ALL weed killers + pre-emergent during warm months, Bermuda browns but doesn't die, fertilize + water, only Bermuda returns.",
    related_products: [
      "b-q4-plus",
      "b-southern-ag-24d",
      "b-bioadvanced-aio",
      "b-bioadvanced-kp",
      "b-drive-quinclorac",
      "b-image-herbicide",
    ],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["early_spring", "spring", "fall"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [
      {
        title: "WeedAlert.com — Search by Region",
        url: "https://www.weedalert.com/search-by-region-results.php?region=4",
      },
    ],
  },

  // Section 25 — Adding Organic Matter
  {
    id: "bka-organic-matter",
    topic_slug: "bermuda-organic-matter",
    title: "Adding Organic Matter to Bermuda Lawns",
    content:
      "Nothing dies and decomposes on lawns — no natural carbon/organic matter buildup. Rich soil comes from: HUMICHAR + returned clippings + clean organic matter. DirtBooster: applied via spreader, spray with included microbe + fungus booster pack, apply when temps above 80°F, use as often as desired.",
    related_products: ["b-humichar", "b-dirt-booster"],
    related_grass_types: BERMUDA_GRASS_IDS,
    related_seasons: ["summer", "late_summer"],
    source_url: SOURCE,
    expert_notes: [],
    external_references: [],
  },
];

export function getBermudaArticleBySlug(
  slug: string
): KnowledgeArticle | undefined {
  return BERMUDA_ARTICLES.find((a) => a.topic_slug === slug);
}

export function getBermudaArticlesByProduct(
  productId: string
): KnowledgeArticle[] {
  return BERMUDA_ARTICLES.filter((a) =>
    a.related_products.includes(productId)
  );
}

export function getBermudaArticlesBySeason(
  season: string
): KnowledgeArticle[] {
  return BERMUDA_ARTICLES.filter((a) =>
    a.related_seasons.includes(
      season as KnowledgeArticle["related_seasons"][number]
    )
  );
}
