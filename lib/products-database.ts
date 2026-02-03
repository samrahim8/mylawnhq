import { LawnProduct } from "@/types";

// Curated database of popular lawn care products with application rates
// Data sourced from product labels and manufacturer recommendations

export const CURATED_PRODUCTS: LawnProduct[] = [
  // ============================================
  // FERTILIZERS - Scotts
  // ============================================
  {
    id: "scotts-turf-builder-lawn-food",
    name: "Scotts Turf Builder Lawn Food",
    brand: "Scotts",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 2.87,
      bagSize: 12.5,
      bagCoverage: 5000,
    },
    npk: "32-0-4",
    source: "curated",
  },
  {
    id: "scotts-turf-builder-weed-feed",
    name: "Scotts Turf Builder Weed & Feed",
    brand: "Scotts",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.23,
      bagSize: 14.29,
      bagCoverage: 5000,
    },
    npk: "28-0-3",
    source: "curated",
  },
  {
    id: "scotts-turf-builder-southern",
    name: "Scotts Turf Builder Southern Lawn Food",
    brand: "Scotts",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 2.87,
      bagSize: 14.06,
      bagCoverage: 5000,
    },
    npk: "32-0-10",
    source: "curated",
  },
  {
    id: "scotts-turf-builder-triple-action",
    name: "Scotts Turf Builder Triple Action",
    brand: "Scotts",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.23,
      bagSize: 20,
      bagCoverage: 4000,
    },
    npk: "29-0-10",
    source: "curated",
  },
  {
    id: "scotts-grubex",
    name: "Scotts GrubEx Season Long Grub Killer",
    brand: "Scotts",
    category: "pestControl",
    applicationRate: {
      lbsPer1000sqft: 2.87,
      bagSize: 14.35,
      bagCoverage: 5000,
    },
    source: "curated",
  },
  {
    id: "scotts-turf-builder-winterguard",
    name: "Scotts Turf Builder WinterGuard Fall Lawn Food",
    brand: "Scotts",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 2.87,
      bagSize: 12.5,
      bagCoverage: 5000,
    },
    npk: "32-0-10",
    source: "curated",
  },

  // ============================================
  // FERTILIZERS - The Andersons
  // ============================================
  {
    id: "andersons-pgf-complete-18lb",
    name: "The Andersons PGF Complete 16-4-8 (18 lb)",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "16-4-8",
    source: "curated",
  },
  {
    id: "andersons-pgf-complete-40lb",
    name: "The Andersons PGF Complete 16-4-8 (40 lb)",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 40,
      bagCoverage: 11000,
    },
    npk: "16-4-8",
    source: "curated",
  },
  {
    id: "andersons-pgf-16-0-8",
    name: "The Andersons PGF 16-0-8 (Phosphorus-Free)",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 40,
      bagCoverage: 10000,
    },
    npk: "16-0-8",
    source: "curated",
  },
  {
    id: "andersons-pgf-balanced-18lb",
    name: "The Andersons PGF Balanced 10-10-10 (18 lb)",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "10-10-10",
    source: "curated",
  },
  {
    id: "andersons-pgf-balanced-40lb",
    name: "The Andersons PGF Balanced 10-10-10 (40 lb)",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 40,
      bagCoverage: 11000,
    },
    npk: "10-10-10",
    source: "curated",
  },
  {
    id: "andersons-deep-green-24-0-11",
    name: "The Andersons Deep Green 24-0-11",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 40,
      bagCoverage: 10000,
    },
    npk: "24-0-11",
    source: "curated",
  },
  {
    id: "andersons-dgl-25-0-0",
    name: "The Andersons Dark Green Lawn (DGL) 25-0-0",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "25-0-0",
    source: "curated",
  },
  {
    id: "andersons-core-24-6-12",
    name: "The Andersons Core 24-6-12 All-Purpose",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 2.9,
      bagSize: 45,
      bagCoverage: 15500,
    },
    npk: "24-6-12",
    source: "curated",
  },
  {
    id: "andersons-core-12-8-12",
    name: "The Andersons Core 12-8-12 Quick-Release",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 45,
      bagCoverage: 12500,
    },
    npk: "12-8-12",
    source: "curated",
  },
  {
    id: "andersons-greenshocker-7-1-2",
    name: "The Andersons GreenShocker 7-1-2",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3,
      bagSize: 16,
      bagCoverage: 5333,
    },
    npk: "7-1-2",
    source: "curated",
  },
  {
    id: "andersons-innova-7-1-2",
    name: "The Andersons Innova 7-1-2 Organic",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 7.14,
      bagSize: 40,
      bagCoverage: 5600,
    },
    npk: "7-1-2",
    source: "curated",
  },
  {
    id: "andersons-humic-dg",
    name: "The Andersons Humic DG",
    brand: "The Andersons",
    category: "other",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 40,
      bagCoverage: 10000,
    },
    source: "curated",
  },
  {
    id: "andersons-humichar",
    name: "The Andersons HumiChar",
    brand: "The Andersons",
    category: "other",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 40,
      bagCoverage: 10000,
    },
    source: "curated",
  },
  {
    id: "andersons-crabgrass-preventer-26-0-6",
    name: "The Andersons Crabgrass Preventer Plus Lawn Food 26-0-6",
    brand: "The Andersons",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "26-0-6",
    source: "curated",
  },
  {
    id: "andersons-weed-feed-24-0-16",
    name: "The Andersons Weed & Feed 24-0-16",
    brand: "The Andersons",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "24-0-16",
    source: "curated",
  },
  {
    id: "andersons-fall-lawn-food-24-0-14",
    name: "The Andersons Fall Lawn Food 24-0-14",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      bagSize: 18,
      bagCoverage: 5000,
    },
    npk: "24-0-14",
    source: "curated",
  },
  {
    id: "andersons-18-0-4",
    name: "The Andersons Professional 18-0-4",
    brand: "The Andersons",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 5.56,
      bagSize: 50,
      bagCoverage: 9000,
    },
    npk: "18-0-4",
    source: "curated",
  },
  {
    id: "andersons-barricade-0.48",
    name: "The Andersons Barricade 0.48% Pre-Emergent",
    brand: "The Andersons",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      lbsPer1000sqftLow: 3.1,
      lbsPer1000sqftHigh: 4.8,
      bagSize: 18,
      bagCoverage: 5000,
    },
    source: "curated",
  },
  {
    id: "andersons-barricade-0.48-50lb",
    name: "The Andersons Barricade 0.48% Pre-Emergent (50 lb)",
    brand: "The Andersons",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 3.6,
      lbsPer1000sqftLow: 3.1,
      lbsPer1000sqftHigh: 4.8,
      bagSize: 50,
      bagCoverage: 13888,
    },
    source: "curated",
  },

  // ============================================
  // FERTILIZERS - Milorganite
  // ============================================
  {
    id: "milorganite-organic",
    name: "Milorganite Organic Nitrogen Fertilizer",
    brand: "Milorganite",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 8,
      bagSize: 32,
      bagCoverage: 2500,
    },
    npk: "6-4-0",
    source: "curated",
  },

  // ============================================
  // FERTILIZERS - Lesco
  // ============================================
  {
    id: "lesco-24-0-11",
    name: "Lesco Professional 24-0-11",
    brand: "Lesco",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 4.17,
      bagSize: 50,
      bagCoverage: 12000,
    },
    npk: "24-0-11",
    source: "curated",
  },
  {
    id: "lesco-18-0-3",
    name: "Lesco Dimension Pre-Emergent 18-0-3",
    brand: "Lesco",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 4.6,
      bagSize: 50,
      bagCoverage: 10870,
    },
    npk: "18-0-3",
    source: "curated",
  },
  {
    id: "lesco-starter-18-24-12",
    name: "Lesco Starter Fertilizer 18-24-12",
    brand: "Lesco",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 5,
      bagSize: 50,
      bagCoverage: 10000,
    },
    npk: "18-24-12",
    source: "curated",
  },

  // ============================================
  // FERTILIZERS - Jonathan Green
  // ============================================
  {
    id: "jonathan-green-green-up",
    name: "Jonathan Green Green-Up Lawn Food",
    brand: "Jonathan Green",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.5,
      bagSize: 15,
      bagCoverage: 5000,
    },
    npk: "29-0-3",
    source: "curated",
  },
  {
    id: "jonathan-green-winter-survival",
    name: "Jonathan Green Winter Survival Fall Fertilizer",
    brand: "Jonathan Green",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 6,
      bagSize: 45,
      bagCoverage: 15000,
    },
    npk: "10-0-20",
    source: "curated",
  },

  // ============================================
  // FERTILIZERS - Pennington
  // ============================================
  {
    id: "pennington-ultragreen-lawn",
    name: "Pennington UltraGreen Lawn Fertilizer",
    brand: "Pennington",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 3.13,
      bagSize: 14,
      bagCoverage: 5000,
    },
    npk: "30-0-4",
    source: "curated",
  },
  {
    id: "pennington-ultragreen-weed-feed",
    name: "Pennington UltraGreen Weed & Feed",
    brand: "Pennington",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 12.5,
      bagCoverage: 5000,
    },
    npk: "30-0-4",
    source: "curated",
  },

  // ============================================
  // PRE-EMERGENT HERBICIDES
  // ============================================
  {
    id: "prodiamine-65-wdg",
    name: "Prodiamine 65 WDG (Generic Barricade)",
    brand: "Generic",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 0.034,
      bagSize: 5,
    },
    source: "curated",
  },
  {
    id: "dimension-pre-emergent",
    name: "Dimension 2EW Pre-Emergent",
    brand: "Corteva",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 0.25,
    },
    source: "curated",
  },
  {
    id: "barricade-4fl",
    name: "Barricade 4FL Pre-Emergent",
    brand: "Syngenta",
    category: "weedControl",
    applicationRate: {
      lbsPer1000sqft: 0.38,
    },
    source: "curated",
  },

  // ============================================
  // GRASS SEED - Bermuda
  // ============================================
  {
    id: "scotts-bermuda-seed",
    name: "Scotts Turf Builder Bermuda Grass Seed",
    brand: "Scotts",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 3,
      bagSize: 10,
      bagCoverage: 3300,
    },
    source: "curated",
  },
  {
    id: "pennington-bermuda-seed",
    name: "Pennington Smart Seed Bermuda Grass",
    brand: "Pennington",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 1.5,
      bagSize: 8.75,
      bagCoverage: 5800,
    },
    source: "curated",
  },
  {
    id: "arden-15-bermuda",
    name: "Arden 15 Hybrid Bermuda Grass Seed",
    brand: "Arden",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 2,
      bagSize: 5,
      bagCoverage: 2500,
    },
    source: "curated",
  },

  // ============================================
  // GRASS SEED - Zoysia
  // ============================================
  {
    id: "scotts-zoysia-seed",
    name: "Scotts Turf Builder Zoysia Grass Seed",
    brand: "Scotts",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 3,
      bagSize: 5,
      bagCoverage: 1600,
    },
    source: "curated",
  },
  {
    id: "zenith-zoysia-seed",
    name: "Zenith Zoysia Grass Seed",
    brand: "Patten Seed",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 2,
      bagSize: 10,
      bagCoverage: 5000,
    },
    source: "curated",
  },

  // ============================================
  // GRASS SEED - Cool Season
  // ============================================
  {
    id: "scotts-tall-fescue",
    name: "Scotts Turf Builder Tall Fescue Mix",
    brand: "Scotts",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 8,
      bagSize: 20,
      bagCoverage: 2500,
    },
    source: "curated",
  },
  {
    id: "jonathan-green-black-beauty",
    name: "Jonathan Green Black Beauty Ultra",
    brand: "Jonathan Green",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 5,
      bagSize: 25,
      bagCoverage: 5000,
    },
    source: "curated",
  },
  {
    id: "pennington-smart-seed-sun-shade",
    name: "Pennington Smart Seed Sun & Shade",
    brand: "Pennington",
    category: "seed",
    applicationRate: {
      lbsPer1000sqft: 4,
      bagSize: 20,
      bagCoverage: 5000,
    },
    source: "curated",
  },

  // ============================================
  // LAWN CARE - Insecticides
  // ============================================
  {
    id: "bioadvanced-grub-killer",
    name: "BioAdvanced 24-Hour Grub Killer Plus",
    brand: "BioAdvanced",
    category: "pestControl",
    applicationRate: {
      lbsPer1000sqft: 2.87,
      bagSize: 10,
      bagCoverage: 5000,
    },
    source: "curated",
  },
  {
    id: "spectracide-triazicide",
    name: "Spectracide Triazicide Insect Killer",
    brand: "Spectracide",
    category: "pestControl",
    applicationRate: {
      lbsPer1000sqft: 2.3,
      bagSize: 10,
      bagCoverage: 5000,
    },
    source: "curated",
  },

  // ============================================
  // LIME & SOIL AMENDMENTS
  // ============================================
  {
    id: "pennington-fast-acting-lime",
    name: "Pennington Fast Acting Lime",
    brand: "Pennington",
    category: "other",
    applicationRate: {
      lbsPer1000sqft: 10,
      bagSize: 30,
      bagCoverage: 3000,
    },
    source: "curated",
  },
  {
    id: "espoma-organic-lime",
    name: "Espoma Organic Garden Lime",
    brand: "Espoma",
    category: "other",
    applicationRate: {
      lbsPer1000sqft: 5,
      bagSize: 6.75,
      bagCoverage: 1000,
    },
    source: "curated",
  },
  {
    id: "ironite-mineral-supplement",
    name: "Ironite Mineral Supplement 1-0-0",
    brand: "Ironite",
    category: "fertilizer",
    applicationRate: {
      lbsPer1000sqft: 1,
      bagSize: 15,
      bagCoverage: 15000,
    },
    npk: "1-0-0",
    source: "curated",
  },
];

// Helper function to search products
export function searchProducts(query: string): LawnProduct[] {
  const lowerQuery = query.toLowerCase();
  return CURATED_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.npk?.toLowerCase().includes(lowerQuery)
  );
}

// Get products by category
export function getProductsByCategory(
  category: LawnProduct["category"]
): LawnProduct[] {
  return CURATED_PRODUCTS.filter((product) => product.category === category);
}

// Get products by brand
export function getProductsByBrand(brand: string): LawnProduct[] {
  return CURATED_PRODUCTS.filter(
    (product) => product.brand.toLowerCase() === brand.toLowerCase()
  );
}

// Get all unique brands
export function getAllBrands(): string[] {
  const brands = new Set(CURATED_PRODUCTS.map((p) => p.brand));
  return Array.from(brands).sort();
}

// Get product by ID
export function getProductById(id: string): LawnProduct | undefined {
  return CURATED_PRODUCTS.find((p) => p.id === id);
}
