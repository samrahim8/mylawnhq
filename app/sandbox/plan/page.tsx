"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PlanMonth {
  name: string;
  weeks: {
    label: string;
    tasks: string[];
  }[];
}

const loadingSteps = [
  "Analyzing your climate zone",
  "Checking soil temperature data",
  "Building fertilizer schedule",
  "Generating weekly tasks",
];

/* ─── Sample Plans ─── */

function getSamplePlan(
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
  const grassName = {
    bermuda: "Bermuda", zoysia: "Zoysia", fescue_kbg: "Fescue/KBG",
    st_augustine: "St. Augustine", not_sure: "your lawn",
  }[grassType] || "your lawn";

  const mowHeight = {
    bermuda: '1-1.5"', zoysia: '1.5-2"', fescue_kbg: '3-3.5"',
    st_augustine: '2.5-3"', not_sure: '2.5-3"',
  }[grassType] || '2.5-3"';

  const sizeMultiplier = lawnSize === "large" ? "10,000+" : lawnSize === "small" ? "2,500" : "5,000";

  // Expert path: more specific products, application rates, technical detail
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
              `Begin mowing ${grassName} at ${mowHeight} — never remove more than 1/3 of blade height`,
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
              lawnGoal === "fix" ? `Overseed bare spots: apply ${isWarm ? grassName : "Fescue/KBG blend"} seed at recommended rate, topdress with 1/4" compost` : `Edge all bed lines and hardscape borders — clean cuts prevent weed encroachment`,
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
              `Mow at ${mowHeight} — consider lowering 0.25" if ${grassName} is thick and healthy`,
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
              lawnGoal === "fix" ? "Spot-treat persistent weeds with targeted post-emergent — avoid broadcast application in heat" : `Aerate if soil is compacted: core aerate when ${grassName} is actively growing for fastest recovery`,
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
              `Celebrate your progress — your ${grassName} lawn is on track`,
            ],
          },
        ],
      },
    ];
  }

  // Novice path: friendlier language, fewer products, more guidance
  return [
    {
      name: m1,
      weeks: [
        {
          label: "Week 1",
          tasks: [
            `Mow your ${grassName} lawn at ${mowHeight} — this is the ideal height for your grass type`,
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
              ? `Your ${grassName} should be greening up nicely — if it's pale, apply an iron supplement like Ironite`
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
            lawnGoal === "perfect" ? `Your ${grassName} is probably the best-looking lawn on the street by now — keep it going` : `Look ahead: what do you want to tackle next quarter?`,
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

/* ─── Plan Flow Component ─── */

function PlanFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const zip = searchParams.get("zip") || "";
  const grassType = searchParams.get("grassType") || "";
  const lawnSize = searchParams.get("lawnSize") || "";
  const sunExposure = searchParams.get("sunExposure") || "";
  const lawnGoal = searchParams.get("lawnGoal") || "";
  const path = searchParams.get("path") || "novice";

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [plan, setPlan] = useState<PlanMonth[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [rawPlanText, setRawPlanText] = useState("");
  const hasFetched = useRef(false);

  const parsePlan = useCallback((text: string): PlanMonth[] => {
    const months: PlanMonth[] = [];
    let currentMonth: PlanMonth | null = null;
    let currentWeek: { label: string; tasks: string[] } | null = null;

    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();

      const monthMatch = trimmed.match(
        /^(?:#{1,3}\s*)?(?:\*{1,2})?(?:Month\s*\d+:\s*)?([A-Z][A-Za-z]+)(?:\*{1,2})?$/
      );
      if (
        monthMatch &&
        [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ].some((m) => trimmed.toUpperCase().includes(m.toUpperCase()))
      ) {
        if (currentMonth) {
          if (currentWeek) currentMonth.weeks.push(currentWeek);
          months.push(currentMonth);
        }
        currentMonth = { name: monthMatch[1].toUpperCase(), weeks: [] };
        currentWeek = null;
        continue;
      }

      const weekMatch = trimmed.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?\s*Week\s*(\d+)(?:\s*[\(:].+?)?(?:\*{1,2})?:?\s*$/i)
        || trimmed.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?\s*Week\s*(\d+)\s*[\(:](.+?)[\):]?\s*(?:\*{1,2})?$/i);
      if (weekMatch) {
        if (currentWeek && currentMonth) {
          currentMonth.weeks.push(currentWeek);
        }
        const weekNum = weekMatch[1];
        const dateRange = weekMatch[2] ? weekMatch[2].trim().replace(/[()]/g, "") : "";
        currentWeek = {
          label: `Week ${weekNum}${dateRange ? ` (${dateRange})` : ""}`,
          tasks: [],
        };
        continue;
      }

      const taskMatch = trimmed.match(/^(?:[-*]|\[.\]|☐|•)\s+(.+)$/);
      if (taskMatch && currentWeek) {
        currentWeek.tasks.push(taskMatch[1]);
        continue;
      }

      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch && currentWeek) {
        currentWeek.tasks.push(numberedMatch[1]);
      }
    }

    if (currentWeek && currentMonth) currentMonth.weeks.push(currentWeek);
    if (currentMonth) months.push(currentMonth);

    return months;
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 600);

    const goalLabels: Record<string, string> = {
      fix: "Fix major issues (weeds, bare spots)",
      maintain: "Maintain a healthy lawn",
      perfect: "Achieve the best lawn possible",
      not_sure: "General lawn improvement",
    };

    const grassLabels: Record<string, string> = {
      bermuda: "Bermuda",
      zoysia: "Zoysia",
      fescue_kbg: "Fescue/KBG",
      st_augustine: "St. Augustine",
      not_sure: "Unknown (recommend based on climate zone)",
    };

    const sizeLabels: Record<string, string> = {
      small: "Small (under 2,500 sq ft)",
      medium: "Medium (2,500-10,000 sq ft)",
      large: "Large (over 10,000 sq ft)",
    };

    const userPrompt = `Generate a 90-day lawn care plan for this homeowner:

- Zip Code: ${zip}
- Grass Type: ${grassLabels[grassType] || grassType}
- Lawn Size: ${sizeLabels[lawnSize] || lawnSize}
- Sun Exposure: ${sunExposure}
- Goal: ${goalLabels[lawnGoal] || lawnGoal}
- Current Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Format the plan as:
## MONTH_NAME
### Week N (date range)
- Task description
- Task description

Cover 3 months. Include specific products when recommending fertilizers or treatments. Include mowing heights, watering guidance, and seasonal timing.`;

    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: userPrompt }],
            profile: {
              zipCode: zip,
              grassType,
              lawnSize,
              sunExposure,
            },
          }),
        });

        const data = await response.json();

        if (!data.error) {
          const parsed = parsePlan(data.content);
          if (parsed.length > 0 && parsed[0].weeks.length > 0) {
            // API returned a parseable plan — use it
            setRawPlanText(data.content);
            setPlan(parsed);
            return;
          }
        }
      } catch {
        // Fall through to sample plan
      }

      // Fallback: use sample plan
      setPlan(getSamplePlan(grassType, lawnSize, lawnGoal, path));
    };

    fetchPlan().finally(() => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingStepIdx(loadingSteps.length);
      setTimeout(() => setLoading(false), 500);
    });

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [zip, grassType, lawnSize, sunExposure, lawnGoal, path, parsePlan]);

  const toggleMonth = (idx: number) => {
    setExpandedMonths((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-6">&#127793;</div>
          <h2 className="font-display text-xl font-bold text-deep-brown mb-6">
            Building your 90-day plan...
          </h2>

          <div className="w-full bg-deep-brown/10 rounded-full h-2 mb-8">
            <div
              className="h-2 bg-lawn rounded-full transition-all duration-500"
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            />
          </div>

          <div className="text-left space-y-3">
            {loadingSteps.map((stepText, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {i < loadingStepIdx ? (
                  <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === loadingStepIdx ? (
                  <div className="w-4 h-4 rounded-full border-2 border-lawn border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-deep-brown/20 flex-shrink-0" />
                )}
                <span className={i <= loadingStepIdx ? "text-deep-brown" : "text-deep-brown/40"}>
                  {stepText}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const grassLabels: Record<string, string> = {
    bermuda: "Bermuda",
    zoysia: "Zoysia",
    fescue_kbg: "Fescue/KBG",
    st_augustine: "St. Augustine",
    not_sure: "Your lawn",
  };

  const goalLabels: Record<string, string> = {
    fix: "Fix It",
    maintain: "Maintain",
    perfect: "Perfect It",
    not_sure: "General Care",
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
            Your 90-Day Plan is Ready!
          </h1>
          <p className="mt-2 text-deep-brown/60">
            {grassLabels[grassType] || grassType} lawn in {zip} &middot; Goal:{" "}
            {goalLabels[lawnGoal] || lawnGoal}
          </p>
        </div>

        {/* Plan display */}
        {plan.length > 0 ? (
          <div className="space-y-4">
            {plan.map((month, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-deep-brown/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleMonth(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-display font-semibold text-deep-brown tracking-wide">
                    {month.name}
                  </span>
                  <span className="text-deep-brown/40 text-lg">
                    {expandedMonths[idx] ? "\u2212" : "+"}
                  </span>
                </button>
                {expandedMonths[idx] && (
                  <div className="px-5 pb-5 border-t border-deep-brown/5">
                    {month.weeks.map((week, widx) => (
                      <div key={widx} className="mt-4">
                        <h4 className="text-sm font-semibold text-deep-brown/70 mb-2">
                          {week.label}
                        </h4>
                        <ul className="space-y-2">
                          {week.tasks.map((task, tidx) => (
                            <li
                              key={tidx}
                              className="flex items-start gap-2.5 text-sm text-deep-brown/80"
                            >
                              <div className="w-4 h-4 mt-0.5 rounded border border-deep-brown/20 flex-shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-deep-brown/10 p-5">
            <div className="prose prose-sm max-w-none text-deep-brown/80 whitespace-pre-wrap">
              {rawPlanText}
            </div>
          </div>
        )}

        {/* Photo prompt - the sticky hook */}
        <div className="mt-10 border-t border-deep-brown/10 pt-8">
          <h3 className="font-display text-lg font-bold text-deep-brown">
            YOUR FIRST TASK
          </h3>
          <p className="mt-2 text-sm text-deep-brown/60 leading-relaxed">
            Snap a photo of your lawn right now. Our AI will spot problems you
            might not see&mdash;weeds, fungus, bare spots, nutrient
            deficiency&mdash;and add targeted fixes to your plan.
          </p>
          <p className="mt-1 text-xs text-deep-brown/40">
            Takes 10 seconds. Makes your plan 10x better.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <input type="file" accept="image/*" capture="environment" className="hidden" />
              <div className="bg-terracotta text-white font-semibold py-3 px-6 rounded-lg text-sm text-center hover:bg-terracotta/90 transition-colors">
                TAKE PHOTO
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" />
              <div className="border-2 border-deep-brown/15 text-deep-brown font-semibold py-3 px-6 rounded-lg text-sm text-center hover:border-deep-brown/30 transition-colors">
                UPLOAD
              </div>
            </label>
          </div>

          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              router.push(`/sandbox/save?${params.toString()}`);
            }}
            className="mt-4 w-full text-center text-sm text-deep-brown/50 hover:text-deep-brown transition-colors"
          >
            I&rsquo;ll do this later &rarr;
          </button>
        </div>

        {/* Save CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              router.push(`/sandbox/save?${params.toString()}`);
            }}
            className="bg-lawn text-white font-semibold py-3 px-8 rounded-lg hover:bg-lawn/90 transition-colors text-sm"
          >
            SAVE MY PLAN &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <PlanFlow />
    </Suspense>
  );
}
