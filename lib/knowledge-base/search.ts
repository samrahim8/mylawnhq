import {
  KnowledgeArticle,
  KBProduct,
  DecisionTree,
  VideoReference,
} from "@/types";
import { ALL_ARTICLES, ALL_PRODUCTS } from "./index";
import { BERMUDA_DECISION_TREES } from "./bermuda/decision-trees";
import { BERMUDA_VIDEOS } from "./bermuda/video-references";

export interface SearchResult {
  articles: ScoredArticle[];
  products: KBProduct[];
  decisionTree: DecisionTree | null;
  videos: VideoReference[];
}

interface ScoredArticle {
  article: KnowledgeArticle;
  score: number;
}

/**
 * Tokenize a string into lowercase keywords, stripping common stop words.
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "is", "it", "in", "on", "at", "to", "for",
    "of", "and", "or", "but", "not", "with", "this", "that", "my",
    "i", "me", "do", "does", "how", "what", "when", "where", "why",
    "can", "should", "will", "would", "be", "am", "are", "was",
    "has", "have", "had", "just", "very", "so", "too", "also",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

/**
 * Score an article against a set of query tokens.
 * Title matches are weighted higher than content matches.
 */
function scoreArticle(
  article: KnowledgeArticle,
  queryTokens: string[]
): number {
  const titleLower = article.title.toLowerCase();
  const contentLower = article.content.toLowerCase();
  const slugLower = article.topic_slug.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    // Slug match (highest signal — it IS the topic)
    if (slugLower.includes(token)) {
      score += 5;
    }
    // Title match (strong signal)
    if (titleLower.includes(token)) {
      score += 3;
    }
    // Content match
    if (contentLower.includes(token)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Score a product against query tokens.
 */
function scoreProduct(product: KBProduct, queryTokens: string[]): number {
  const nameLower = product.name.toLowerCase();
  const useCaseLower = product.use_case.toLowerCase();
  const typeLower = product.product_type.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (nameLower.includes(token)) score += 3;
    if (typeLower.includes(token)) score += 2;
    if (useCaseLower.includes(token)) score += 1;
  }

  return score;
}

/**
 * Search the knowledge base with a natural language question.
 * Returns the top 3 matching articles, relevant products, any matching
 * decision tree, and related videos.
 *
 * Uses simple keyword matching — designed to be upgraded to embeddings later.
 */
export function searchKnowledgeBase(
  query: string,
  options?: { maxArticles?: number; grassCategory?: "cool_season" | "warm_season" }
): SearchResult {
  const maxArticles = options?.maxArticles ?? 3;
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return { articles: [], products: [], decisionTree: null, videos: [] };
  }

  // --- Score and rank articles ---
  let scoredArticles: ScoredArticle[] = ALL_ARTICLES.map((article) => ({
    article,
    score: scoreArticle(article, queryTokens),
  })).filter((sa) => sa.score > 0);

  // Optional: filter by grass category
  if (options?.grassCategory) {
    const categoryGrassIds =
      options.grassCategory === "warm_season"
        ? ["bermuda-common", "bermuda-hybrid"]
        : [
            "tall-fescue",
            "fine-fescue",
            "perennial-ryegrass",
            "kentucky-bluegrass",
          ];

    // Boost articles matching the user's grass category
    scoredArticles = scoredArticles.map((sa) => {
      const matchesCategory = sa.article.related_grass_types.some((gt) =>
        categoryGrassIds.includes(gt)
      );
      return matchesCategory
        ? { ...sa, score: sa.score * 1.5 }
        : sa;
    });
  }

  scoredArticles.sort((a, b) => b.score - a.score);
  const topArticles = scoredArticles.slice(0, maxArticles);

  // --- Collect related products from top articles ---
  const productIds = new Set<string>();
  for (const sa of topArticles) {
    for (const pid of sa.article.related_products) {
      productIds.add(pid);
    }
  }

  // Also find products matching the query directly
  const scoredProducts = ALL_PRODUCTS.map((p) => ({
    product: p,
    score: scoreProduct(p, queryTokens),
  }))
    .filter((sp) => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  for (const sp of scoredProducts) {
    productIds.add(sp.product.id);
  }

  const products = ALL_PRODUCTS.filter((p) => productIds.has(p.id));

  // --- Match decision tree ---
  const queryLower = query.toLowerCase();
  const decisionTree =
    BERMUDA_DECISION_TREES.find((dt) =>
      dt.keywords.some((kw) => queryLower.includes(kw))
    ) ?? null;

  // --- Collect related videos ---
  const topArticleIds = new Set(topArticles.map((sa) => sa.article.id));
  const videos = BERMUDA_VIDEOS.filter((v) =>
    v.related_article_ids.some((aid) => topArticleIds.has(aid))
  );

  return { articles: topArticles, products, decisionTree, videos };
}
