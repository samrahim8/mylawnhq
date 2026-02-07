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

  const initialGrass: GrassType | null = grassFromUrl === "st-augustine" ? "st_augustine" : grassFromUrl === "other" ? null : null;
  const initialStep = initialGrass ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [selections, setSelections] = useState<Selections>({
    grassType: initialGrass,
    lawnSize: null,
    lawnGoal: null,
  });

  const [showGrassHelper, setShowGrassHelper] = useState(false);
  const [helperAnswers, setHelperAnswers] = useState({
    dormancy: "",
    bladeWidth: "",
    origin: "",
  });

  const navigateToPlan = useCallback(
    (finalSelections: Selections, overrideGoal?: string) => {
      const planData = {
        zip,
        grassType: finalSelections.grassType || "not_sure",
        lawnSize: finalSelections.lawnSize === "not_sure" ? "medium" : (finalSelections.lawnSize || "medium"),
        sunExposure: "full",
        lawnGoal: overrideGoal || finalSelections.lawnGoal || "maintain",
        path: "novice",
      };

      localStorage.setItem("lawnhq_plan_params", JSON.stringify(planData));

      const existingProfile = JSON.parse(localStorage.getItem("lawnhq_profile") || "{}");
      localStorage.setItem("lawnhq_profile", JSON.stringify({
        ...existingProfile,
        ...planData,
      }));

      router.push("/home");
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
    let suggested: GrassType = "fescue_kbg";
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
      router.push(`/sandbox/path?zip=${zip}&grass=${grassFromUrl}`);
    } else {
      setStep((s) => s - 1);
    }
  };

  const totalSteps = initialStep === 2 ? 2 : 3;
  const currentStepNum = initialStep === 2 ? step - 1 : step;

  return (
    <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)] overflow-hidden">
      {/* Progress bar - below safe area */}
      <div className="h-1 bg-deep-brown/10">
        <div
          className="h-full bg-deep-brown/30 transition-all duration-300"
          style={{ width: `${75 + (currentStepNum / totalSteps) * 25}%` }}
        />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Content - vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          <div className="space-y-6">
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
          </div>
        </div>

        {/* Back button - fixed to bottom thumb zone */}
        <div className="px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm text-deep-brown/50 min-h-[44px] active:text-deep-brown transition-colors duration-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-8 lg:py-16">
        <div className="w-full max-w-xl">
          {step === 1 && !showGrassHelper && (
            <StepGrassType
              selected={selections.grassType}
              onSelect={(v) => advance("grassType", v)}
              isDesktop
            />
          )}
          {step === 1 && showGrassHelper && (
            <GrassHelper
              answers={helperAnswers}
              setAnswers={setHelperAnswers}
              onDone={handleGrassHelperDone}
              isDesktop
            />
          )}
          {step === 2 && (
            <StepLawnSize
              selected={selections.lawnSize}
              onSelect={(v) => advance("lawnSize", v)}
              isDesktop
            />
          )}
          {step === 3 && (
            <StepGoal
              selected={selections.lawnGoal}
              onSelect={(v) => advance("lawnGoal", v)}
              isDesktop
            />
          )}

          <div className="mt-12">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-deep-brown/50 hover:text-deep-brown py-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Grass Type ─── */

const grassOptions: { value: GrassType; label: string; desc: string }[] = [
  { value: "bermuda", label: "Bermuda", desc: "Fine blade, spreads fast" },
  { value: "zoysia", label: "Zoysia", desc: "Dense, carpet-like" },
  { value: "fescue_kbg", label: "Fescue / KBG", desc: "Thick blades, cool-season" },
  { value: "st_augustine", label: "St. Augustine", desc: "Wide blades, warm-season" },
  { value: "not_sure", label: "Not sure", desc: "We'll help figure it out" },
];

function StepGrassType({
  selected,
  onSelect,
  isDesktop,
}: {
  selected: GrassType | null;
  onSelect: (v: GrassType) => void;
  isDesktop?: boolean;
}) {
  return (
    <>
      <div>
        <h2 className={`font-display font-bold text-deep-brown leading-[1.1] ${isDesktop ? "text-4xl" : "text-[28px]"}`}>
          What type of grass?
        </h2>
        <p className="mt-2 text-base text-deep-brown/70">
          Pick the closest match.
        </p>
      </div>

      <div className={`space-y-3 ${isDesktop ? "grid grid-cols-2 gap-3 space-y-0" : ""}`}>
        {grassOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97] duration-100 flex items-center gap-4 ${
              selected === opt.value
                ? "border-lawn bg-lawn/5"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <div className="w-12 h-12 bg-lawn/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-deep-brown">{opt.label}</p>
              <p className="text-sm text-deep-brown/50">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ─── Grass Helper ─── */

function GrassHelper({
  answers,
  setAnswers,
  onDone,
  isDesktop,
}: {
  answers: { dormancy: string; bladeWidth: string; origin: string };
  setAnswers: React.Dispatch<React.SetStateAction<{ dormancy: string; bladeWidth: string; origin: string }>>;
  onDone: () => void;
  isDesktop?: boolean;
}) {
  const helperStep = !answers.dormancy ? 0 : !answers.bladeWidth ? 1 : !answers.origin ? 2 : 3;

  const setAnswer = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  if (helperStep === 3) {
    setTimeout(onDone, 0);
  }

  const questions = [
    {
      question: "Does your lawn stay green year-round?",
      options: [
        { value: "year_round", label: "Yes, green all year" },
        { value: "dormant", label: "No, goes brown in winter" },
      ],
      field: "dormancy",
    },
    {
      question: "How wide are the blades?",
      options: [
        { value: "fine", label: "Fine / thin blades" },
        { value: "wide", label: "Wide / coarse blades" },
      ],
      field: "bladeWidth",
    },
    {
      question: "Did you plant it?",
      options: [
        { value: "planted", label: "Yes, I planted it" },
        { value: "existing", label: "No, it was already there" },
      ],
      field: "origin",
    },
  ];

  const current = questions[Math.min(helperStep, 2)];

  return (
    <>
      <div>
        <h2 className={`font-display font-bold text-deep-brown leading-[1.1] ${isDesktop ? "text-4xl" : "text-[28px]"}`}>
          Let&apos;s figure it out
        </h2>
        <p className="mt-2 text-base text-deep-brown/70">
          Question {helperStep + 1} of 3
        </p>
      </div>

      <div>
        <p className="font-semibold text-deep-brown text-lg mb-4">{current.question}</p>
        <div className="space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAnswer(current.field, opt.value)}
              className="w-full rounded-2xl border-2 border-deep-brown/10 bg-white p-4 text-left transition-all active:scale-[0.97] duration-100 font-medium text-deep-brown min-h-[56px]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Step 2: Lawn Size ─── */

const sizeOptions: { value: LawnSize; label: string; desc: string; icon: string }[] = [
  { value: "small", label: "Small", desc: "Under 2,500 sq ft", icon: "🏠" },
  { value: "medium", label: "Medium", desc: "2,500 - 10,000 sq ft", icon: "🏡" },
  { value: "large", label: "Large", desc: "Over 10,000 sq ft", icon: "🏘️" },
  { value: "not_sure", label: "Not sure", desc: "We'll estimate for you", icon: "📍" },
];

function StepLawnSize({
  selected,
  onSelect,
  isDesktop,
}: {
  selected: LawnSize | null;
  onSelect: (v: LawnSize) => void;
  isDesktop?: boolean;
}) {
  return (
    <>
      <div>
        <h2 className={`font-display font-bold text-deep-brown leading-[1.1] ${isDesktop ? "text-4xl" : "text-[28px]"}`}>
          How big is your lawn?
        </h2>
        <p className="mt-2 text-base text-deep-brown/70">
          A rough estimate is fine.
        </p>
      </div>

      <div className={`space-y-3 ${isDesktop ? "grid grid-cols-2 gap-3 space-y-0" : ""}`}>
        {sizeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97] duration-100 flex items-center gap-4 ${
              selected === opt.value
                ? "border-lawn bg-lawn/5"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <div className="min-w-0">
              <p className="font-bold text-deep-brown">{opt.label}</p>
              <p className="text-sm text-deep-brown/50">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ─── Step 3: Goal ─── */

const goalOptions: { value: LawnGoal; label: string; desc: string; icon: string }[] = [
  { value: "fix", label: "Fix it", desc: "Weeds, bare spots, problems", icon: "🔧" },
  { value: "maintain", label: "Maintain", desc: "Keep it healthy", icon: "✨" },
  { value: "perfect", label: "Perfect it", desc: "Best lawn on the block", icon: "🏆" },
  { value: "not_sure", label: "Not sure", desc: "Just tell me what to do", icon: "🤔" },
];

function StepGoal({
  selected,
  onSelect,
  isDesktop,
}: {
  selected: LawnGoal | null;
  onSelect: (v: LawnGoal) => void;
  isDesktop?: boolean;
}) {
  return (
    <>
      <div>
        <h2 className={`font-display font-bold text-deep-brown leading-[1.1] ${isDesktop ? "text-4xl" : "text-[28px]"}`}>
          What&apos;s your goal?
        </h2>
        <p className="mt-2 text-base text-deep-brown/70">
          This helps prioritize your plan.
        </p>
      </div>

      <div className="space-y-3">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97] duration-100 flex items-center gap-4 ${
              selected === opt.value
                ? "border-lawn bg-lawn/5"
                : "border-deep-brown/10 bg-white"
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div className="min-w-0">
              <p className="font-bold text-deep-brown">{opt.label}</p>
              <p className="text-sm text-deep-brown/50">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)] overflow-hidden">
          <div className="h-1 bg-deep-brown/10">
            <div className="h-full bg-deep-brown/20 w-4/5" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-5 py-6">
            <div className="space-y-6 animate-pulse">
              <div>
                <div className="h-8 bg-deep-brown/10 rounded-lg w-3/4" />
                <div className="h-4 bg-deep-brown/10 rounded-lg w-1/2 mt-3" />
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-deep-brown/10 rounded-2xl" />
                <div className="h-20 bg-deep-brown/10 rounded-2xl" />
                <div className="h-20 bg-deep-brown/10 rounded-2xl" />
                <div className="h-20 bg-deep-brown/10 rounded-2xl" />
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
