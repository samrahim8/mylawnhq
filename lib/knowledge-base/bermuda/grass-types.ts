import { GrassType } from "@/types";

export const BERMUDA_GRASS_TYPES: GrassType[] = [
  {
    id: "bermuda-common",
    name: "Common Bermuda",
    category: "warm_season",
    spread_method: "tillers_and_rhizomes",
    cutting_height_min: 0.75,
    cutting_height_max: 1.5,
    drought_tolerance: "high",
    traffic_tolerance: "high",
    shade_tolerance: "low",
    heat_tolerance: "high",
    cold_tolerance: "moderate",
    sun_preference: "8+ hours full sun daily",
    n_requirement: "1 lb N per 1,000 sq ft every 3-6 weeks during growing season",
    germination_speed: "moderate",
    thatch_production: "moderate",
    description:
      "Natural/field-grown Bermuda with thick, coarse, wiry blades. Widely available as seed at big box stores. Very cheap. Most aggressive spreading grass in the US. Roots can reach 60 inches deep. Ideal growing temps 85-90°F.",
    notes:
      "DO NOT overseed hybrid sod with common Bermuda seed — texture and color differences will show. Quality seed varieties include Arden 15, LaPrima XD, Black Jack, and Yukon.",
  },
  {
    id: "bermuda-hybrid",
    name: "Hybrid Bermuda",
    category: "warm_season",
    spread_method: "tillers_and_rhizomes",
    cutting_height_min: 0.5,
    cutting_height_max: 1.5,
    drought_tolerance: "high",
    traffic_tolerance: "high",
    shade_tolerance: "low",
    heat_tolerance: "high",
    cold_tolerance: "moderate",
    sun_preference: "8+ hours full sun daily",
    n_requirement: "1 lb N per 1,000 sq ft every 3-6 weeks during growing season",
    germination_speed: "slow",
    thatch_production: "moderate",
    description:
      "Lab-developed/bred Bermuda with very fine, dense blades. Seeds are sterile — sold as sod or plugs only. Found on golf courses and premium lawns. Higher cost than common Bermuda.",
    notes:
      "Cannot be seeded — must be established from sod or plugs. Drive (Quinclorac) may temporarily yellow hybrid Bermuda.",
  },
];

export function getBermudaGrassTypeById(
  id: string
): GrassType | undefined {
  return BERMUDA_GRASS_TYPES.find((g) => g.id === id);
}

export function getBermudaGrassTypes(): GrassType[] {
  return BERMUDA_GRASS_TYPES;
}
