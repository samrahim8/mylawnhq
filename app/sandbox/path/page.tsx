"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PathSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";
  const grass = searchParams.get("grass") || "";
  const grassLabel = grass === "st-augustine" ? "St. Augustine" : "your lawn";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-deep-brown/50 mb-2">
              <span>Building your plan</span>
              <span>Almost done</span>
            </div>
            <div className="h-2 bg-deep-brown/10 rounded-full overflow-hidden">
              <div className="h-full bg-lawn rounded-full w-[75%] transition-all" />
            </div>
          </div>

          {/* What we know card */}
          <div className="bg-lawn/5 border border-lawn/15 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-lawn font-medium mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              What we know so far
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center bg-white text-deep-brown text-xs font-medium px-2.5 py-1 rounded-full border border-deep-brown/10">
                📍 {zip}
              </span>
              <span className="inline-flex items-center bg-white text-deep-brown text-xs font-medium px-2.5 py-1 rounded-full border border-deep-brown/10">
                🌱 {grassLabel}
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
              2 more questions to personalize your plan
            </h1>
            <p className="mt-2 text-deep-brown/60">
              Takes 30 seconds. Makes your plan 10x more useful.
            </p>
          </div>

          {/* Primary CTA - Quick path */}
          <button
            onClick={() => router.push(`/sandbox/onboarding?zip=${zip}&grass=${grass}`)}
            className="w-full bg-lawn text-white rounded-xl p-5 text-left transition-all hover:bg-lawn/90 shadow-sm mb-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">
                  Let&apos;s do it
                </h2>
                <p className="mt-1 text-sm text-white/80">
                  Lawn size + your goal. That&apos;s it.
                </p>
              </div>
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Secondary option */}
          <button
            onClick={() => router.push(`/sandbox/expert?zip=${zip}&grass=${grass}`)}
            className="w-full bg-white border border-deep-brown/10 rounded-xl p-4 text-left transition-all hover:border-deep-brown/20 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-deep-brown text-sm">
                  I want to add more details
                </h2>
                <p className="mt-0.5 text-xs text-deep-brown/50">
                  Equipment, soil type, known issues
                </p>
              </div>
              <svg className="w-4 h-4 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-deep-brown/40 hover:text-deep-brown transition-colors"
            >
              ← Back
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
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <PathSelection />
    </Suspense>
  );
}
