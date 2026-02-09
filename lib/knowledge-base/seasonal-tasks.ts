import { SeasonalTask } from "@/types";

export const SEASONAL_TASKS: SeasonalTask[] = [
  // ============================================
  // WINTER (Lawn Dormant)
  // ============================================
  {
    id: "cs-winter-ph",
    season: "winter",
    task_name: "pH Adjustment (Lime)",
    task_description:
      "Heavy lime applications if soil test shows low pH. Apply when no snow on ground. 50-100 lbs per 1,000 sqft to raise pH one point.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["lime"],
    warnings: null,
  },
  {
    id: "cs-winter-carbon",
    season: "winter",
    task_name: "Apply HumiChar (Carbon/Biochar)",
    task_description:
      "Apply HumiChar pelletized biochar + humic acid. Carbon takes a long time to work into soil depths; starting now means deeper penetration by spring.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["humichar"],
    warnings: null,
  },

  // ============================================
  // LATE WINTER / VERY EARLY SPRING
  // ============================================
  {
    id: "cs-late-winter-pre-emergent",
    season: "late_winter",
    task_name: "Apply Pre-Emergent (Step 1)",
    task_description:
      "Apply granular DG pre-emergent to established lawns. Better to apply 2 weeks BEFORE target date. Use GreenCast soil temp map to time application.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: 51,
    air_temp_trigger: null,
    products: ["dg-pre-emergent"],
    warnings: "Do NOT apply if you plan to seed.",
  },
  {
    id: "cs-late-winter-jump-start",
    season: "late_winter",
    task_name: "Jump Start Program",
    task_description:
      "Apply PGF Balance 10-10-10 at the same time as pre-emergent. Soil is a post-winter wasteland — nutrients leeched, microbes gone. Inject mild nutrients for grass wake-up WITHOUT heavy nitrogen.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: 51,
    air_temp_trigger: null,
    products: ["pgf-balance-10-10-10"],
    warnings: null,
  },
  {
    id: "cs-late-winter-cleanup",
    season: "late_winter",
    task_name: "Yard Cleanup",
    task_description: "Remove dead leaves and yard waste from the lawn.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },

  // ============================================
  // EARLY SPRING
  // ============================================
  {
    id: "cs-early-spring-mow",
    season: "early_spring",
    task_name: "First Mow — Cut Low",
    task_description:
      "Cut dead grass LOW. Bag it and remove from lawn to clear out dead material and expose soil to sunlight.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-early-spring-dethatch",
    season: "early_spring",
    task_name: "Light Dethatch",
    task_description:
      "Light dethatch if heavy thatch layer exists. Use a spring tine dethatcher to pull up dead grass, then rake it up.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-early-spring-fertilize",
    season: "early_spring",
    task_name: "Base Fertilizer Application",
    task_description:
      "When green haze covers entire lawn, apply PGF Complete 16-4-8. This is the primary base fertilizer — mild, slow release with iron, micronutrients, and Humic DG.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["pgf-complete-16-4-8"],
    warnings: null,
  },

  // ============================================
  // SPRING
  // ============================================
  {
    id: "cs-spring-overseed",
    season: "spring",
    task_name: "Overseeding (Optional)",
    task_description:
      "Can be done in spring but understand new seed needs more irrigation before summer heat. Fall is the primary seeding window.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings:
      "New seed needs significant irrigation to survive summer. Fall seeding preferred.",
  },
  {
    id: "cs-spring-grub-killer",
    season: "spring",
    task_name: "Grub Killer Application",
    task_description:
      "Apply Duocide granules for grub control. Spread on lawn and water in. Also effective for ants, fleas, and ticks.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["duocide"],
    warnings: null,
  },
  {
    id: "cs-spring-fungicide",
    season: "spring",
    task_name: "Fungicide Application",
    task_description:
      "Apply granular fungicide (Prophesy) as weather warms for preventative or curative treatment.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: "above 80\u00B0F",
    products: ["prophesy-fungicide"],
    warnings: null,
  },
  {
    id: "cs-spring-aeration",
    season: "spring",
    task_name: "Aeration",
    task_description:
      "Can begin once grass is growing and healthy. Use core-pulling aerator. Cut lawn fairly short first — hard to pick up plugs otherwise.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-spring-leveling",
    season: "spring",
    task_name: "Leveling",
    task_description:
      "Can begin once grass is growing and healthy. Cut grass as short as possible first — you are leveling the GROUND, not the grass.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings:
      "Long grass + leveling mix = clumps and mess. Must cut short first.",
  },
  {
    id: "cs-spring-organic-matter",
    season: "spring",
    task_name: "Apply Organic Matter (Dirt Booster)",
    task_description:
      "Apply Dirt Booster when daytime temps reach high 70s+. Spread with a spreader, then spray with microbe/fungus booster pack.",
    grass_category: "cool_season",
    priority: 3,
    soil_temp_trigger: 65,
    air_temp_trigger: "above 80\u00B0F",
    products: ["dirt-booster"],
    warnings: null,
  },

  // ============================================
  // SUMMER
  // ============================================
  {
    id: "cs-summer-disease-watch",
    season: "summer",
    task_name: "Disease Monitoring",
    task_description:
      "Monitor lawn for fungal disease (brown patch, dollar spot). Treat with sprays if active problems arise. Read and follow labels.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["prophesy-fungicide"],
    warnings: null,
  },
  {
    id: "cs-summer-spoon-feed",
    season: "summer",
    task_name: "Spoon Feed Only (Light Supplements)",
    task_description:
      "NO strong slow-release fertilizer. Switch to light supplemental feedings with Green Shocker or Super Juice. Apply just before rain events. Avoid during long droughts.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["green-shocker", "super-juice"],
    warnings:
      "Do NOT apply strong slow-release fertilizer. Only light supplements before rain. Never during drought.",
  },
  {
    id: "cs-summer-raise-mow",
    season: "summer",
    task_name: "Raise Mowing Height",
    task_description:
      "Raise mowing height 0.5-1 inch taller than spring cut. Taller grass shades soil and retains moisture.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-summer-watering",
    season: "summer",
    task_name: "Adequate Watering",
    task_description:
      "Don't let lawn totally dry out for extended periods or it may go summer dormant. 1 inch of water per week, deep and infrequent.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },

  // ============================================
  // LATE SUMMER / EARLY FALL
  // ============================================
  {
    id: "cs-late-summer-armyworms",
    season: "late_summer",
    task_name: "Armyworm Watch & Treatment",
    task_description:
      "Watch for armyworms (surface-feeding pests). Signs: thinned-out appearance, moth activity. Treat with Duocide or hose-end pest spray.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["duocide"],
    warnings: null,
  },
  {
    id: "cs-late-summer-grubs",
    season: "late_summer",
    task_name: "Second Grub Treatment",
    task_description:
      "Apply Duocide for second grub treatment of the season. Spread and water in deeply.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["duocide"],
    warnings: null,
  },
  {
    id: "cs-late-summer-resume-fertilizer",
    season: "late_summer",
    task_name: "Resume Slow-Release Fertilizer",
    task_description:
      "Switch back to slow-release PGF Complete 16-4-8 when temps drop into high 70s. Continue Green Shocker until temps fall.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: "high 70s",
    products: ["pgf-complete-16-4-8", "green-shocker"],
    warnings: null,
  },
  {
    id: "cs-late-summer-lower-mow",
    season: "late_summer",
    task_name: "Return Mowing Height to Normal",
    task_description:
      "Lower mowing height back to standard spring cutting height as temperatures moderate.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-late-summer-aeration",
    season: "late_summer",
    task_name: "Primary Aeration Window",
    task_description:
      "Late summer through early fall is the primary time for aeration. Relieves soil compaction, allows water and oxygen deep into soil.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: null,
  },
  {
    id: "cs-late-summer-seeding",
    season: "late_summer",
    task_name: "Primary Seeding/Overseeding Window",
    task_description:
      "Fall is the primary seeding window for cool season grasses. Roots develop before summer heat. Plant seed 1/8 to 1/2 inch deep, scarify after spreading.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: [],
    warnings: "Do NOT apply pre-emergent if you plan to seed.",
  },

  // ============================================
  // FALL INTO LATE FALL
  // ============================================
  {
    id: "cs-fall-fertilizer",
    season: "fall",
    task_name: "Continue Slow-Release Fertilizer",
    task_description:
      "Slow release should hold from late summer application. Optional fast-release like Green Shocker for additional boost.",
    grass_category: "cool_season",
    priority: 2,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["pgf-complete-16-4-8", "green-shocker"],
    warnings: null,
  },
  {
    id: "cs-late-fall-final-feeding",
    season: "late_fall",
    task_name: "Final Feeding",
    task_description:
      "Apply a light coat of PGF Balance 10-10-10 as cold approaches. This is the last treatment of the season.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["pgf-balance-10-10-10"],
    warnings: null,
  },
  {
    id: "cs-late-fall-winter-pe",
    season: "late_fall",
    task_name: "Winter Pre-Emergent",
    task_description:
      "Apply pre-emergent when temps really drop and growth totally stops. Prevents winter weeds like poa annua.",
    grass_category: "cool_season",
    priority: 1,
    soil_temp_trigger: null,
    air_temp_trigger: null,
    products: ["dg-pre-emergent"],
    warnings: null,
  },
];

export function getTasksBySeason(season: SeasonalTask["season"]): SeasonalTask[] {
  return SEASONAL_TASKS.filter((t) => t.season === season).sort(
    (a, b) => a.priority - b.priority
  );
}

export function getTasksByGrassCategory(
  category: SeasonalTask["grass_category"]
): SeasonalTask[] {
  return SEASONAL_TASKS.filter(
    (t) => t.grass_category === category || t.grass_category === "both"
  );
}

export function getCoolSeasonTasks(): SeasonalTask[] {
  return getTasksByGrassCategory("cool_season");
}

export function getCoolSeasonTasksBySeason(
  season: SeasonalTask["season"]
): SeasonalTask[] {
  return SEASONAL_TASKS.filter(
    (t) =>
      t.season === season &&
      (t.grass_category === "cool_season" || t.grass_category === "both")
  ).sort((a, b) => a.priority - b.priority);
}
