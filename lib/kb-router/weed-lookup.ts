// ---------------------------------------------------------------------------
// Weed lookup table — maps Pl@ntNet scientific names to common names,
// weed type (for herbicide class), and KB treatment protocols.
//
// kbTreatment gives Haiku the answer directly so it doesn't need to
// search the KB section. Section 6 is injected as backup context only.
//
// Treatments listed are the most universally safe options.
// Grass-type-specific warnings are noted where critical.
// ---------------------------------------------------------------------------

export type WeedType = "grassy" | "broadleaf" | "sedge";

export interface WeedEntry {
  commonName: string;
  type: WeedType;
  kbTreatment: string;
}

/**
 * Maps Pl@ntNet scientific names (lowercase) to lawn weed entries.
 * Only includes species commonly found in lawns — if a Pl@ntNet result
 * isn't in this table, the species is probably not a lawn weed.
 */
export const WEED_LOOKUP: Record<string, WeedEntry> = {
  // --- Grassy weeds ---
  "digitaria sanguinalis": {
    commonName: "crabgrass (large)",
    type: "grassy",
    kbTreatment:
      "Pre-emergent: Barricade (prodiamine) at soil temp 51-55°F, or Dimension (dithiopyr) which also kills young crabgrass post-emergently. Post-emergent: Drive XLR8 (quinclorac) for emerged plants. Bermuda/Zoysia: Certainty also effective. Cool-season: liquid spray PE has post-emergent action on young crabgrass.",
  },
  "digitaria ischaemum": {
    commonName: "crabgrass (smooth)",
    type: "grassy",
    kbTreatment:
      "Pre-emergent: Barricade (prodiamine) at soil temp 51-55°F, or Dimension (dithiopyr) which also kills young crabgrass post-emergently. Post-emergent: Drive XLR8 (quinclorac) for emerged plants. Same treatment as large crabgrass.",
  },
  "poa annua": {
    commonName: "poa annua (annual bluegrass)",
    type: "grassy",
    kbTreatment:
      "Pre-emergent: Specticle Flo (indaziflam) in fall, 2-3 mL per 1,000 sqft, up to 3 applications; residual up to 1 year. Germinates when soil temp drops below 67°F for 7 consecutive days. Post-emergent: Certainty (sulfosulfuron). Bermuda-safe.",
  },
  "paspalum dilatatum": {
    commonName: "dallisgrass",
    type: "grassy",
    kbTreatment:
      "VERY HARD to control — no selective herbicide available. Spot treat only: cloth + 41% glyphosate applied directly to the plant. Pre-emergent is NOT effective. May require repeat applications or manual removal + resodding.",
  },
  "eleusine indica": {
    commonName: "goosegrass",
    type: "grassy",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension at soil temp 60-65°F (germinates later than crabgrass). Post-emergent: very difficult selectively — spot treat with glyphosate if severe. Bermuda: Revolver (foramsulfuron) may work on young plants.",
  },
  "cynodon dactylon": {
    commonName: "bermudagrass (invasive)",
    type: "grassy",
    kbTreatment:
      "In non-bermuda lawns this is an invasive weed. No selective herbicide in cool-season lawns. Spot treat with glyphosate or use Ornamec (fluazifop) in some turf types. Requires repeat treatments. Prevention: maintain thick turf and sharp bed edges.",
  },

  // --- Broadleaf weeds ---
  "taraxacum officinale": {
    commonName: "dandelion",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D, SpeedZone, or Celsius (bermuda/zoysia). Spot spray when temps 40-90°F. WARNING: 2,4-D can damage St. Augustine — use Atrazine or St. Aug-labeled products instead. Apply when actively growing; herbicide must dry on leaves.",
  },
  "trifolium repens": {
    commonName: "white clover",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D or triclopyr-based products. Bermuda/Zoysia: Celsius effective. St. Augustine: use Atrazine or labeled broadleaf killer. Often indicates low nitrogen — fertilizing may outcompete it naturally.",
  },
  "hydrocotyle umbellata": {
    commonName: "dollarweed (pennywort)",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: Atrazine (St. Augustine-safe), 2,4-D (NOT St. Augustine), or Celsius (bermuda/zoysia). Indicates overwatering — reduce irrigation frequency to discourage. Spot spray; multiple apps may be needed.",
  },
  "lamium amplexicaule": {
    commonName: "henbit",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: fall application of Barricade or Dimension (henbit is a winter annual, germinates in fall). Post-emergent: 2,4-D, SpeedZone, or Celsius (bermuda). St. Augustine: use Atrazine. Best treated in fall/early winter when young.",
  },
  "stellaria media": {
    commonName: "chickweed",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: fall application of Barricade (winter annual, germinates in fall). Post-emergent: 2,4-D, triclopyr, or SpeedZone. Bermuda: Celsius effective. St. Augustine: Atrazine. Treat in late fall / early winter when small.",
  },
  "plantago major": {
    commonName: "broadleaf plantain",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D, triclopyr, or SpeedZone. Bermuda/Zoysia: Celsius effective. St. Augustine: use Atrazine or labeled broadleaf herbicide. Indicates compacted soil — aerate to discourage regrowth.",
  },
  "plantago lanceolata": {
    commonName: "buckhorn plantain",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D, triclopyr, or SpeedZone. Bermuda/Zoysia: Celsius effective. St. Augustine: use Atrazine or labeled broadleaf herbicide. Same treatment as broadleaf plantain.",
  },
  "medicago lupulina": {
    commonName: "black medic",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D or triclopyr. Bermuda: Celsius effective. Annual — preventing seed set is key. Often indicates low nitrogen and compacted soil. Fertilize and aerate to discourage.",
  },
  "oxalis stricta": {
    commonName: "yellow woodsorrel",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: triclopyr (most effective), 2,4-D, or SpeedZone. Bermuda: Celsius. St. Augustine: use Atrazine or labeled product. Difficult — multiple applications often needed. Spot spray only.",
  },
  "viola sororia": {
    commonName: "wild violet",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: triclopyr (most effective against violets), repeated applications in fall. Very difficult to control. 2,4-D alone is usually insufficient. Bermuda: Celsius + Certainty combo. Multiple seasons of treatment may be required.",
  },
  "glechoma hederacea": {
    commonName: "creeping charlie (ground ivy)",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: triclopyr (best) or Battleship III. Apply in fall when actively growing. Very aggressive — requires multiple applications. Bermuda: Celsius. St. Augustine: use labeled broadleaf herbicide. Thrives in shade and moist soil.",
  },
  "daucus carota": {
    commonName: "wild carrot (Queen Anne's lace)",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D or triclopyr in first year (rosette stage). Biennial — prevent seed set in second year. Bermuda: Celsius effective. Mowing before flowering reduces spread.",
  },
  "portulaca oleracea": {
    commonName: "purslane",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension in spring (summer annual). Post-emergent: 2,4-D, dicamba, or SpeedZone. Bermuda: Celsius. Thrives in hot, dry conditions. Fragments can re-root — don't leave pulled pieces on soil.",
  },
  "mollugo verticillata": {
    commonName: "carpetweed",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension in spring (summer annual). Post-emergent: 2,4-D or SpeedZone. Bermuda: Celsius effective. Thin, mat-forming weed — indicates thin turf. Improve lawn density to prevent.",
  },
  "euphorbia maculata": {
    commonName: "spotted spurge",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension in spring (summer annual). Post-emergent: 2,4-D + dicamba, SpeedZone, or Celsius (bermuda). Spot spray — low-growing and spreads quickly. St. Augustine: use Atrazine or labeled product.",
  },
  "euphorbia prostrata": {
    commonName: "prostrate spurge",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension in spring (summer annual). Post-emergent: 2,4-D + dicamba, SpeedZone, or Celsius (bermuda). Same treatment as spotted spurge. Low-growing mat — hand-pull small infestations.",
  },
  "soliva sessilis": {
    commonName: "lawn burweed (sticker weed)",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: fall application of Barricade or Dimension (winter annual, germinates in fall). Post-emergent: 2,4-D or Atrazine (St. Augustine-safe) in late fall/winter BEFORE spiny seed heads form in spring. Timing is critical — once burrs form, mow low and bag.",
  },
  "lespedeza striata": {
    commonName: "common lespedeza",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: triclopyr or 2,4-D + dicamba combo. Bermuda: Celsius effective. Summer annual — treat in early summer when young. Thrives in low-fertility, compacted soils. Fertilize and aerate to discourage.",
  },
  "phyllanthus urinaria": {
    commonName: "chamber bitter",
    type: "broadleaf",
    kbTreatment:
      "Pre-emergent: Barricade or Dimension in spring (summer annual). Post-emergent: 2,4-D + dicamba or Atrazine (St. Augustine-safe). Bermuda: Celsius. Hand-pull small infestations before seed set. Common in warm-season lawns.",
  },
  "dichondra carolinensis": {
    commonName: "dichondra",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: triclopyr or 2,4-D. Bermuda: Celsius effective. Thrives in shady, moist areas. Improve drainage and increase sunlight if possible. Multiple applications needed for established patches.",
  },
  "youngia japonica": {
    commonName: "oriental false hawksbeard",
    type: "broadleaf",
    kbTreatment:
      "Post-emergent: 2,4-D, triclopyr, or SpeedZone. Bermuda: Celsius. Annual/biennial — prevent seed set by treating before flowering. Shallow-rooted and easy to hand-pull when small.",
  },

  // --- Sedges ---
  "cyperus rotundus": {
    commonName: "nutsedge (purple)",
    type: "sedge",
    kbTreatment:
      "Pre-emergent is NOT effective against nutsedge. Post-emergent: Certainty (sulfosulfuron) or Dismiss (sulfentrazone) for fast kill. Bermuda/Zoysia: Certainty + Dismiss combo most effective. Zoysia: Image Herbicide also labeled. St. Augustine: use SedgeHammer or labeled sedge product. Reproduces by tubers — repeat treatments required.",
  },
  "cyperus esculentus": {
    commonName: "nutsedge (yellow)",
    type: "sedge",
    kbTreatment:
      "Pre-emergent is NOT effective against nutsedge. Post-emergent: Certainty (sulfosulfuron) or Dismiss (sulfentrazone). Yellow nutsedge slightly easier to control than purple. Bermuda/Zoysia: Certainty most effective. St. Augustine: SedgeHammer or labeled product. Reduce overwatering — nutsedge thrives in wet soil.",
  },
  "kyllinga brevifolia": {
    commonName: "green kyllinga",
    type: "sedge",
    kbTreatment:
      "Pre-emergent is NOT effective. Post-emergent: Certainty (sulfosulfuron), Dismiss (sulfentrazone), or SedgeHammer. Same herbicide class as nutsedge. Spreads by rhizomes — spot treat aggressively. Reduce irrigation to discourage.",
  },
};

// ---------------------------------------------------------------------------
// Helper: look up a weed by scientific name (case-insensitive)
// ---------------------------------------------------------------------------

export function lookupWeed(scientificName: string): WeedEntry | null {
  return WEED_LOOKUP[scientificName.toLowerCase().trim()] ?? null;
}

// ---------------------------------------------------------------------------
// Helper: get all common names (for quick logging / display)
// ---------------------------------------------------------------------------

export function getAllCommonNames(): string[] {
  return Object.values(WEED_LOOKUP).map((e) => e.commonName);
}
