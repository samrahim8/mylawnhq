import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Complexity = "simple" | "reasoning";

export interface KBSection {
  sectionNumber: number;
  sectionTitle: string;
  complexity: Complexity;
  content: string;
}

export interface ParsedKBFile {
  grassTypeKey: string;
  metaPrompt: string;
  sections: Map<number, KBSection>;
}

// ---------------------------------------------------------------------------
// Grass type → file mapping (matches UserProfile.grassType enum)
// ---------------------------------------------------------------------------

const KB_FILE_MAP: Record<string, string> = {
  bermuda: "docs/bermuda_lawn_knowledge_base.md",
  zoysia: "docs/zoysia_lawn_knowledge_base.md",
  "st-augustine": "docs/st-augustine-lawn-care-knowledge-base.md",
  "fescue-kbg": "docs/cool-season-lawn-care-kb.md",
};

// ---------------------------------------------------------------------------
// Parser helpers
// ---------------------------------------------------------------------------

const META_PROMPT_RE = /^<!--\s*\n([\s\S]*?)-->/;
const SECTION_HEADING_RE = /^## Section (\d+):\s*(.+)$/;
const COMPLEXITY_RE = /<!--\s*complexity:\s*(simple|reasoning)\s*-->/;

function parseKBFile(grassTypeKey: string, filePath: string): ParsedKBFile {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  // Extract meta-prompt (HTML comment at top of file)
  const metaMatch = raw.match(META_PROMPT_RE);
  const metaPrompt = metaMatch ? metaMatch[1].trim() : "";

  // Parse sections
  const sections = new Map<number, KBSection>();
  let currentSection: { num: number; title: string; startIdx: number } | null = null;
  let currentComplexity: Complexity = "simple";

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(SECTION_HEADING_RE);
    if (headingMatch) {
      // Flush previous section
      if (currentSection) {
        const content = lines.slice(currentSection.startIdx, i).join("\n").trim();
        sections.set(currentSection.num, {
          sectionNumber: currentSection.num,
          sectionTitle: currentSection.title,
          complexity: currentComplexity,
          content,
        });
      }

      currentSection = {
        num: parseInt(headingMatch[1], 10),
        title: headingMatch[2].trim(),
        startIdx: i,
      };
      currentComplexity = "simple"; // reset default

      // Check next line for complexity tag
      if (i + 1 < lines.length) {
        const compMatch = lines[i + 1].match(COMPLEXITY_RE);
        if (compMatch) {
          currentComplexity = compMatch[1] as Complexity;
        }
      }
    }
  }

  // Flush last section
  if (currentSection) {
    const content = lines.slice(currentSection.startIdx).join("\n").trim();
    sections.set(currentSection.num, {
      sectionNumber: currentSection.num,
      sectionTitle: currentSection.title,
      complexity: currentComplexity,
      content,
    });
  }

  return { grassTypeKey, metaPrompt, sections };
}

// ---------------------------------------------------------------------------
// Lazy singleton — initialized on first call, reused in warm instances
// ---------------------------------------------------------------------------

let kbIndex: Map<string, ParsedKBFile> | null = null;
let sharedReferencesContent: string | null = null;

export function getKBIndex(): Map<string, ParsedKBFile> {
  if (kbIndex) return kbIndex;

  kbIndex = new Map();
  const root = process.cwd();

  for (const [key, relPath] of Object.entries(KB_FILE_MAP)) {
    const fullPath = path.join(root, relPath);
    try {
      kbIndex.set(key, parseKBFile(key, fullPath));
    } catch {
      // If a KB file is missing, skip it — don't crash the app
      console.error(`[kb-router] Failed to parse KB file: ${relPath}`);
    }
  }

  return kbIndex;
}

export function getSharedReferences(): string {
  if (sharedReferencesContent !== null) return sharedReferencesContent;

  const fullPath = path.join(process.cwd(), "docs/shared-references.md");
  try {
    const raw = fs.readFileSync(fullPath, "utf-8");
    // Strip the meta-prompt comment at the top
    sharedReferencesContent = raw.replace(META_PROMPT_RE, "").trim();
  } catch {
    console.error("[kb-router] Failed to read shared-references.md");
    sharedReferencesContent = "";
  }

  return sharedReferencesContent;
}

export function getAvailableGrassTypes(): string[] {
  return Object.keys(KB_FILE_MAP);
}
