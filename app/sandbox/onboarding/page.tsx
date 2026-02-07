"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type GrassType = "bermuda" | "zoysia" | "fescue_kbg" | "st_augustine" | "not_sure";
type LawnSize = "small" | "medium" | "large" | "not_sure";
type LawnGoal = "fix" | "maintain" | "perfect" | "not_sure";

interface Selections {
  grassType: GrassType | null;
  lawnSize: LawnSize | null;
  lawnGoal: LawnGoal | null;
}

function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";
  const grassFromUrl = searchParams.get("grass") || "";

  // If they already told us grass type, start at step 2 (lawn size)
  const initialGrass: GrassType | null = grassFromUrl === "st-augustine" ? "st_augustine" : grassFromUrl === "other" ? null : null;
  const initialStep = initialGrass ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [selections, setSelections] = useState<Selections>({
    grassType: initialGrass,
    lawnSize: null,
    lawnGoal: null,
  });

  // "Not sure" grass type helper state
  const [showGrassHelper, setShowGrassHelper] = useState(false);
  const [helperAnswers, setHelperAnswers] = useState({
    dormancy: "", // "year_round" | "dormant"
    bladeWidth: "", // "fine" | "wide"
    origin: "", // "planted" | "existing"
  });

  const navigateToPlan = useCallback(
    (finalSelections: Selections, overrideGoal?: string) => {
      const params = new URLSearchParams({
        zip,
        grassType: finalSelections.grassType || "not_sure",
        lawnSize: finalSelections.lawnSize === "not_sure" ? "medium" : (finalSelections.lawnSize || "medium"),
        sunExposure: "full", // default — refined later via photo analysis
        lawnGoal: overrideGoal || finalSelections.lawnGoal || "maintain",
        path: "novice",
      });
      router.push(`/sandbox/plan?${params.toString()}`);
    },
    [zip, router]
  );

  const advance = useCallback(
    (field: keyof Selections, value: string) => {
      const updated = { ...selections, [field]: value };
      setSelections(updated);

      if (field === "grassType" && value === "not_sure") {
        setShowGrassHelper(true);
        return;
      }

      if (step < 3) {
        setStep((s) => s + 1);
      } else {
        navigateToPlan(updated, field === "lawnGoal" ? value : undefined);
      }
    },
    [step, selections, navigateToPlan]
  );

  const handleGrassHelperDone = useCallback(() => {
    // Auto-suggest grass type based on helper answers
    let suggested: GrassType = "fescue_kbg"; // safe default
    if (helperAnswers.dormancy === "dormant" && helperAnswers.bladeWidth === "fine") {
      suggested = "bermuda";
    } else if (helperAnswers.dormancy === "dormant" && helperAnswers.bladeWidth === "wide") {
      suggested = "st_augustine";
    } else if (helperAnswers.dormancy === "year_round" && helperAnswers.bladeWidth === "fine") {
      suggested = "zoysia";
    } else if (helperAnswers.dormancy === "year_round" && helperAnswers.bladeWidth === "wide") {
      suggested = "fescue_kbg";
    }

    setSelections((prev) => ({ ...prev, grassType: suggested }));
    setShowGrassHelper(false);
    setStep(2);
  }, [helperAnswers]);

  const goBack = () => {
    if (showGrassHelper) {
      setShowGrassHelper(false);
      return;
    }
    if (step === initialStep) {
      // Go back to path selection
      router.push(`/sandbox/path?zip=${zip}&grass=${grassFromUrl}`);
    } else {
      setStep((s) => s - 1);
    }
  };

  // Calculate progress (if we skipped step 1, we have 2 steps total)
  const totalSteps = initialStep === 2 ? 2 : 3;
  const currentStepNum = initialStep === 2 ? step - 1 : step;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-deep-brown/5">
        <div
          className="h-1 bg-lawn transition-all duration-300"
          style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {step === 1 && !showGrassHelper && (
            <StepGrassType
              selected={selections.grassType}
              onSelect={(v) => advance("grassType", v)}
            />
          )}
          {step === 1 && showGrassHelper && (
            <GrassHelper
              answers={helperAnswers}
              setAnswers={setHelperAnswers}
              onDone={handleGrassHelperDone}
            />
          )}
          {step === 2 && (
            <StepLawnSize
              selected={selections.lawnSize}
              onSelect={(v) => advance("lawnSize", v)}
            />
          )}
          {step === 3 && (
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
              Step {currentStepNum} of {totalSteps}
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

/* ─── Grass Helper (for "Not sure") ─── */

function GrassHelper({
  answers,
  setAnswers,
  onDone,
}: {
  answers: { dormancy: string; bladeWidth: string; origin: string };
  setAnswers: React.Dispatch<React.SetStateAction<{ dormancy: string; bladeWidth: string; origin: string }>>;
  onDone: () => void;
}) {
  const helperStep =
    !answers.dormancy ? 0 : !answers.bladeWidth ? 1 : !answers.origin ? 2 : 3;

  const setAnswer = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-advance when all 3 are answered
  if (helperStep === 3) {
    // Use a microtask to avoid setState during render
    setTimeout(onDone, 0);
  }

  const questions = [
    {
      question: "Is your lawn green year-round or does it go brown in winter?",
      options: [
        { value: "year_round", label: "Green year-round" },
        { value: "dormant", label: "Goes brown / dormant in winter" },
      ],
      field: "dormancy",
    },
    {
      question: "Are the blades fine/thin or wide/coarse?",
      options: [
        { value: "fine", label: "Fine / thin blades" },
        { value: "wide", label: "Wide / coarse blades" },
      ],
      field: "bladeWidth",
    },
    {
      question: "Did you plant it or was it already there?",
      options: [
        { value: "planted", label: "I planted it" },
        { value: "existing", label: "It was already there" },
      ],
      field: "origin",
    },
  ];

  const current = questions[Math.min(helperStep, 2)];

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
        Let Chip figure out your grass type
      </h2>
      <p className="mt-2 text-deep-brown/60">
        Quick question {helperStep + 1} of 3
      </p>

      <div className="mt-8">
        <p className="font-medium text-deep-brown mb-4">{current.question}</p>
        <div className="flex flex-col gap-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAnswer(current.field, opt.value)}
              className="rounded-xl border-2 border-deep-brown/10 bg-white p-4 text-left transition-all hover:border-lawn/50 hover:shadow-md text-sm font-medium text-deep-brown"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Lawn Size ─── */

const sizeOptions: { value: LawnSize; label: string; desc: string; icon: string }[] = [
  { value: "small", label: "Small", desc: "< 2,500 sq ft", icon: "&#127968;" },
  { value: "medium", label: "Medium", desc: "2,500 - 10,000 sq ft", icon: "&#127968;&#127795;" },
  { value: "large", label: "Large", desc: "> 10,000 sq ft", icon: "&#127968;&#127795;&#127795;" },
  { value: "not_sure", label: "Not sure", desc: "We'll estimate for you", icon: "&#128204;" },
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
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
            <p className="font-semibold text-deep-brown text-sm">{opt.label}</p>
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

/* ─── Step 3: Goal ─── */

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
  {
    value: "not_sure",
    label: "NOT SURE",
    desc: "Just show me what to do",
    icon: "&#129300;",
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
