"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PathSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";
  const grass = searchParams.get("grass") || "";

  return (
    <div className="min-h-dvh bg-cream flex flex-col supports-[min-height:100dvh]:min-h-dvh pt-[env(safe-area-inset-top)]">
      {/* Progress bar - below safe area */}
      <div className="h-1 bg-deep-brown/10">
        <div className="h-full bg-lawn w-3/4 transition-all duration-300" />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Content - vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-display text-[28px] font-bold text-deep-brown leading-[1.1]">
                Almost there!
              </h1>
              <p className="mt-2 text-base text-deep-brown/70">
                2 quick questions to personalize your plan.
              </p>
            </div>

            {/* CTAs - primary action is prominent */}
            <div className="space-y-3">
              {/* Primary CTA */}
              <button
                onClick={() => router.push(`/sandbox/onboarding?zip=${zip}&grass=${grass}`)}
                className="w-full bg-lawn text-white rounded-2xl p-5 text-left transition-all active:scale-[0.97] duration-100 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-xl">Let&apos;s do it</h2>
                    <p className="mt-1 text-white/80">Takes 30 seconds</p>
                  </div>
                  <svg className="w-6 h-6 text-white/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Secondary option */}
              <button
                onClick={() => router.push(`/sandbox/expert?zip=${zip}&grass=${grass}`)}
                className="w-full bg-white border-2 border-deep-brown/10 rounded-2xl p-4 text-left transition-all active:scale-[0.97] duration-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-deep-brown text-lg">I want to add more details</h2>
                    <p className="text-sm text-deep-brown/70 mt-0.5">Equipment, soil type, known issues</p>
                  </div>
                  <svg className="w-5 h-5 text-deep-brown/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Back button - fixed to bottom thumb zone */}
        <div className="px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={() => router.back()}
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
        <div className="w-full max-w-lg text-center">
          <h1 className="font-display text-4xl font-bold text-deep-brown leading-[1.1]">
            Almost there!
          </h1>
          <p className="mt-2 text-lg text-deep-brown/70">
            2 quick questions to personalize your plan.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push(`/sandbox/onboarding?zip=${zip}&grass=${grass}`)}
              className="w-full bg-lawn text-white rounded-2xl p-6 text-left transition-all hover:bg-lawn/90 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-2xl">Let&apos;s do it</h2>
                  <p className="mt-1 text-white/80 text-lg">Takes 30 seconds</p>
                </div>
                <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => router.push(`/sandbox/expert?zip=${zip}&grass=${grass}`)}
              className="w-full bg-white border-2 border-deep-brown/10 rounded-2xl p-4 text-left transition-all hover:border-deep-brown/20 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-deep-brown text-lg">I want to add more details</h2>
                  <p className="text-sm text-deep-brown/70 mt-0.5">Equipment, soil type, known issues</p>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <div className="mt-12">
            <button
              onClick={() => router.back()}
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

export default function PathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-cream flex flex-col pt-[env(safe-area-inset-top)]">
          <div className="h-1 bg-deep-brown/10">
            <div className="h-full bg-lawn/50 w-3/4" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-5 py-6">
            <div className="space-y-6 animate-pulse">
              <div>
                <div className="h-8 bg-deep-brown/10 rounded-lg w-1/2" />
                <div className="h-4 bg-deep-brown/10 rounded-lg w-3/4 mt-3" />
              </div>
              <div className="space-y-3">
                <div className="h-24 bg-lawn/20 rounded-2xl" />
                <div className="h-20 bg-deep-brown/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PathSelection />
    </Suspense>
  );
}
