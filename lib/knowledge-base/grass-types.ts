import { GrassType } from "@/types";

export const GRASS_TYPES: GrassType[] = [
  {
    id: "tall-fescue",
    name: "Tall Fescue",
    category: "cool_season",
    spread_method: "tillers",
    cutting_height_min: 2.5,
    cutting_height_max: 4,
    drought_tolerance: "good",
    traffic_tolerance: "good",
    shade_tolerance: "moderate",
    heat_tolerance: "moderate",
    cold_tolerance: "high",
    sun_preference: "Full sun (some varieties slightly shade tolerant)",
    n_requirement: "2-3 lb N/1000 sqft/season",
    germination_speed: "moderate",
    thatch_production: "low",
    description:
      "Most common cool season grass in the US. Non-spreading clump-former with flat, slightly wider blades. One of the easiest cool season grasses to maintain.",
    notes:
      "Many fescue sods contain ~10% KBG mixed in. Avoid K-31 pasture-type tall fescue — extremely wide coarse blade, pale color, no place in a fine lawn. For transition zones, consider improved tall fescue varieties that are more heat tolerant.",
  },
  {
    id: "fine-fescue",
    name: "Fine Fescue",
    category: "cool_season",
    spread_method: "tillers",
    cutting_height_min: 2.5,
    cutting_height_max: 3.5,
    drought_tolerance: "low",
    traffic_tolerance: "low",
    shade_tolerance: "high",
    heat_tolerance: "low",
    cold_tolerance: "high",
    sun_preference: "Shade areas only — does NOT perform well in full hot sun",
    n_requirement: "1-2 lb N/1000 sqft/season",
    germination_speed: "moderate",
    thatch_production: "low",
    description:
      "Very fine, soft blade grass best suited for shady areas. Includes Chewings Fescue and Creeping Red Fescue varieties.",
    notes:
      "Use only in shade areas. Not as dark green as tall fescue. Performs poorly in hot/sunny areas. Improved varieties available for better shade performance.",
  },
  {
    id: "perennial-ryegrass",
    name: "Perennial Ryegrass",
    category: "cool_season",
    spread_method: "tillers",
    cutting_height_min: 1.5,
    cutting_height_max: 2.5,
    drought_tolerance: "low",
    traffic_tolerance: "good",
    shade_tolerance: "low",
    heat_tolerance: "good",
    cold_tolerance: "moderate",
    sun_preference: "Full sun",
    n_requirement: "2-3 lb N/1000 sqft/season",
    germination_speed: "fast",
    thatch_production: "low",
    description:
      "Fine to medium textured, dark green grass with rapid germination. Excellent for overseeding. Sod-grade varieties can be cut down to 0.5 inches with a reel mower.",
    notes:
      "Can be competitive with other grasses. Typically used alone or in blends (~20% ryegrass mixed with KBG or fine fescues). Many varieties with various textures, colors, and benefits.",
  },
  {
    id: "kentucky-bluegrass",
    name: "Kentucky Bluegrass (KBG)",
    category: "cool_season",
    spread_method: "tillers_and_rhizomes",
    cutting_height_min: 2,
    cutting_height_max: 3,
    drought_tolerance: "moderate",
    traffic_tolerance: "high",
    shade_tolerance: "low",
    heat_tolerance: "moderate",
    cold_tolerance: "high",
    sun_preference: "Well-drained, sunny areas",
    n_requirement: "2-4 lb N/1000 sqft/season",
    germination_speed: "slow",
    thatch_production: "significant",
    description:
      "One of few cool season grasses that actively spreads via rhizomes. Self-repairs damage. Many grades, types, and varieties — all vary in texture and color. Sod-grade can be cut as low as 0.25 inches with a reel mower.",
    notes:
      "Recovers quickly from drought when cooler temps and moisture return (unless drought was severe). Higher nitrogen needs and significant thatch production. For transition zones, consider improved KBG varieties more heat tolerant.",
  },
];

export function getGrassTypeById(id: string): GrassType | undefined {
  return GRASS_TYPES.find((g) => g.id === id);
}

export function getGrassTypesByCategory(
  category: GrassType["category"]
): GrassType[] {
  return GRASS_TYPES.filter((g) => g.category === category);
}

export function getCoolSeasonGrassTypes(): GrassType[] {
  return getGrassTypesByCategory("cool_season");
}
