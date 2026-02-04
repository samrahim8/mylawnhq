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
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const parsePlan = useCallback((text: string): PlanMonth[] => {
    const months: PlanMonth[] = [];
    let currentMonth: PlanMonth | null = null;
    let currentWeek: { label: string; tasks: string[] } | null = null;

    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();

      // Match month headers like "## FEBRUARY", "## Month 1: February", "**FEBRUARY**", "### FEBRUARY"
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

      // Match week headers like "**Week 1 (Feb 3-9)**", "### Week 1", "Week 1:"
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

      // Match task lines (bullets, checkboxes, dashes)
      const taskMatch = trimmed.match(/^(?:[-*]|\[.\]|☐|•)\s+(.+)$/);
      if (taskMatch && currentWeek) {
        currentWeek.tasks.push(taskMatch[1]);
        continue;
      }

      // Fallback: numbered tasks
      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch && currentWeek) {
        currentWeek.tasks.push(numberedMatch[1]);
      }
    }

    // Push remaining
    if (currentWeek && currentMonth) currentMonth.weeks.push(currentWeek);
    if (currentMonth) months.push(currentMonth);

    return months;
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 1500);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    // Build prompt
    const goalLabels: Record<string, string> = {
      fix: "Fix major issues (weeds, bare spots)",
      maintain: "Maintain a healthy lawn",
      perfect: "Achieve the best lawn possible",
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

        if (data.error) {
          setError(data.error);
        } else {
          setRawPlanText(data.content);
          const parsed = parsePlan(data.content);
          setPlan(parsed);
        }
      } catch {
        setError("Failed to generate plan. Please try again.");
      } finally {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setLoadingStepIdx(loadingSteps.length);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchPlan();

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [zip, grassType, lawnSize, sunExposure, lawnGoal, parsePlan]);

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

          {/* Progress bar */}
          <div className="w-full bg-deep-brown/10 rounded-full h-2 mb-8">
            <div
              className="h-2 bg-lawn rounded-full transition-all duration-500"
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            />
          </div>

          {/* Checklist */}
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="font-display text-xl font-bold text-deep-brown mb-4">
            Something went wrong
          </h2>
          <p className="text-deep-brown/60 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-terracotta text-white font-semibold py-3 px-8 rounded-lg hover:bg-terracotta/90 transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const grassLabels: Record<string, string> = {
    bermuda: "Bermuda",
    zoysia: "Zoysia",
    fescue_kbg: "Fescue/KBG",
    st_augustine: "St. Augustine",
    not_sure: "Unknown",
  };

  const goalLabels: Record<string, string> = {
    fix: "Fix It",
    maintain: "Maintain",
    perfect: "Perfect It",
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
          /* Fallback: raw text display */
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
