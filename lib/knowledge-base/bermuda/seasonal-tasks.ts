import { SeasonalTask } from "@/types";

export const BERMUDA_SEASONAL_TASKS: SeasonalTask[] = [
  // ============================================
  // WINTER (Dormant)
  // ============================================
  {
    id: "bst-winter-ph",
    season: "winter",
    task_name: "pH Adjustment",
    task_description:
      "Preferred timing for pH adjustments. Low pH: add lime. High pH: pelletized sulfur at 5 lbs per 1,000 sq ft (only when air temps below 75°F).",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "Below 50°F",
    products: [],
    warnings:
      "Lawn is dormant but ALIVE. DO NOT apply total-kill products like RoundUp.",
  },
  {
    id: "bst-winter-rolling",
    season: "winter",
    task_name: "Off-Season Rolling",
    task_description:
      "Rolling while soil is moist can reduce rut marks from mowing season. Not recommended during growing season.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: "Below 50°F",
    products: [],
    warnings: null,
  },

  // ============================================
  // LATE WINTER (Soil Temps ~50°F)
  // ============================================
  {
    id: "bst-latewinter-soiltest",
    season: "late_winter",
    task_name: "Soil Test",
    task_description:
      "Get a soil test to identify deficiencies and pH level. Step 1 of Kick Start program.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: 50,
    air_temp_trigger: null,
    products: ["b-soil-test-kit"],
    warnings: null,
  },
  {
    id: "bst-latewinter-kickstart",
    season: "late_winter",
    task_name: "Kick Start Program",
    task_description:
      "Apply simultaneously: early granular pre-emergent (stops weeds) + HUMICHAR at bag rate (improves soil) + PGF 10-10-10 Balanced (fills soil with nutrients). Late Feb/early March in GA.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: 50,
    air_temp_trigger: null,
    products: ["b-granular-pe", "b-humichar", "b-pgf-balance"],
    warnings: null,
  },
  {
    id: "bst-latewinter-weedkill",
    season: "late_winter",
    task_name: "Kill Existing Weeds",
    task_description:
      "Best while grass is still asleep (reduces negative impact). Use Bermuda-safe weed killer spray. DO NOT use RoundUp.",
    grass_category: "warm_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-q4-plus", "b-southern-ag-24d"],
    warnings:
      "DO NOT use RoundUp — myth that it's safe during dormancy. Most lawns never 100% dormant.",
  },

  // ============================================
  // EARLY SPRING (Temps hitting 70s)
  // ============================================
  {
    id: "bst-earlyspring-scalp",
    season: "early_spring",
    task_name: "Spring Scalp",
    task_description:
      "Scalp to 50% of desired growing height when full green haze appears. Want 1.5\" → scalp to 3/4\". Removes dead brown layer blocking new green growth.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "Daily 70s",
    products: ["b-mclane-reel"],
    warnings:
      "Very hard on equipment. Can scalp gradually over 4-6 weeks.",
  },
  {
    id: "bst-earlyspring-pe1",
    season: "early_spring",
    task_name: "First Pre-Emergent (Granular)",
    task_description:
      "First application of split PE program. Apply BEFORE soil temps hit 51-53°F consistently. Long-lasting granular PE. Apply while soil is dry, water in immediately.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: 51,
    air_temp_trigger: null,
    products: ["b-granular-pe"],
    warnings: "Be a little early rather than late. Do NOT use on new sod.",
  },
  {
    id: "bst-earlyspring-pe2",
    season: "early_spring",
    task_name: "Second Pre-Emergent (Liquid)",
    task_description:
      "Apply JUST AFTER soil temps hit 51-53°F. Has post-emergent properties on crabgrass. Catches surface seeds disturbed by spring scalping.",
    grass_category: "warm_season",
    priority: 3,
    soil_temp_trigger: 53,
    air_temp_trigger: null,
    products: ["b-liquid-pe"],
    warnings: null,
  },

  // ============================================
  // SPRING (Temps in 80s)
  // ============================================
  {
    id: "bst-spring-pgf",
    season: "spring",
    task_name: "First PGF Complete Application",
    task_description:
      "Begin PGF Complete 16-4-8 when temps hit 80s. Apply every 3-6 weeks during growing season.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "80s",
    products: ["b-pgf-complete"],
    warnings: null,
  },
  {
    id: "bst-spring-superjuice",
    season: "spring",
    task_name: "Begin Super Juice Program",
    task_description:
      "Start applying Super Juice spray supplement every 2-3 weeks during growing season.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: "80s",
    products: ["b-super-juice"],
    warnings: null,
  },
  {
    id: "bst-spring-fungicide",
    season: "spring",
    task_name: "Preventative Fungicide",
    task_description:
      "Apply PRO DG Fungicide when temps reach 80s. DG particles provide superior coverage.",
    grass_category: "warm_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: "80s",
    products: ["b-pro-dg-fungicide"],
    warnings: null,
  },
  {
    id: "bst-spring-aeration",
    season: "spring",
    task_name: "Aeration",
    task_description:
      "Core-pulling aeration during active growing season. Follow with heavy HUMICHAR application into holes.",
    grass_category: "warm_season",
    priority: 4,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-humichar"],
    warnings: "Use CORE PULLING aerator only, NOT spike units.",
  },
  {
    id: "bst-spring-mowing",
    season: "spring",
    task_name: "Begin Regular Mowing Schedule",
    task_description:
      "Maintain 3/4\" to 1.5\" height. Mow every 2-3 days at peak season. Rotate cutting patterns.",
    grass_category: "warm_season",
    priority: 5,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-mclane-reel"],
    warnings: null,
  },

  // ============================================
  // SUMMER (Temps 85-95°F)
  // ============================================
  {
    id: "bst-summer-pgf",
    season: "summer",
    task_name: "Continue PGF Complete",
    task_description:
      "Continue PGF Complete every 3-6 weeks. Bermuda loves 85-90°F heat.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "85-95°F",
    products: ["b-pgf-complete"],
    warnings: null,
  },
  {
    id: "bst-summer-superjuice",
    season: "summer",
    task_name: "Continue Super Juice",
    task_description: "Continue Super Juice spray every 2-3 weeks.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-super-juice"],
    warnings: null,
  },
  {
    id: "bst-summer-humichar",
    season: "summer",
    task_name: "HUMICHAR Application",
    task_description: "Apply HUMICHAR as desired for ongoing soil improvement.",
    grass_category: "warm_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-humichar"],
    warnings: null,
  },
  {
    id: "bst-summer-grubs",
    season: "summer",
    task_name: "Grub Treatment",
    task_description:
      "Apply Dou-Kill at heavy rate, water heavily. At least 1 treatment per year.",
    grass_category: "warm_season",
    priority: 4,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-dou-kill"],
    warnings: null,
  },
  {
    id: "bst-summer-watering",
    season: "summer",
    task_name: "Monitor Watering",
    task_description:
      "1 inch per week. If 3+ weeks no rain + 90°F: switch to drought protocol (light waterings morning + late afternoon, 6-9 min per zone).",
    grass_category: "warm_season",
    priority: 5,
    soil_temp_trigger: null,
    air_temp_trigger: "90°F+",
    products: [],
    warnings: "Water is the #1 expense — can exceed $200/month during drought.",
  },
  {
    id: "bst-summer-greenshocker",
    season: "summer",
    task_name: "GreenShocker for Quick Green-Up",
    task_description:
      "Optional fast-release supplement for quick green results (3 days). Mild enough for summer.",
    grass_category: "warm_season",
    priority: 6,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-greenshocker"],
    warnings: null,
  },

  // ============================================
  // LATE SUMMER (Aug-Sept)
  // ============================================
  {
    id: "bst-latesummer-armyworms",
    season: "late_summer",
    task_name: "Watch for Army Worms",
    task_description:
      "Typical battle: August-September. Army worms eat grass blades (visual damage). May require 2 treatments due to egg hatch cycle. Detect early.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-dou-kill"],
    warnings: null,
  },
  {
    id: "bst-latesummer-grubs",
    season: "late_summer",
    task_name: "Fall Grub Treatment",
    task_description:
      "Second grub treatment of the year. Apply Dou-Kill at heavy rate, water heavily.",
    grass_category: "warm_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["b-dou-kill"],
    warnings: null,
  },

  // ============================================
  // FALL (Growth slows)
  // ============================================
  {
    id: "bst-fall-stopgranular",
    season: "fall",
    task_name: "Stop Granular Feedings",
    task_description:
      "Stop all granular fertilizers. Switch to Super Juice only until first frost.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "Declining temps",
    products: ["b-super-juice"],
    warnings: null,
  },

  // ============================================
  // LATE FALL (~Nov 15 in GA)
  // ============================================
  {
    id: "bst-latefall-pe",
    season: "late_fall",
    task_name: "Fall Pre-Emergent",
    task_description:
      "Apply when first cold weather hits. Prevents winter weeds (Poa annua). Will NOT prevent spring weeds.",
    grass_category: "warm_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "First cold weather",
    products: ["b-fall-pe"],
    warnings: "Not critical unless heavy winter weeds previous year.",
  },
];

export function getBermudaTasksBySeason(season: string): SeasonalTask[] {
  return BERMUDA_SEASONAL_TASKS.filter((t) => t.season === season).sort(
    (a, b) => a.priority - b.priority
  );
}
