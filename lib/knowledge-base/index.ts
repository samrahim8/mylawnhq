// Knowledge Base — Barrel Export
// Structured data following the Section 10 schema from cool-season-lawn-care-kb.md

export {
  GRASS_TYPES,
  getGrassTypeById,
  getGrassTypesByCategory,
  getCoolSeasonGrassTypes,
} from "./grass-types";

export {
  SEASONAL_TASKS,
  getTasksBySeason,
  getTasksByGrassCategory,
  getCoolSeasonTasks,
  getCoolSeasonTasksBySeason,
} from "./seasonal-tasks";

export {
  KB_PRODUCTS,
  getKBProductById,
  getKBProductsByType,
  getBaseFertilizers,
  getKBProductsBySeason,
} from "./products";

export { SOIL_TARGETS, getSoilTargetByGrassType } from "./soil-targets";

export {
  KNOWLEDGE_ARTICLES,
  getArticleBySlug,
  getArticlesByGrassType,
  getArticlesBySeason,
  getArticlesByProduct,
} from "./knowledge-articles";

// ============================================
// Bermuda Knowledge Base
// ============================================

export {
  BERMUDA_GRASS_TYPES,
  getBermudaGrassTypeById,
  getBermudaGrassTypes,
  BERMUDA_PRODUCTS,
  getBermudaProductById,
  getBermudaProductsByType,
  BERMUDA_SOIL_TARGETS,
  getBermudaSoilTarget,
  BERMUDA_ARTICLES,
  getBermudaArticleBySlug,
  getBermudaArticlesByProduct,
  getBermudaArticlesBySeason,
  BERMUDA_SEASONAL_TASKS,
  getBermudaTasksBySeason,
  BERMUDA_VIDEOS,
  getVideosByArticle,
  BERMUDA_DECISION_TREES,
  getDecisionTreeBySlug,
  matchDecisionTree,
  getBermudaSeasonalPlan,
  getBermudaCareProfile,
  getBermudaVideosForArticle,
} from "./bermuda";

// ============================================
// Cross-Entity Query Helpers
// ============================================

import { Season } from "@/types";
import { GRASS_TYPES } from "./grass-types";
import { SEASONAL_TASKS } from "./seasonal-tasks";
import { KB_PRODUCTS } from "./products";
import { SOIL_TARGETS } from "./soil-targets";
import { KNOWLEDGE_ARTICLES } from "./knowledge-articles";
import { BERMUDA_GRASS_TYPES } from "./bermuda/grass-types";
import { BERMUDA_ARTICLES } from "./bermuda/knowledge-articles";
import { BERMUDA_PRODUCTS } from "./bermuda/products";
import { BERMUDA_SEASONAL_TASKS } from "./bermuda/seasonal-tasks";
import { BERMUDA_SOIL_TARGETS } from "./bermuda/soil-targets";

/** All grass types (cool + warm season) */
export const ALL_GRASS_TYPES = [...GRASS_TYPES, ...BERMUDA_GRASS_TYPES];

/** All knowledge articles (cool + warm season) */
export const ALL_ARTICLES = [...KNOWLEDGE_ARTICLES, ...BERMUDA_ARTICLES];

/** All products (cool + warm season) */
export const ALL_PRODUCTS = [...KB_PRODUCTS, ...BERMUDA_PRODUCTS];

/** All seasonal tasks (cool + warm season) */
export const ALL_SEASONAL_TASKS = [...SEASONAL_TASKS, ...BERMUDA_SEASONAL_TASKS];

/** All soil targets (cool + warm season) */
export const ALL_SOIL_TARGETS = [...SOIL_TARGETS, ...BERMUDA_SOIL_TARGETS];

/**
 * Get a full seasonal plan for a given grass type.
 * Returns tasks for the season matched to the grass category.
 */
export function getSeasonalPlan(grassTypeId: string, season: Season) {
  const grass = ALL_GRASS_TYPES.find((g) => g.id === grassTypeId);
  if (!grass) return null;

  const tasks = ALL_SEASONAL_TASKS.filter(
    (t) =>
      t.season === season &&
      (t.grass_category === grass.category || t.grass_category === "both")
  ).sort((a, b) => a.priority - b.priority);

  const productIds = tasks.flatMap((t) => t.products);
  const products = ALL_PRODUCTS.filter((p) => productIds.includes(p.id));

  const articles = ALL_ARTICLES.filter(
    (a) =>
      a.related_grass_types.includes(grassTypeId) &&
      a.related_seasons.includes(season)
  );

  return { grass, tasks, products, articles };
}

/**
 * Get complete care profile for a grass type.
 * Includes soil targets, all seasonal tasks, and relevant articles.
 */
export function getGrassCareProfile(grassTypeId: string) {
  const grass = ALL_GRASS_TYPES.find((g) => g.id === grassTypeId);
  if (!grass) return null;

  const soilTarget = ALL_SOIL_TARGETS.find(
    (s) => s.grass_type_id === grassTypeId
  );

  const tasks = ALL_SEASONAL_TASKS.filter(
    (t) => t.grass_category === grass.category || t.grass_category === "both"
  );

  const articles = ALL_ARTICLES.filter((a) =>
    a.related_grass_types.includes(grassTypeId)
  );

  return { grass, soilTarget, tasks, articles };
}

/**
 * Match a user query intent to relevant KB data.
 * Used by the chatbot to pull structured context for AI responses.
 */
export function getKBContextForQuery(intent: string, grassTypeId?: string) {
  const intentMap: Record<string, string[]> = {
    // Cool season
    "grass-selection": ["tall-fescue", "fine-fescue", "perennial-ryegrass", "kentucky-bluegrass"],
    "fertilizer": ["fertilizer-program", "spoon-feeding", "winterizing", "bermuda-fertilizer", "bermuda-organic-fertilizer"],
    "brown-patches": ["pest-management", "bermuda-fungus", "bermuda-grubs"],
    "best-fertilizer": ["fertilizer-program", "bermuda-fertilizer"],
    "summer-fertilize": ["spoon-feeding", "bermuda-spray-supplements"],
    "fix-soil": ["soil-testing", "soil-carbon", "bermuda-humichar", "bermuda-ph"],
    "monthly-tasks": [],
    "measure-lawn": ["soil-testing"],
    "pre-emergent": ["pre-emergent", "bermuda-pre-emergent-spring", "bermuda-pre-emergent-fall"],
    "seeding": ["seeding", "bermuda-seeding"],
    "mowing": ["mowing", "bermuda-mowing"],
    "watering": ["watering", "bermuda-watering"],
    "aeration": ["aeration", "bermuda-aeration"],
    "dethatching": ["dethatching", "bermuda-dethatching"],
    "weed-control": ["weed-control", "bermuda-weed-killing"],
    "pests": ["pest-management", "bermuda-grubs", "bermuda-army-worms"],
    // Bermuda-specific
    "bermuda-overview": ["bermuda-overview", "bermuda-fundamentals"],
    "bermuda-calendar": ["bermuda-seasonal-stages"],
    "bermuda-kick-start": ["bermuda-kick-start"],
    "bermuda-scalping": ["bermuda-scalping"],
    "bermuda-leveling": ["bermuda-leveling"],
    "bermuda-fungus": ["bermuda-fungus"],
    "bermuda-organic-matter": ["bermuda-organic-matter"],
  };

  const slugs = intentMap[intent] || [];
  const articles = ALL_ARTICLES.filter((a) => slugs.includes(a.topic_slug));

  const grassTypes = grassTypeId
    ? ALL_GRASS_TYPES.filter((g) => g.id === grassTypeId)
    : intent === "grass-selection"
    ? GRASS_TYPES.filter((g) => g.category === "cool_season")
    : [];

  return { articles, grassTypes };
}
