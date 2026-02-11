"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GrassSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";

  const selectGrass = (type: "st-augustine" | "other") => {
    router.push(`/email?zip=${zip}&grass=${type}`);
  };

  return (
    <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)] overflow-hidden">
      {/* Progress bar - below safe area */}
      <div className="h-1 bg-deep-brown/10">
        <div className="h-full bg-deep-brown/30 w-1/3 transition-all duration-300" />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Content - vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-display text-[28px] font-bold text-deep-brown leading-[1.1]">
                What type of grass?
              </h1>
              <p className="mt-2 text-base text-deep-brown/70">
                Pick the closest match — we&apos;ll fine-tune later.
              </p>
            </div>

            {/* Options - full width tappable cards */}
            <div className="space-y-3">
              <button
                onClick={() => selectGrass("st-augustine")}
                className="w-full bg-white rounded-2xl border-2 border-deep-brown/10 p-4 text-left transition-all active:scale-[0.97] duration-100 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#4a7c3f] to-[#2d5a27] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-deep-brown text-lg">St. Augustine</h2>
                  <p className="text-sm text-deep-brown/70">Wide, flat blades. Popular in the South.</p>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => selectGrass("other")}
                className="w-full bg-white rounded-2xl border-2 border-deep-brown/10 p-4 text-left transition-all active:scale-[0.97] duration-100 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#6b8e5a] to-[#4a7340] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-deep-brown text-lg">Something Else</h2>
                  <p className="text-sm text-deep-brown/70">Bermuda, Zoysia, Fescue, or not sure.</p>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Back button - fixed to bottom thumb zone */}
        <div className="px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={() => router.push("/")}
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
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:px-8 lg:py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-deep-brown leading-[1.1]">
              What type of grass?
            </h1>
            <p className="mt-2 text-lg text-deep-brown/70">
              Pick the closest match — we&apos;ll fine-tune later.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => selectGrass("st-augustine")}
              className="bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg"
            >
              <div className="w-full h-32 bg-gradient-to-br from-[#4a7c3f] to-[#2d5a27] flex items-center justify-center">
                <span className="text-5xl">🌿</span>
              </div>
              <div className="p-4 text-center">
                <h2 className="font-display font-bold text-deep-brown text-lg">St. Augustine</h2>
                <p className="text-sm text-deep-brown/70 mt-0.5">Wide, flat blades. Popular in the South.</p>
              </div>
            </button>

            <button
              onClick={() => selectGrass("other")}
              className="bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg"
            >
              <div className="w-full h-32 bg-gradient-to-br from-[#6b8e5a] to-[#4a7340] flex items-center justify-center">
                <span className="text-5xl">🌱</span>
              </div>
              <div className="p-4 text-center">
                <h2 className="font-display font-bold text-deep-brown text-lg">Something Else</h2>
                <p className="text-sm text-deep-brown/70 mt-0.5">Bermuda, Zoysia, Fescue, or not sure.</p>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-1.5 text-sm text-deep-brown/50 hover:text-deep-brown py-2 px-4 transition-colors"
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

export default function GrassPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)] overflow-hidden">
          <div className="h-1 bg-deep-brown/10">
            <div className="h-full bg-deep-brown/20 w-1/3" />
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
              </div>
            </div>
          </div>
        </div>
      }
    >
      <GrassSelection />
    </Suspense>
  );
}
