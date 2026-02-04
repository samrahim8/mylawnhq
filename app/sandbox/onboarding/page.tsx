"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type GrassType = "bermuda" | "zoysia" | "fescue_kbg" | "st_augustine" | "not_sure";
type LawnSize = "small" | "medium" | "large";
type SunExposure = "full" | "partial" | "shade";
type LawnGoal = "fix" | "maintain" | "perfect";

interface Selections {
  grassType: GrassType | null;
  lawnSize: LawnSize | null;
  sunExposure: SunExposure | null;
  lawnGoal: LawnGoal | null;
}

function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";

  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Selections>({
    grassType: null,
    lawnSize: null,
    sunExposure: null,
    lawnGoal: null,
  });

  const advance = useCallback(
    (field: keyof Selections, value: string) => {
      setSelections((prev) => ({ ...prev, [field]: value }));
      if (step < 4) {
        setStep((s) => s + 1);
      } else {
        // Final step — navigate to plan with params
        const params = new URLSearchParams({
          zip,
          grassType: field === "lawnGoal" ? (selections.grassType || "") : (field === "grassType" ? value : (selections.grassType || "")),
          lawnSize: field === "lawnGoal" ? (selections.lawnSize || "") : (field === "lawnSize" ? value : (selections.lawnSize || "")),
          sunExposure: field === "lawnGoal" ? (selections.sunExposure || "") : (field === "sunExposure" ? value : (selections.sunExposure || "")),
          lawnGoal: field === "lawnGoal" ? value : (selections.lawnGoal || ""),
          path: "novice",
        });
        router.push(`/sandbox/plan?${params.toString()}`);
      }
    },
    [step, zip, selections, router]
  );

  const goBack = () => {
    if (step === 1) {
      router.push("/sandbox");
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-deep-brown/5">
        <div
          className="h-1 bg-lawn transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <StepGrassType
              selected={selections.grassType}
              onSelect={(v) => advance("grassType", v)}
            />
          )}
          {step === 2 && (
            <StepLawnSize
              selected={selections.lawnSize}
              onSelect={(v) => advance("lawnSize", v)}
            />
          )}
          {step === 3 && (
            <StepSunExposure
              selected={selections.sunExposure}
              onSelect={(v) => advance("sunExposure", v)}
            />
          )}
          {step === 4 && (
            <StepGoal
              selected={selections.lawnGoal}
              onSelect={(v) => advance("lawnGoal", v)}
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goBack}
              className="text-sm text-deep-brown/50 hover:text-deep-brown transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-sm text-deep-brown/40">
              Step {step} of 4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Grass Type ─── */

const grassOptions: { value: GrassType; label: string; desc: string; color: string }[] = [
  { value: "bermuda", label: "Bermuda", desc: "Fine blade, spreads fast", color: "bg-green-600" },
  { value: "zoysia", label: "Zoysia", desc: "Dense, carpet-like", color: "bg-green-700" },
  { value: "fescue_kbg", label: "Fescue / KBG", desc: "Thick blades, cool-season", color: "bg-green-500" },
  { value: "st_augustine", label: "St. Augustine", desc: "Wide blades, warm-season", color: "bg-emerald-600" },
  { value: "not_sure", label: "Not sure", desc: "We'll help you figure it out", color: "bg-deep-brown/10" },
];

function StepGrassType({
  selected,
  onSelect,
}: {
  selected: GrassType | null;
  onSelect: (v: GrassType) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
        What does your grass look like?
      </h2>
      <p className="mt-2 text-deep-brown/60">
        Pick the closest match&mdash;we&rsquo;ll fine-tune later.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
        {grassOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`group relative rounded-xl border-2 p-4 text-left transition-all hover:border-lawn/50 hover:shadow-md ${
              selected === opt.value
                ? "border-lawn bg-lawn/5 shadow-md"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <div
              className={`w-full h-20 sm:h-24 rounded-lg mb-3 ${
                opt.value === "not_sure"
                  ? "bg-deep-brown/5 flex items-center justify-center"
                  : opt.color
              }`}
            >
              {opt.value === "not_sure" && (
                <span className="text-2xl text-deep-brown/30">?</span>
              )}
            </div>
            <p className="font-semibold text-deep-brown text-sm">
              {opt.label}
            </p>
            <p className="text-xs text-deep-brown/50 mt-0.5">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 2: Lawn Size ─── */

const sizeOptions: { value: LawnSize; label: string; desc: string; icon: string }[] = [
  { value: "small", label: "Small", desc: "< 2,500 sq ft", icon: "&#127968;" },
  { value: "medium", label: "Medium", desc: "2,500 - 10,000 sq ft", icon: "&#127968;&#127795;" },
  { value: "large", label: "Large", desc: "> 10,000 sq ft", icon: "&#127968;&#127795;&#127795;" },
];

function StepLawnSize({
  selected,
  onSelect,
}: {
  selected: LawnSize | null;
  onSelect: (v: LawnSize) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
        How big is your lawn?
      </h2>
      <p className="mt-2 text-deep-brown/60">
        Don&rsquo;t worry&mdash;a rough estimate is fine.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8">
        {sizeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`rounded-xl border-2 p-4 sm:p-6 text-center transition-all hover:border-lawn/50 hover:shadow-md ${
              selected === opt.value
                ? "border-lawn bg-lawn/5 shadow-md"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <div
              className="text-3xl sm:text-4xl mb-3"
              dangerouslySetInnerHTML={{ __html: opt.icon }}
            />
            <p className="font-semibold text-deep-brown">{opt.label}</p>
            <p className="text-xs text-deep-brown/50 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-deep-brown/40 text-center">
        Tip: A typical suburban front + back yard is &ldquo;Medium&rdquo;
      </p>
    </div>
  );
}

/* ─── Step 3: Sun Exposure ─── */

const sunOptions: { value: SunExposure; label: string; desc: string; icon: string }[] = [
  { value: "full", label: "Full Sun", desc: "6+ hours direct", icon: "&#9728;&#65039;" },
  { value: "partial", label: "Partial", desc: "3-6 hours mixed", icon: "&#9925;" },
  { value: "shade", label: "Mostly Shade", desc: "< 3 hours direct", icon: "&#127781;&#65039;" },
];

function StepSunExposure({
  selected,
  onSelect,
}: {
  selected: SunExposure | null;
  onSelect: (v: SunExposure) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
        How much sun does your lawn get?
      </h2>
      <p className="mt-2 text-deep-brown/60">
        Think about a typical summer day.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8">
        {sunOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`rounded-xl border-2 p-4 sm:p-6 text-center transition-all hover:border-lawn/50 hover:shadow-md ${
              selected === opt.value
                ? "border-lawn bg-lawn/5 shadow-md"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <div
              className="text-3xl sm:text-4xl mb-3"
              dangerouslySetInnerHTML={{ __html: opt.icon }}
            />
            <p className="font-semibold text-deep-brown">{opt.label}</p>
            <p className="text-xs text-deep-brown/50 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 4: Goal ─── */

const goalOptions: { value: LawnGoal; label: string; desc: string; icon: string }[] = [
  {
    value: "fix",
    label: "FIX IT",
    desc: "I have weeds, bare spots, or other problems",
    icon: "&#128736;&#65039;",
  },
  {
    value: "maintain",
    label: "MAINTAIN",
    desc: "It's decent\u2014I just want to keep it healthy",
    icon: "&#10024;",
  },
  {
    value: "perfect",
    label: "PERFECT IT",
    desc: "I want the best lawn on the block",
    icon: "&#127942;",
  },
];

function StepGoal({
  selected,
  onSelect,
}: {
  selected: LawnGoal | null;
  onSelect: (v: LawnGoal) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
        What&rsquo;s your lawn goal?
      </h2>
      <p className="mt-2 text-deep-brown/60">
        This helps us prioritize your plan.
      </p>
      <div className="flex flex-col gap-3 mt-8">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all hover:border-lawn/50 hover:shadow-md flex items-center gap-4 ${
              selected === opt.value
                ? "border-lawn bg-lawn/5 shadow-md"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <span
              className="text-2xl flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: opt.icon }}
            />
            <div>
              <p className="font-semibold text-deep-brown tracking-wide text-sm">
                {opt.label}
              </p>
              <p className="text-sm text-deep-brown/60 mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <OnboardingFlow />
    </Suspense>
  );
}
