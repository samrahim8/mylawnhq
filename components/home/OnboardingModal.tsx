"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    zipCode?: string;
    grassType?: string;
  };
}

type Path = "novice" | "expert" | null;
type LawnSize = "small" | "medium" | "large" | null;
type LawnGoal = "low-maintenance" | "healthy-green" | "golf-course" | null;

export default function OnboardingModal({
  isOpen,
  onClose,
  initialData,
}: OnboardingModalProps) {
  const router = useRouter();
  const { saveProfile } = useProfile();
  const [path, setPath] = useState<Path>(null);
  const [step, setStep] = useState(0);
  const [lawnSize, setLawnSize] = useState<LawnSize>(null);
  const [lawnGoal, setLawnGoal] = useState<LawnGoal>(null);
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePathSelect = (selectedPath: Path) => {
    setPath(selectedPath);
    if (selectedPath === "novice") {
      setStep(1);
    } else {
      // Expert path - save basic info and close
      handleSaveAndClose();
    }
  };

  const handleSaveAndClose = async () => {
    // Save the profile data we have
    const grassType = initialData?.grassType === "st-augustine" ? "st-augustine" : "bermuda";

    await saveProfile({
      zipCode: initialData?.zipCode || "",
      grassType: grassType as "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine",
      lawnSize: lawnSize || "medium",
      lawnGoal: lawnGoal || undefined,
    });

    // Clear onboarding data
    localStorage.removeItem("lawnhq_onboarding");

    onClose();
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);

    // Save profile
    const grassType = initialData?.grassType === "st-augustine" ? "st-augustine" : "bermuda";

    await saveProfile({
      zipCode: initialData?.zipCode || "",
      grassType: grassType as "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine",
      lawnSize: lawnSize || "medium",
      lawnGoal: lawnGoal || undefined,
    });

    // Clear onboarding data
    localStorage.removeItem("lawnhq_onboarding");

    // Redirect to chat with plan generation prompt
    const goalText = lawnGoal === "low-maintenance" ? "maintain with minimal effort" :
      lawnGoal === "golf-course" ? "achieve golf-course quality for" :
      "keep healthy and green";
    const sizeText = lawnSize === "small" ? "small" : lawnSize === "large" ? "large" : "medium-sized";

    const prompt = `Create a personalized 90-day lawn care plan for my ${sizeText} ${grassType} lawn in zip code ${initialData?.zipCode}. My goal is to ${goalText} my lawn. Give me a week-by-week breakdown of what I should do.`;

    router.push(`/chat?q=${encodeURIComponent(prompt)}`);
  };

  // Step 0: Path selection
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">&#127793;</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-deep-brown">
              Welcome to LawnHQ!
            </h2>
            <p className="mt-2 text-deep-brown/60">
              Let&rsquo;s get you set up. How would you like to start?
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePathSelect("novice")}
              className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-5 text-left transition-all hover:border-lawn hover:shadow-md group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-lawn/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">&#128075;</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-deep-brown text-lg">
                    I need some help
                  </h3>
                  <p className="mt-1 text-sm text-deep-brown/60">
                    Answer 2 quick questions and we&rsquo;ll build your personalized plan.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePathSelect("expert")}
              className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-5 text-left transition-all hover:border-lawn hover:shadow-md group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">&#128170;</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-deep-brown text-lg">
                    I know my stuff
                  </h3>
                  <p className="mt-1 text-sm text-deep-brown/60">
                    Skip the questions and jump straight into the app.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Lawn size
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <p className="text-sm text-deep-brown/50 mb-2">Question 1 of 2</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-deep-brown">
              How big is your lawn?
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { id: "small", label: "Small", desc: "Under 3,000 sq ft", emoji: "&#127969;" },
              { id: "medium", label: "Medium", desc: "3,000 - 8,000 sq ft", emoji: "&#127968;" },
              { id: "large", label: "Large", desc: "Over 8,000 sq ft", emoji: "&#127760;" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setLawnSize(option.id as LawnSize);
                  setStep(2);
                }}
                className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-4 text-left transition-all hover:border-lawn hover:shadow-md flex items-center gap-4"
              >
                <span
                  className="text-2xl"
                  dangerouslySetInnerHTML={{ __html: option.emoji }}
                />
                <div>
                  <h3 className="font-semibold text-deep-brown">{option.label}</h3>
                  <p className="text-sm text-deep-brown/60">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(0)}
            className="mt-6 w-full text-sm text-deep-brown/50 hover:text-deep-brown"
          >
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Lawn goal
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <p className="text-sm text-deep-brown/50 mb-2">Question 2 of 2</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-deep-brown">
              What&rsquo;s your goal?
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { id: "low-maintenance", label: "Keep It Simple", desc: "Low effort, still looks good", emoji: "&#128564;" },
              { id: "healthy-green", label: "Healthy & Green", desc: "A solid, healthy lawn", emoji: "&#9989;" },
              { id: "golf-course", label: "Golf Course Quality", desc: "The best lawn on the block", emoji: "&#127942;" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setLawnGoal(option.id as LawnGoal);
                  setStep(3);
                }}
                className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-4 text-left transition-all hover:border-lawn hover:shadow-md flex items-center gap-4"
              >
                <span
                  className="text-2xl"
                  dangerouslySetInnerHTML={{ __html: option.emoji }}
                />
                <div>
                  <h3 className="font-semibold text-deep-brown">{option.label}</h3>
                  <p className="text-sm text-deep-brown/60">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-6 w-full text-sm text-deep-brown/50 hover:text-deep-brown"
          >
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Generate plan
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">&#127793;</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-deep-brown mb-2">
          You&rsquo;re all set!
        </h2>
        <p className="text-deep-brown/60 mb-8">
          Ready to get your personalized 90-day lawn care plan?
        </p>

        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="w-full bg-terracotta text-white font-semibold py-4 rounded-xl text-sm hover:bg-terracotta/90 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating your plan...
            </span>
          ) : (
            "GENERATE MY PLAN \u2192"
          )}
        </button>

        <button
          onClick={handleSaveAndClose}
          className="mt-4 w-full text-sm text-deep-brown/50 hover:text-deep-brown"
        >
          Skip for now, I&rsquo;ll explore on my own
        </button>
      </div>
    </div>
  );
}
