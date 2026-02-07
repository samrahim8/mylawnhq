"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GrassSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";

  const selectGrass = (type: "st-augustine" | "other") => {
    router.push(`/sandbox/email?zip=${zip}&grass=${type}`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-deep-brown/10">
        <div className="h-full bg-lawn w-1/3 transition-all" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6 lg:max-w-2xl lg:mx-auto lg:w-full lg:py-16">
        {/* Header */}
        <div className="mb-6 lg:text-center lg:mb-10">
          <h1 className="font-display text-[28px] lg:text-4xl font-bold text-deep-brown leading-tight">
            What type of grass?
          </h1>
          <p className="mt-2 text-deep-brown/60 lg:text-lg">
            Pick the closest match — we&apos;ll fine-tune later.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {/* St. Augustine */}
          <button
            onClick={() => selectGrass("st-augustine")}
            className="w-full bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg active:scale-[0.98] lg:active:scale-100"
          >
            <div className="flex items-center p-4 lg:flex-col lg:p-0">
              {/* Icon */}
              <div className="w-16 h-16 lg:w-full lg:h-32 bg-gradient-to-br from-[#4a7c3f] to-[#2d5a27] rounded-xl lg:rounded-none flex items-center justify-center flex-shrink-0">
                <span className="text-3xl lg:text-5xl">🌿</span>
              </div>
              {/* Text */}
              <div className="flex-1 ml-4 text-left lg:ml-0 lg:p-4 lg:text-center">
                <h2 className="font-display font-bold text-deep-brown text-lg">
                  St. Augustine
                </h2>
                <p className="text-sm text-deep-brown/60 mt-0.5">
                  Wide, flat blades. Popular in the South.
                </p>
              </div>
              {/* Chevron - mobile only */}
              <svg className="w-5 h-5 text-deep-brown/30 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Other */}
          <button
            onClick={() => selectGrass("other")}
            className="w-full bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg active:scale-[0.98] lg:active:scale-100"
          >
            <div className="flex items-center p-4 lg:flex-col lg:p-0">
              {/* Icon */}
              <div className="w-16 h-16 lg:w-full lg:h-32 bg-gradient-to-br from-[#6b8e5a] to-[#4a7340] rounded-xl lg:rounded-none flex items-center justify-center flex-shrink-0">
                <span className="text-3xl lg:text-5xl">🌱</span>
              </div>
              {/* Text */}
              <div className="flex-1 ml-4 text-left lg:ml-0 lg:p-4 lg:text-center">
                <h2 className="font-display font-bold text-deep-brown text-lg">
                  Something Else
                </h2>
                <p className="text-sm text-deep-brown/60 mt-0.5">
                  Bermuda, Zoysia, Fescue, or not sure.
                </p>
              </div>
              {/* Chevron - mobile only */}
              <svg className="w-5 h-5 text-deep-brown/30 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Back */}
        <div className="mt-auto pt-8 text-center lg:mt-12">
          <button
            onClick={() => router.push("/sandbox")}
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

export default function GrassPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <GrassSelection />
    </Suspense>
  );
}
