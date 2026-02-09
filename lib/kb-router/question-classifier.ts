import { Complexity } from "./section-parser";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ClassificationResult {
  matchedSections: number[];
  injectSharedReferences: boolean;
  maxComplexity: Complexity;
  matchedKeywords: string[];
  isWeedIdIntent: boolean;
}

// ---------------------------------------------------------------------------
// Intent rules — maps keyword patterns to section numbers
// ---------------------------------------------------------------------------

interface IntentRule {
  sections: number[];
  patterns: RegExp[];
}

const INTENT_RULES: IntentRule[] = [
  // Section 1: Grass Profile
  {
    sections: [1],
    patterns: [
      /grass\s*type/i,
      /what\s+(kind|type)\s+of\s+grass/i,
      /identify\s*(my\s+)?grass/i,
      /bermuda\s+vs/i,
      /hybrid\s+vs\s+common/i,
      /shade\s+toleran/i,
      /which\s+grass/i,
    ],
  },
  // Section 2: Mowing
  {
    sections: [2],
    patterns: [
      /\bmow/i,
      /\bcut\b.*\b(grass|lawn|height)/i,
      /\bheight\b.*\b(mow|cut|grass|blade)/i,
      /\breel\s*mow/i,
      /\brotary\s*mow/i,
      /\bscalp/i,
      /\bblade\b.*\b(sharp|dull|height)/i,
      /how\s+(short|tall|high|low)\s+should/i,
    ],
  },
  // Section 3: Watering
  {
    sections: [3],
    patterns: [
      /\bwater/i,
      /\birrigat/i,
      /\bdrought/i,
      /\bsprinkler/i,
      /how\s+much\s+water/i,
      /how\s+often.*water/i,
      /when\s+to\s+water/i,
      /deep\s+water/i,
    ],
  },
  // Section 4: Fertilization
  {
    sections: [4],
    patterns: [
      /\bfertiliz/i,
      /\bnpk\b/i,
      /\bnitrogen\b/i,
      /\bpgf\b/i,
      /\bfeed\b.*\b(lawn|grass)/i,
      /\bnutrient/i,
      /\bmilorganite\b/i,
      /\bphosphorus\b/i,
      /\bpotassium\b/i,
    ],
  },
  // Section 5: Seasonal Care Calendar
  {
    sections: [5],
    patterns: [
      /\bseason(al)?\b/i,
      /\bin\s+(the\s+)?(spring|summer|fall|winter)\b/i,
      /\bspring\b.*\b(care|lawn|do|plan|prep)/i,
      /\bsummer\b.*\b(care|lawn|do|plan|prep)/i,
      /\bfall\b.*\b(care|lawn|do|plan|prep)/i,
      /\bwinter\b.*\b(care|lawn|do|plan|prep|dormant)/i,
      /\bcalendar\b/i,
      /\bschedule\b/i,
      /when\s+should\s+i/i,
      /what\s+month/i,
      /what\s+time\s+of\s+year/i,
    ],
  },
  // Section 6: Weed Control
  {
    sections: [6],
    patterns: [
      /\bweed/i,
      /\bcrabgrass/i,
      /\bdandelion/i,
      /\bpre-?emergent/i,
      /\bpost-?emergent/i,
      /\bherbicide/i,
      /\bnutsedge/i,
      /\bclover\b/i,
      /\bchickweed/i,
      /\bhenbit/i,
      /\batrazine/i,
      /\bcelsius\b/i,
    ],
  },
  // Section 7: Pest Management (reasoning)
  {
    sections: [7],
    patterns: [
      /\bpest/i,
      /\bgrub/i,
      /\barmy\s?worm/i,
      /\bchinch/i,
      /\bbugs?\b/i,
      /\binsect/i,
      /\blarvae?\b/i,
      /\bwebworm/i,
      /\bmole\s*cricket/i,
      /\bvole/i,
      /\bbifenthrin/i,
      /\bgrubex/i,
    ],
  },
  // Section 8: Disease Management (reasoning)
  {
    sections: [8],
    patterns: [
      /\bdisease/i,
      /\bfung(us|al|i)/i,
      /\bbrown\s*(patch|spot)/i,
      /\bdollar\s*spot/i,
      /\biron\s*chlorosis/i,
      /\bgray\s*leaf/i,
      /\btake-?all/i,
      /\bpythium/i,
      /\bfungicide/i,
      /\bsummer\s*patch/i,
      /\bleaf\s*spot/i,
      /\byellow(ing)?\b.*\b(grass|lawn|blade|spot|patch)/i,
      /\b(grass|lawn)\b.*\byellow/i,
    ],
  },
  // Section 9: Soil & pH
  {
    sections: [9],
    patterns: [
      /\bsoil\b/i,
      /\bph\b/i,
      /\blime\b/i,
      /\bsulfur\b/i,
      /\bcompaction/i,
      /\bhumichar\b/i,
      /\bacid(ic)?\b/i,
      /\balkaline\b/i,
      /\baerat/i,
      /\btopdress/i,
      /\bsand\b.*\b(level|top)/i,
    ],
  },
  // Section 10: Establishment
  {
    sections: [10],
    patterns: [
      /\bseed(ing)?\b/i,
      /\bsod(ding)?\b/i,
      /\bestablish/i,
      /\bbare\s*spot/i,
      /\bnew\s+lawn/i,
      /\boverseed/i,
      /\bplug(s|ging)?\b/i,
      /\bsprig/i,
      /\bgermina/i,
      /\bstarter\s*fertiliz/i,
    ],
  },
  // Section 11: Troubleshooting (reasoning)
  {
    sections: [11],
    patterns: [
      /\bproblem/i,
      /what('s|\s+is)\s+wrong/i,
      /\bdying\b/i,
      /\bfix\b/i,
      /\btroubleshoot/i,
      /mostly\s+weeds/i,
      /help.*\b(lawn|grass)/i,
      /\bsaving\s+(my\s+)?lawn/i,
      /lawn\s+(is|looks)\s+(dead|brown|yellow|thin|patchy)/i,
      /\bpulls?\s+up/i,
      /\bpeeling\b.*\b(lawn|grass|turf)/i,
      /\b(grass|lawn)\b.*\b(turning|going)\s+(brown|yellow|dead)/i,
    ],
  },
  // Section 12: Product Quick Reference
  {
    sections: [12],
    patterns: [
      /\bproduct\b/i,
      /what\s+(should|can)\s+i\s+buy/i,
      /\bspreader\s*setting/i,
      /\bapplication\s*rate/i,
      /\bbag\b.*\b(size|cover|rate)/i,
      /\brecommend\b.*\b(product|brand)/i,
    ],
  },
];

// Patterns that indicate the user wants to identify a weed or plant in a photo.
// When combined with hasImages, this triggers the Pl@ntNet classification flow.
const WEED_ID_PATTERNS: RegExp[] = [
  /what\s+(is\s+)?this\s+(weed|plant|grass)/i,
  /identify\s+(this|my)\s*(weed|plant)?/i,
  /what('s|\s+is)\s+growing\s+in\s+my\s+lawn/i,
  /is\s+this\s+(crabgrass|nutsedge|clover|dandelion|chickweed|henbit|dallisgrass|poa\s*annua|goosegrass|spurge|plantain)/i,
  /what\s+weed\s+is\s+this/i,
  /can\s+you\s+identify\s+this/i,
  /what\s+kind\s+of\s+(weed|plant)/i,
  /help\s+me\s+identify/i,
  /what('s|\s+is)\s+this\s+in\s+my\s+(lawn|yard|grass)/i,
];

// Patterns that trigger shared-references.md injection
const SHARED_REF_PATTERNS: RegExp[] = [
  /\bproduct\b/i,
  /\bbuy\b/i,
  /where\s+(can\s+i\s+)?find/i,
  /\blink\b/i,
  /\bresource/i,
  /\bequipment\b/i,
  /\btool(s)?\b/i,
  /\burl\b/i,
  /\bwebsite\b/i,
  /\bmanual\b/i,
  /recommend\b.*\bproduct/i,
  /what\s+(should|can)\s+i\s+buy/i,
];

// Complexity per section number (from the KB template)
const SECTION_COMPLEXITY: Record<number, Complexity> = {
  1: "simple",
  2: "simple",
  3: "simple",
  4: "simple",
  5: "simple",
  6: "simple",
  7: "reasoning",
  8: "reasoning",
  9: "simple",
  10: "simple",
  11: "reasoning",
  12: "simple",
};

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

export function classifyQuestion(question: string): ClassificationResult {
  const matchedSectionSet = new Set<number>();
  const matchedKeywords: string[] = [];

  // Test each intent rule against the question
  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(question)) {
        for (const section of rule.sections) {
          matchedSectionSet.add(section);
        }
        matchedKeywords.push(pattern.source);
        break; // One match per rule is enough
      }
    }
  }

  // Fallback: if nothing matched, inject Section 1 + Section 5
  if (matchedSectionSet.size === 0) {
    matchedSectionSet.add(1);
    matchedSectionSet.add(5);
  }

  const matchedSections = Array.from(matchedSectionSet).sort((a, b) => a - b);

  // Determine max complexity from matched sections
  let maxComplexity: Complexity = "simple";
  for (const sec of matchedSections) {
    if (SECTION_COMPLEXITY[sec] === "reasoning") {
      maxComplexity = "reasoning";
      break;
    }
  }

  // Check if shared references should be injected
  const injectSharedReferences = SHARED_REF_PATTERNS.some((p) => p.test(question));

  // Check if the question is a weed/plant identification request.
  // Explicit weed ID phrasing always triggers, OR if Section 6 matched and
  // the question uses generic identification language (e.g. "what is this?")
  const explicitWeedId = WEED_ID_PATTERNS.some((p) => p.test(question));
  const genericIdWithSection6 =
    matchedSectionSet.has(6) &&
    /what\s+(is\s+)?this/i.test(question);
  const isWeedIdIntent = explicitWeedId || genericIdWithSection6;

  return {
    matchedSections,
    injectSharedReferences,
    maxComplexity,
    matchedKeywords,
    isWeedIdIntent,
  };
}
