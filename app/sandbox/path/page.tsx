"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PathSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";
  const grass = searchParams.get("grass") || "";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-deep-brown/10">
        <div className="h-full bg-lawn w-3/4 transition-all" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6 lg:max-w-lg lg:mx-auto lg:w-full lg:py-16 lg:justify-center">

        {/* Header */}
        <div className="mb-6 lg:text-center lg:mb-8">
          <h1 className="font-display text-[28px] lg:text-4xl font-bold text-deep-brown leading-tight">
            Almost there!
          </h1>
          <p className="mt-2 text-deep-brown/70 lg:text-lg">
            2 quick questions to personalize your plan.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => router.push(`/sandbox/onboarding?zip=${zip}&grass=${grass}`)}
          className="w-full bg-lawn text-white rounded-2xl p-5 text-left transition-all active:scale-[0.98] shadow-lg mb-3 lg:p-6 lg:hover:bg-lawn/90"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl lg:text-2xl">
                Let&apos;s do it
              </h2>
              <p className="mt-1 text-white/80 lg:text-lg">
                Takes 30 seconds
              </p>
            </div>
            <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Secondary option */}
        <button
          onClick={() => router.push(`/sandbox/expert?zip=${zip}&grass=${grass}`)}
          className="w-full bg-white border-2 border-deep-brown/10 rounded-2xl p-4 text-left transition-all active:scale-[0.98] lg:hover:border-deep-brown/20 lg:hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-deep-brown text-lg">
                I want to add more details
              </h2>
              <p className="text-sm text-deep-brown/60 mt-0.5">
                Equipment, soil type, known issues
              </p>
            </div>
            <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Back */}
        <div className="mt-auto pt-8 text-center lg:mt-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-deep-brown/50 hover:text-deep-brown py-2 px-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <PathSelection />
    </Suspense>
  );
}
