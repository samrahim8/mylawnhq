// Bermuda Knowledge Base — Barrel Export
// Parsed from docs/bermuda_lawn_knowledge_base.md

export {
  BERMUDA_GRASS_TYPES,
  getBermudaGrassTypeById,
  getBermudaGrassTypes,
} from "./grass-types";

export {
  BERMUDA_PRODUCTS,
  getBermudaProductById,
  getBermudaProductsByType,
} from "./products";

export {
  BERMUDA_SOIL_TARGETS,
  getBermudaSoilTarget,
} from "./soil-targets";

export {
  BERMUDA_ARTICLES,
  getBermudaArticleBySlug,
  getBermudaArticlesByProduct,
  getBermudaArticlesBySeason,
} from "./knowledge-articles";

export {
  BERMUDA_SEASONAL_TASKS,
  getBermudaTasksBySeason,
} from "./seasonal-tasks";

export {
  BERMUDA_VIDEOS,
  getVideosByArticle,
} from "./video-references";

export {
  BERMUDA_DECISION_TREES,
  getDecisionTreeBySlug,
  matchDecisionTree,
} from "./decision-trees";

// ============================================
// Cross-Entity Query Helpers
// ============================================

import { Season } from "@/types";
import { BERMUDA_GRASS_TYPES } from "./grass-types";
import { BERMUDA_SEASONAL_TASKS } from "./seasonal-tasks";
import { BERMUDA_PRODUCTS } from "./products";
import { BERMUDA_SOIL_TARGETS } from "./soil-targets";
import { BERMUDA_ARTICLES } from "./knowledge-articles";
import { BERMUDA_VIDEOS } from "./video-references";

/**
 * Get a full seasonal plan for a Bermuda grass type.
 */
export function getBermudaSeasonalPlan(grassTypeId: string, season: Season) {
  const grass = BERMUDA_GRASS_TYPES.find((g) => g.id === grassTypeId);
  if (!grass) return null;

  const tasks = BERMUDA_SEASONAL_TASKS.filter(
    (t) => t.season === season
  ).sort((a, b) => a.priority - b.priority);

  const productIds = tasks.flatMap((t) => t.products);
  const products = BERMUDA_PRODUCTS.filter((p) => productIds.includes(p.id));

  const articles = BERMUDA_ARTICLES.filter(
    (a) =>
      a.related_grass_types.includes(grassTypeId) &&
      a.related_seasons.includes(season)
  );

  return { grass, tasks, products, articles };
}

/**
 * Get complete care profile for a Bermuda grass type.
 */
export function getBermudaCareProfile(grassTypeId: string) {
  const grass = BERMUDA_GRASS_TYPES.find((g) => g.id === grassTypeId);
  if (!grass) return null;

  const soilTarget = BERMUDA_SOIL_TARGETS.find(
    (s) => s.grass_type_id === grassTypeId
  );

  const tasks = BERMUDA_SEASONAL_TASKS;
  const articles = BERMUDA_ARTICLES.filter((a) =>
    a.related_grass_types.includes(grassTypeId)
  );

  return { grass, soilTarget, tasks, articles };
}

/**
 * Get all videos related to a specific article.
 */
export function getBermudaVideosForArticle(articleId: string) {
  return BERMUDA_VIDEOS.filter((v) =>
    v.related_article_ids.includes(articleId)
  );
}
