"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogoIcon, LogoWordmark } from "@/components/Logo";
import { getRegionInfo } from "@/lib/zip-climate";
import type { RegionInfo } from "@/lib/zip-climate";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type GrassKey = "bermuda" | "zoysia" | "st_augustine" | "cool_season" | "not_sure";
type FlowStep = 1 | 2 | 3;

interface OnboardingState {
  zip: string;
  grassType: GrassKey | null;
  grassLabel: string;
  email: string;
  region: RegionInfo | null;
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const GRASS_OPTIONS: {
  key: GrassKey;
  label: string;
  subtitle: string;
  colors: string;
}[] = [
  {
    key: "bermuda",
    label: "Bermuda",
    subtitle: "The tough stuff that loves the sun",
    colors: "from-[#3d7a2e] to-[#5a9e45]",
  },
  {
    key: "zoysia",
    label: "Zoysia",
    subtitle: "Thick, soft, barefoot-friendly",
    colors: "from-[#2d6b3a] to-[#4a8f5e]",
  },
  {
    key: "st_augustine",
    label: "St. Augustine",
    subtitle: "The big-blade Southern classic",
    colors: "from-[#3b7d4a] to-[#5ba36a]",
  },
  {
    key: "cool_season",
    label: "Cool Season",
    subtitle: "Fescue, Bluegrass, Rye — the northern mix",
    colors: "from-[#4a7a5e] to-[#6b9e7a]",
  },
  {
    key: "not_sure",
    label: "I'm not sure",
    subtitle: "No judgment — we'll figure it out",
    colors: "from-[#d4cfc7] to-[#c4bfb5]",
  },
];

const GRASS_LABELS: Record<string, string> = {
  bermuda: "Bermuda",
  zoysia: "Zoysia",
  st_augustine: "St. Augustine",
  cool_season: "Cool Season Mix",
  not_sure: "Your lawn",
};

/* ── Analytics helper ── */
function track(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.log(`[LawnHQ Analytics] ${event}`, data ?? {});
    // Future: send to analytics endpoint
  }
}

/* ═══════════════════════════════════════════
   Week-by-week task data (grass-specific)
   ═══════════════════════════════════════════ */

function getWeeklyTasks(grass: string, region: string) {
  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });

  const taskSets: Record<
    string,
    { thisWeek: { task: string; detail?: string }[]; nextWeek: { task: string; detail?: string }[]; week3: { task: string; detail?: string }[] }
  > = {
    bermuda: {
      thisWeek: [
        { task: `Mow at 1–1.5"`, detail: "Keep it low for density. Bermuda loves a tight cut." },
        { task: "Soil temp is 58°F — hold off on pre-emergent", detail: "Wait until soil hits 55°F consistently at 4\" depth." },
        { task: "Sharpen mower blades", detail: "Clean cuts prevent disease. Start the season right." },
      ],
      nextWeek: [
        { task: "Apply pre-emergent when soil hits 55°F", detail: "Barricade (prodiamine) at 1.5 oz / 1,000 sq ft" },
        { task: "Begin irrigation audit", detail: "Run each zone 15 min, measure output with catch cups" },
      ],
      week3: [
        { task: "First fertilizer application", detail: "PGF Complete 16-4-8 at 3.6 lbs / 1,000 sq ft" },
        { task: "Edge all bed lines and hardscape", detail: "Clean edges prevent weed creep" },
      ],
    },
    zoysia: {
      thisWeek: [
        { task: `Mow at 1.5–2"`, detail: "Zoysia thrives when kept neat but not scalped." },
        { task: "Soil temp check — waiting for 65°F", detail: "Zoysia wakes up later than Bermuda. Patience pays off." },
        { task: "Clear debris and dethatch lightly", detail: "Zoysia builds thatch fast — a light rake helps air flow." },
      ],
      nextWeek: [
        { task: "Apply pre-emergent at 65°F soil temp", detail: "Dimension (dithiopyr) works great for Zoysia" },
        { task: "Set irrigation to 1\" per week", detail: "Deep watering, not frequent light sprinkles" },
      ],
      week3: [
        { task: "First fertilizer — slow release N", detail: "Milorganite 6-4-0 at 8 lbs / 1,000 sq ft" },
        { task: "Scout for large patch fungus", detail: "Brown circles? Treat with azoxystrobin." },
      ],
    },
    st_augustine: {
      thisWeek: [
        { task: `Mow at 3–3.5"`, detail: "St. Augustine likes it tall. Higher cut = deeper roots." },
        { task: "Soil temp is 62°F — pre-emergent time", detail: "Apply within the next 7 days for best results." },
        { task: "Check for chinch bugs", detail: `${monthName} is when they start. Look for yellowing edges.` },
      ],
      nextWeek: [
        { task: "Apply pre-emergent + fertilizer combo", detail: "Scotts Southern Triple Action or similar" },
        { task: "Deep water 1–1.5\" per week", detail: "Morning watering reduces fungus risk" },
      ],
      week3: [
        { task: "Apply iron supplement for color", detail: "Ironite at 1 lb / 1,000 sq ft — deep green without excess growth" },
        { task: "Mow and bag clippings this cut", detail: "Bag when applying granular products" },
      ],
    },
    cool_season: {
      thisWeek: [
        { task: `Mow at 3–3.5"`, detail: "Taller grass shades out weeds and retains moisture." },
        { task: "Apply pre-emergent if soil is near 55°F", detail: "Timing is everything — don't miss the window." },
        { task: "Overseed any bare spots now", detail: "Cool season grasses germinate best in spring and fall." },
      ],
      nextWeek: [
        { task: "First spring fertilizer", detail: "Balanced 10-10-10 or starter fert for overseeded areas" },
        { task: "Begin regular mowing schedule", detail: "Every 5–7 days as growth picks up" },
      ],
      week3: [
        { task: "Spot-spray broadleaf weeds", detail: "2,4-D + triclopyr for dandelions and clover" },
        { task: "Aerate if soil is compacted", detail: "Core aeration opens up root zones" },
      ],
    },
  };

  const fallback = taskSets.bermuda;
  const tasks = taskSets[grass] || fallback;

  return {
    monthName,
    region,
    ...tasks,
  };
}

/* ═══════════════════════════════════════════
   Main Onboarding Flow
   ═══════════════════════════════════════════ */

function OnboardingFlow() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<FlowStep>(1);
  const [state, setState] = useState<OnboardingState>({
    zip: "",
    grassType: null,
    grassLabel: "",
    email: "",
    region: null,
  });
  const [showNotSure, setShowNotSure] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [animating, setAnimating] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [optInEmail, setOptInEmail] = useState(true);
  const [optInPush, setOptInPush] = useState(false);
  const [optInSaved, setOptInSaved] = useState(false);

  const upsellTriggerRef = useRef<HTMLDivElement>(null);

  /* ── Init from URL ── */
  useEffect(() => {
    const zip = searchParams.get("zip") || "";
    if (!zip) return;

    const region = getRegionInfo(zip);
    setState((prev) => ({ ...prev, zip, region }));
    track("onboarding_zip_submitted", { zip, region: region.region, zone: region.zone });
  }, [searchParams]);

  /* ── Save to localStorage ── */
  useEffect(() => {
    if (state.zip) {
      localStorage.setItem(
        "lawnhq_onboarding_v2",
        JSON.stringify({
          zip: state.zip,
          grassType: state.grassType,
          email: state.email,
        })
      );
    }
  }, [state]);

  /* ── Dashboard viewed event ── */
  useEffect(() => {
    if (step === 3) {
      track("onboarding_dashboard_viewed", {
        zip: state.zip,
        grassType: state.grassType,
      });
    }
  }, [step, state.zip, state.grassType]);

  /* ── Upsell scroll trigger ── */
  useEffect(() => {
    if (step !== 3) return;
    const el = upsellTriggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUpsellVisible(true);
          track("onboarding_upsell_shown");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  /* ── Step transitions ── */
  const goToStep = useCallback((next: FlowStep) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
      window.scrollTo(0, 0);
    }, 250);
  }, []);

  /* ── Grass selection ── */
  const selectGrass = useCallback(
    (key: GrassKey) => {
      if (key === "not_sure") {
        setShowNotSure(true);
        return;
      }
      const label = GRASS_LABELS[key] || "Your lawn";
      setState((prev) => ({ ...prev, grassType: key, grassLabel: label }));
      track("onboarding_grass_selected", { grassType: key, usedNotSure: false });
      goToStep(2);
    },
    [goToStep]
  );

  const acceptSuggestion = useCallback(() => {
    if (!state.region) return;
    const key = state.region.suggestedGrassKey as GrassKey;
    const label = state.region.suggestedGrass;
    setState((prev) => ({ ...prev, grassType: key, grassLabel: label }));
    track("onboarding_grass_selected", { grassType: key, usedNotSure: true, suggested: true });
    setShowNotSure(false);
    goToStep(2);
  }, [state.region, goToStep]);

  const defaultSuggestion = useCallback(() => {
    if (!state.region) return;
    const key = state.region.suggestedGrassKey as GrassKey;
    const label = state.region.suggestedGrass;
    setState((prev) => ({ ...prev, grassType: key, grassLabel: label }));
    track("onboarding_grass_selected", { grassType: key, usedNotSure: true, suggested: false, defaulted: true });
    setShowNotSure(false);
    goToStep(2);
  }, [state.region, goToStep]);

  /* ── Email submit ── */
  const submitEmail = useCallback(
    (email: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("Hmm, that doesn't look right. Mind double-checking?");
        return;
      }
      setEmailError("");
      setState((prev) => ({ ...prev, email }));

      // Map grass key for plan generator (cool_season → fescue_kbg)
      const planGrassType = state.grassType === "cool_season" ? "fescue_kbg" : (state.grassType || "not_sure");

      // Store plan params so the home page renders the full 90-day plan
      localStorage.setItem(
        "lawnhq_plan_params",
        JSON.stringify({
          zip: state.zip,
          grassType: planGrassType,
          lawnSize: "medium",
          sunExposure: "full",
          lawnGoal: "maintain",
          path: "novice",
        })
      );

      // Also store in existing profile format for compatibility
      localStorage.setItem(
        "lawnhq_profile",
        JSON.stringify({
          zipCode: state.zip,
          grassType: planGrassType,
        })
      );
      localStorage.setItem(
        "lawnhq_guest",
        JSON.stringify({
          email,
          zipCode: state.zip,
          grassType: state.grassType,
          createdAt: new Date().toISOString(),
        })
      );

      track("onboarding_email_submitted", { email });

      // Fade out then navigate to the real dashboard
      setAnimating(true);
      setTimeout(() => {
        window.location.href = "/sandbox/home";
      }, 300);
    },
    [state.zip, state.grassType]
  );

  /* ── Progress bar width ── */
  const progressPct = step === 1 ? 25 : step === 2 ? 55 : 100;

  /* ── Task data for dashboard ── */
  const weeklyData = getWeeklyTasks(
    state.grassType || "bermuda",
    state.region?.region || "your area"
  );

  /* ═══════════════════════════════════
     Render
     ═══════════════════════════════════ */

  return (
    <div className="min-h-dvh bg-cream">
      {/* ── Progress Bar ── */}
      {step < 3 && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-deep-brown/10">
          <div
            className="h-full bg-terracotta transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* ── Step container with fade transition ── */}
      <div
        className={`transition-opacity duration-250 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        {/* ════════════════════════════════
           STEP 1: Grass Type Picker
           ════════════════════════════════ */}
        {step === 1 && (
          <div className="fixed inset-0 bg-cream flex flex-col overflow-y-auto">
            {/* Spacer for progress bar */}
            <div className="h-1 flex-shrink-0" />

            <div className="flex-1 flex flex-col justify-center px-5 py-8 lg:py-12">
              <div className="w-full max-w-xl mx-auto">
                {!showNotSure ? (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <h1 className="font-display text-[28px] lg:text-4xl font-bold text-deep-brown leading-[1.1]">
                        What&apos;s growing in your yard?
                      </h1>
                      <p className="mt-2 text-base text-deep-brown/60">
                        This helps us dial in your plan. Not sure? No worries.
                      </p>
                    </div>

                    {/* Grass cards grid */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      {GRASS_OPTIONS.map((g) => (
                        <button
                          key={g.key}
                          onClick={() => selectGrass(g.key)}
                          className={`rounded-2xl border-2 border-deep-brown/10 bg-white text-left transition-all duration-150 active:scale-[0.97] hover:border-terracotta hover:shadow-md overflow-hidden ${
                            g.key === "not_sure" ? "col-span-2" : ""
                          }`}
                        >
                          {/* Swatch */}
                          <div
                            className={`h-20 lg:h-24 bg-gradient-to-br ${g.colors} flex items-center justify-center`}
                          >
                            {g.key === "not_sure" ? (
                              <svg
                                className="w-10 h-10 text-deep-brown/40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 4h.01"
                                />
                              </svg>
                            ) : (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-white/30 rounded-full"
                                    style={{ height: `${20 + Math.random() * 24}px` }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Label */}
                          <div className="p-3 lg:p-4">
                            <p className="font-display font-bold text-deep-brown text-sm lg:text-base">
                              {g.label}
                            </p>
                            <p className="text-xs lg:text-sm text-deep-brown/50 mt-0.5">
                              {g.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* ── "Not sure" suggestion ── */
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-display text-[28px] lg:text-4xl font-bold text-deep-brown leading-[1.1]">
                        We&apos;ve got a good guess
                      </h1>
                      <p className="mt-2 text-base text-deep-brown/60">
                        Based on your zip code, here&apos;s what we think.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border-2 border-lawn/30 p-5 lg:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b7d4a] to-[#5ba36a] flex items-center justify-center">
                          <div className="flex items-center gap-0.5">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 bg-white/40 rounded-full"
                                style={{ height: `${12 + Math.random() * 12}px` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-display font-bold text-deep-brown">
                            {state.region?.suggestedGrass}
                          </p>
                          <p className="text-sm text-deep-brown/50">
                            Most common in {state.region?.region}
                          </p>
                        </div>
                      </div>
                      <p className="text-deep-brown/70 text-sm leading-relaxed">
                        Most lawns in {state.region?.region} have{" "}
                        <span className="font-semibold text-deep-brown">
                          {state.region?.suggestedGrass}
                        </span>
                        . Sound right?
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={acceptSuggestion}
                        className="w-full h-14 bg-terracotta text-white font-bold rounded-2xl active:scale-[0.97] transition-transform duration-100 text-base"
                      >
                        Yep, that&apos;s me →
                      </button>
                      <button
                        onClick={defaultSuggestion}
                        className="w-full h-12 border-2 border-deep-brown/15 text-deep-brown/60 font-medium rounded-2xl active:scale-[0.97] transition-transform duration-100 text-sm"
                      >
                        Still not sure — just use your best guess
                      </button>
                      <button
                        onClick={() => setShowNotSure(false)}
                        className="text-sm text-deep-brown/40 mt-1"
                      >
                        ← Back to grass types
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
           STEP 2: Email Gate + Blurred Plan
           ════════════════════════════════ */}
        {step === 2 && (
          <div className="fixed inset-0 bg-cream flex flex-col overflow-hidden">
            {/* Spacer for progress bar */}
            <div className="h-1 flex-shrink-0" />

            {/* Real dashboard preview (blurred) */}
            <div className="absolute inset-0 overflow-hidden" style={{ filter: "blur(6px)", opacity: 0.3 }}>
              <iframe
                src="/sandbox/home"
                className="w-full h-full border-0"
                tabIndex={-1}
                aria-hidden="true"
                title="Dashboard preview"
                style={{ pointerEvents: "none" }}
              />
            </div>

            {/* Semi-transparent overlay for readability */}
            <div className="absolute inset-0 bg-cream/30" />

            {/* Foreground: Email capture card */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-5 py-8">
              <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-2xl p-6 lg:p-8">
                  {/* Success indicator */}
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-lawn/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-deep-brown mb-2">
                      Your plan is ready
                    </h1>
                    <p className="text-deep-brown/60">
                      Drop your email and we&apos;ll get you started — takes 2 seconds.
                    </p>
                  </div>

                  {/* Email form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      submitEmail(formData.get("email") as string);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <input
                        name="email"
                        type="email"
                        autoFocus
                        autoComplete="email"
                        autoCapitalize="none"
                        placeholder="you@email.com"
                        onChange={() => setEmailError("")}
                        className={`w-full h-14 px-4 rounded-xl border-2 text-deep-brown text-lg placeholder:text-deep-brown/30 focus:outline-none transition-colors ${
                          emailError
                            ? "border-red-400 bg-red-50/50"
                            : "border-deep-brown/10 bg-cream/30 focus:border-lawn"
                        }`}
                      />
                      {emailError && (
                        <p className="mt-2 text-sm text-red-600">{emailError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full h-14 bg-terracotta text-white font-bold rounded-xl active:scale-[0.97] hover:bg-terracotta/90 transition-all duration-100 text-base tracking-wide"
                    >
                      UNLOCK MY PLAN →
                    </button>
                  </form>

                  <p className="text-xs text-deep-brown/40 text-center mt-4">
                    Join 12,000+ homeowners getting weekly lawn plans. Unsubscribe anytime.
                  </p>
                </div>

                {/* Already have an account? */}
                <p className="text-sm text-deep-brown/40 text-center mt-6">
                  Already have an account?{" "}
                  <a href="/login" className="text-lawn font-medium hover:underline">
                    Log in
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
           STEP 3: Dashboard + Upsell
           ════════════════════════════════ */}
        {step === 3 && (
          <div className="min-h-dvh bg-cream">
            {/* Dashboard header */}
            <header className="bg-white border-b border-deep-brown/10 sticky top-0 z-30">
              <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogoIcon className="w-7 h-7" />
                  <LogoWordmark className="text-lg text-deep-brown" />
                </div>
                <a
                  href="/login"
                  className="text-xs text-deep-brown/50 font-medium uppercase tracking-wider"
                >
                  Log in
                </a>
              </div>
            </header>

            {/* Welcome toast */}
            <div className="max-w-2xl mx-auto px-5 pt-6 pb-2">
              <div className="bg-lawn/10 border border-lawn/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">👋</span>
                <div>
                  <p className="text-sm text-deep-brown font-medium">
                    Welcome to Lawn HQ — tell us about your lawn.
                  </p>
                  <p className="text-xs text-deep-brown/50 mt-0.5">
                    Don&apos;t worry, we won&apos;t judge. We&apos;ve seen some things.
                  </p>
                </div>
              </div>
            </div>

            {/* Plan context */}
            <div className="max-w-2xl mx-auto px-5 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b7d4a] to-[#5ba36a] flex items-center justify-center flex-shrink-0">
                  <div className="flex items-center gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-white/40 rounded-full"
                        style={{ height: `${10 + i * 4}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-display font-bold text-deep-brown text-sm">
                    {state.grassLabel || GRASS_LABELS[state.grassType || "bermuda"]} Plan
                  </p>
                  <p className="text-xs text-deep-brown/50">
                    {weeklyData.region} · {weeklyData.monthName} {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="max-w-2xl mx-auto px-5 py-6 space-y-8">
              {/* ── This Week ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-lawn flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-deep-brown">This Week</h2>
                </div>

                <div className="space-y-3">
                  {weeklyData.thisWeek.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-deep-brown/10 p-4 shadow-sm hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-deep-brown/20 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-deep-brown text-[15px]">{item.task}</p>
                          {item.detail && (
                            <p className="text-sm text-deep-brown/50 mt-0.5">{item.detail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Next Week ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-terracotta/20 flex items-center justify-center">
                    <span className="text-terracotta text-xs font-bold">2</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-deep-brown">Next Week</h2>
                </div>

                <div className="space-y-2">
                  {weeklyData.nextWeek.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/60 rounded-xl border border-deep-brown/8 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full border border-deep-brown/15 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-deep-brown/80 text-sm">{item.task}</p>
                          {item.detail && (
                            <p className="text-xs text-deep-brown/40 mt-0.5">{item.detail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Week 3 ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-deep-brown/10 flex items-center justify-center">
                    <span className="text-deep-brown/40 text-xs font-bold">3</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-deep-brown/70">Week 3</h2>
                </div>

                <div className="space-y-2">
                  {weeklyData.week3.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/40 rounded-xl border border-deep-brown/5 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full border border-deep-brown/10 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-deep-brown/60 text-sm">{item.task}</p>
                          {item.detail && (
                            <p className="text-xs text-deep-brown/30 mt-0.5">{item.detail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Upsell scroll trigger ── */}
              <div ref={upsellTriggerRef} className="h-1" />

              {/* ── Stay in the Loop ── */}
              <section
                className={`transition-all duration-500 ${
                  upsellVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="bg-gradient-to-br from-cream to-white rounded-2xl border-2 border-lawn/20 p-6 lg:p-8 shadow-sm">
                  <h3 className="font-display text-xl font-bold text-deep-brown mb-1">
                    Stay in the loop
                  </h3>
                  <p className="text-deep-brown/50 text-sm mb-6">
                    Pick how you want us to keep you on track.
                  </p>

                  {/* ── Email weekly plan opt-in ── */}
                  <button
                    onClick={() => setOptInEmail(!optInEmail)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-150 mb-3 ${
                      optInEmail
                        ? "border-lawn bg-lawn/5"
                        : "border-deep-brown/10 bg-white hover:border-deep-brown/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Toggle indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        optInEmail ? "bg-lawn border-lawn" : "border-deep-brown/20"
                      }`}>
                        {optInEmail && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-deep-brown/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="font-display font-bold text-deep-brown text-[15px]">
                            Weekly email plan
                          </p>
                        </div>
                        <p className="text-sm text-deep-brown/50 mt-1 ml-6">
                          Every Monday — your full week of lawn tasks, straight to your inbox.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* ── Push notification opt-in ── */}
                  <button
                    onClick={() => setOptInPush(!optInPush)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-150 ${
                      optInPush
                        ? "border-terracotta bg-terracotta/5"
                        : "border-deep-brown/10 bg-white hover:border-deep-brown/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Toggle indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        optInPush ? "bg-terracotta border-terracotta" : "border-deep-brown/20"
                      }`}>
                        {optInPush && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-deep-brown/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p className="font-display font-bold text-deep-brown text-[15px]">
                            24-hour reminders
                          </p>
                        </div>
                        <p className="text-sm text-deep-brown/50 mt-1 ml-6">
                          A push notification the day before each task — so you never miss the window.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* ── Save preferences CTA ── */}
                  <button
                    onClick={() => {
                      track("onboarding_notifications_saved", {
                        emailOptIn: optInEmail,
                        pushOptIn: optInPush,
                      });

                      // Persist preferences
                      localStorage.setItem(
                        "lawnhq_notification_prefs",
                        JSON.stringify({
                          emailWeeklyPlan: optInEmail,
                          pushReminders: optInPush,
                          savedAt: new Date().toISOString(),
                        })
                      );

                      setOptInSaved(true);
                      setTimeout(() => setOptInSaved(false), 3000);
                    }}
                    disabled={!optInEmail && !optInPush}
                    className={`w-full h-12 font-bold rounded-xl active:scale-[0.97] transition-all duration-150 text-sm tracking-wide mt-5 ${
                      optInSaved
                        ? "bg-lawn text-white"
                        : !optInEmail && !optInPush
                        ? "bg-deep-brown/10 text-deep-brown/30 cursor-not-allowed"
                        : "bg-terracotta text-white hover:bg-terracotta/90"
                    }`}
                  >
                    {optInSaved ? "SAVED ✓" : "SAVE MY PREFERENCES"}
                  </button>

                  <p className="text-xs text-deep-brown/40 text-center mt-3">
                    You can change these anytime in your settings. No spam, ever.
                  </p>
                </div>
              </section>

              {/* Bottom spacer */}
              <div className="h-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page export with Suspense
   ═══════════════════════════════════════════ */

export default function OnboardingV2Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-cream flex flex-col">
          <div className="h-1 bg-deep-brown/10">
            <div className="h-full bg-terracotta/30 w-1/4" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-5 py-8">
            <div className="w-full max-w-xl mx-auto space-y-6 animate-pulse">
              <div>
                <div className="h-8 bg-deep-brown/10 rounded-lg w-3/4" />
                <div className="h-4 bg-deep-brown/10 rounded-lg w-1/2 mt-3" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-32 bg-deep-brown/10 rounded-2xl" />
                <div className="h-32 bg-deep-brown/10 rounded-2xl" />
                <div className="h-32 bg-deep-brown/10 rounded-2xl" />
                <div className="h-32 bg-deep-brown/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}
