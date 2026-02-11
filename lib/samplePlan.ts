export interface PlanMonth {
  name: string;
  weeks: {
    label: string;
    tasks: string[];
  }[];
}

export function getSamplePlan(
  grassType: string,
  lawnSize: string,
  lawnGoal: string,
  path: string,
): PlanMonth[] {
  const now = new Date();
  const m1 = now.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const m2 = new Date(now.getFullYear(), now.getMonth() + 1).toLocaleString("en-US", { month: "long" }).toUpperCase();
  const m3 = new Date(now.getFullYear(), now.getMonth() + 2).toLocaleString("en-US", { month: "long" }).toUpperCase();

  const isWarm = ["bermuda", "zoysia", "st_augustine"].includes(grassType);
  const grassName: Record<string, string> = {
    bermuda: "Bermuda", zoysia: "Zoysia", fescue_kbg: "Fescue/KBG",
    st_augustine: "St. Augustine", not_sure: "your lawn",
  };
  const gn = grassName[grassType] || "your lawn";

  const mowHeights: Record<string, string> = {
    bermuda: '1-1.5"', zoysia: '1.5-2"', fescue_kbg: '3-3.5"',
    st_augustine: '2.5-3"', not_sure: '2.5-3"',
  };
  const mowHeight = mowHeights[grassType] || '2.5-3"';

  const sizeMultiplier = lawnSize === "large" ? "10,000+" : lawnSize === "small" ? "2,500" : "5,000";

  if (path === "expert") {
    return [
      {
        name: m1,
        weeks: [
          {
            label: "Week 1",
            tasks: [
              `Soil temperature check — ${isWarm ? "wait for consistent 55°F+ at 4\" depth before any pre-emergent" : "monitor for thaw, prepare equipment"}`,
              `Mower maintenance: sharpen blades, change oil, check air filter`,
              `Apply pre-emergent: Barricade (prodiamine 0.48%) at 1.5 oz/1,000 sq ft — covers ~${sizeMultiplier} sq ft per app`,
              `Begin mowing ${gn} at ${mowHeight} — never remove more than 1/3 of blade height`,
            ],
          },
          {
            label: "Week 2",
            tasks: [
              `Irrigation audit: run each zone for 15 min, place catch cups to measure output — target 1" per week total`,
              `Spot-spray any winter weeds with Celsius WG (0.085 oz/1,000 sq ft) + MSO surfactant`,
              lawnGoal === "fix" ? "Identify bare/thin areas and mark for overseeding or plugging in Week 5-6" : `Scout for early crabgrass or poa annua emergence along driveways and sidewalks`,
            ],
          },
          {
            label: "Week 3",
            tasks: [
              `First fertilizer application: The Andersons PGF Complete 16-4-8 at 3.6 lbs/1,000 sq ft (0.5 lb N/1,000)`,
              `Water in fertilizer within 24 hours — run irrigation for 20 min per zone`,
              `Mow at ${mowHeight} — bag clippings this cut if applying granular products`,
            ],
          },
          {
            label: "Week 4",
            tasks: [
              `Regular mow at ${mowHeight} — mulch clippings to return nitrogen to soil`,
              `Deep watering: 2 sessions of 0.5" rather than daily light watering`,
              lawnGoal === "perfect" ? "Apply Humic DG at 4 lbs/1,000 sq ft for soil health and nutrient uptake" : "Monitor for signs of disease — yellowing, circular patches, or webbing in morning dew",
            ],
          },
        ],
      },
      {
        name: m2,
        weeks: [
          {
            label: "Week 5",
            tasks: [
              `Mow at ${mowHeight} — increase frequency to every 5 days as growth accelerates`,
              lawnGoal === "fix" ? `Overseed bare spots: apply ${isWarm ? gn : "Fescue/KBG blend"} seed at recommended rate, topdress with 1/4" compost` : `Edge all bed lines and hardscape borders — clean cuts prevent weed encroachment`,
              `Adjust irrigation: increase to 1.25" per week as temps rise`,
            ],
          },
          {
            label: "Week 6",
            tasks: [
              `Second fertilizer application: Milorganite 6-4-0 at 8 lbs/1,000 sq ft (slow-release, won't burn)`,
              `Scout for grubs: pull back turf in suspect areas — more than 10 per sq ft = treat`,
              `Mow and edge — maintain ${mowHeight} height consistently`,
            ],
          },
          {
            label: "Week 7",
            tasks: [
              isWarm
                ? `Apply iron supplement: Ironite 1-0-1 at 1 lb/1,000 sq ft for deep green color without excess growth`
                : `Apply micronutrient package if yellowing despite fertilizer — often iron chlorosis in alkaline soils`,
              lawnGoal === "perfect" ? "Apply Kelp4Less liquid kelp foliar spray at 2 oz/gallon — reduces heat stress" : "Monitor and adjust watering based on rainfall — skip irrigation if 0.5\"+ rain in forecast",
              `Mow at ${mowHeight} — consider lowering 0.25" if ${gn} is thick and healthy`,
            ],
          },
          {
            label: "Week 8",
            tasks: [
              `Regular mow and edge cycle`,
              `Fungus prevention: if humidity is high and nighttime temps stay above 65°F, apply Scotts DiseaseEx at 2.75 lbs/1,000 sq ft`,
              `Deep water 2x/week — early morning (before 9am) to reduce disease pressure`,
            ],
          },
        ],
      },
      {
        name: m3,
        weeks: [
          {
            label: "Week 9",
            tasks: [
              `Third fertilizer application: The Andersons PGF Complete 16-4-8 at 3.6 lbs/1,000 sq ft`,
              `Mow at ${mowHeight} — sharpen blades again (every 20-25 hours of mowing)`,
              `Check soil moisture at 3" depth — should be moist but not saturated`,
            ],
          },
          {
            label: "Week 10",
            tasks: [
              lawnGoal === "fix" ? "Spot-treat persistent weeds with targeted post-emergent — avoid broadcast application in heat" : `Aerate if soil is compacted: core aerate when ${gn} is actively growing for fastest recovery`,
              `Mow and mulch clippings — mulching returns ~25% of nitrogen needs`,
              `Increase water to 1.5" per week if temps exceed 90°F consistently`,
            ],
          },
          {
            label: "Week 11",
            tasks: [
              lawnGoal === "perfect" ? `Apply potassium supplement: 0-0-50 muriate of potash at 2 lbs/1,000 sq ft for heat/drought tolerance` : `Continue regular mow/water cycle — consistency is more important than perfection`,
              `Scout for armyworms and chinch bugs — treat with Bifen I/T if detected`,
              `Photograph lawn progress — compare to initial photos for motivation`,
            ],
          },
          {
            label: "Week 12",
            tasks: [
              `90-day checkpoint: assess overall lawn health and density`,
              `Plan next quarter: ${lawnGoal === "fix" ? "schedule second pre-emergent split app" : lawnGoal === "perfect" ? "consider topdressing with sand for leveling" : "maintain current program — it's working"}`,
              `Light fertilizer: Milorganite 6-4-0 at 8 lbs/1,000 sq ft to carry through to next phase`,
              `Celebrate your progress — your ${gn} lawn is on track`,
            ],
          },
        ],
      },
    ];
  }

  // Novice path
  return [
    {
      name: m1,
      weeks: [
        {
          label: "Week 1",
          tasks: [
            `Mow your ${gn} lawn at ${mowHeight} — this is the ideal height for your grass type`,
            `Apply a pre-emergent weed preventer to stop crabgrass and other weeds before they start`,
            `Check your mower blade — a sharp blade cuts clean, a dull blade tears and browns the tips`,
          ],
        },
        {
          label: "Week 2",
          tasks: [
            `Water deeply 2x this week — aim for about 1" of water total (use a tuna can to measure)`,
            `Walk your lawn and pull any visible weeds by hand — get the root!`,
            lawnGoal === "fix" ? "Take photos of problem areas (bare spots, brown patches) to track improvement" : "Edge along sidewalks and driveways for a clean, sharp look",
          ],
        },
        {
          label: "Week 3",
          tasks: [
            `Apply your first fertilizer: Scotts Turf Builder Lawn Food — follow the bag rate for ~${sizeMultiplier} sq ft`,
            `Water your lawn after fertilizing to help it absorb — run sprinklers for about 20 minutes`,
            `Mow again at ${mowHeight} — try to mow at least once a week from now on`,
          ],
        },
        {
          label: "Week 4",
          tasks: [
            `Regular mowing at ${mowHeight} — leave the clippings on the lawn (they feed the soil)`,
            `Water 2x this week if it hasn't rained — early morning is best (before 10am)`,
            `Look for any yellowing or brown circles — these could be early signs of fungus`,
          ],
        },
      ],
    },
    {
      name: m2,
      weeks: [
        {
          label: "Week 5",
          tasks: [
            `Mow at ${mowHeight} — you may need to mow every 5 days now as growth picks up`,
            lawnGoal === "fix" ? `Seed any bare spots: sprinkle grass seed, cover with thin layer of soil, and keep moist for 2 weeks` : `Clean up bed edges with a half-moon edger or flat shovel`,
            `Adjust your watering: your lawn needs about 1-1.25" per week now`,
          ],
        },
        {
          label: "Week 6",
          tasks: [
            `Apply Milorganite fertilizer (the green bag) — it's gentle and won't burn your lawn`,
            `Keep mowing at ${mowHeight} — consistency is key`,
            `Check your sprinkler coverage — dry spots usually mean a sprinkler head needs adjusting`,
          ],
        },
        {
          label: "Week 7",
          tasks: [
            isWarm
              ? `Your ${gn} should be greening up nicely — if it's pale, apply an iron supplement like Ironite`
              : `If your lawn looks yellowish despite fertilizing, it may need iron — pick up Ironite at any garden center`,
            `Water deep, not often: 2 good soakings beat 5 light sprinkles`,
            `Mow regularly — a well-mowed lawn crowds out weeds naturally`,
          ],
        },
        {
          label: "Week 8",
          tasks: [
            `Continue your mow-and-water routine — you're building great habits`,
            `If you see brown circular patches, apply a fungicide like Scotts DiseaseEx — it's easy to spread`,
            lawnGoal === "perfect" ? "Consider applying a humic acid product to improve your soil — healthier soil = healthier grass" : "Take a progress photo and compare to Week 1 — you'll be surprised!",
          ],
        },
      ],
    },
    {
      name: m3,
      weeks: [
        {
          label: "Week 9",
          tasks: [
            `Apply fertilizer again: Scotts Turf Builder or Milorganite — alternate between them for best results`,
            `Sharpen your mower blade (or replace it) — blades get dull after a month of regular mowing`,
            `Mow at ${mowHeight} — stick with what's working`,
          ],
        },
        {
          label: "Week 10",
          tasks: [
            lawnGoal === "fix" ? "Spot-treat any remaining weeds — pull by hand or use a targeted weed spray (not the whole lawn)" : "If your soil feels hard when you push a screwdriver in, consider renting an aerator",
            `Keep watering 2x per week — increase to 1.5" per week if it's really hot`,
            `Mow and enjoy — your lawn is looking noticeably better`,
          ],
        },
        {
          label: "Week 11",
          tasks: [
            `Regular mow and water — you've got the routine down`,
            `Watch for small moths flying up when you walk the lawn — that's a sign of sod webworms, treat if you see them`,
            lawnGoal === "perfect" ? `Your ${gn} is probably the best-looking lawn on the street by now — keep it going` : `Look ahead: what do you want to tackle next quarter?`,
          ],
        },
        {
          label: "Week 12",
          tasks: [
            `Congratulations — you've completed your 90-day plan!`,
            `Apply one more round of Milorganite to carry your lawn into the next season`,
            `Compare your lawn today vs. Day 1 — that's real progress`,
            lawnGoal === "fix" ? "Your problem areas should be filled in or significantly improved" : lawnGoal === "perfect" ? "You've built a championship-level lawn care routine" : "You've built a solid routine — your lawn thanks you",
          ],
        },
      ],
    },
  ];
}
