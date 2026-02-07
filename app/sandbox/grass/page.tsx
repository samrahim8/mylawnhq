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
      <div className="w-full bg-deep-brown/5">
        <div className="h-1 bg-lawn w-1/3" />
      </div>

      <div className="flex-1 flex flex-col px-4 py-6 sm:py-12 sm:justify-center">
        <div className="w-full max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 sm:text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
              What type of grass?
            </h1>
            <p className="mt-2 text-deep-brown/60 text-sm sm:text-base">
              Pick the closest match — we&apos;ll fine-tune later.
            </p>
          </div>

          {/* Cards - stack on mobile, side by side on desktop */}
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
            {/* St. Augustine */}
            <button
              onClick={() => selectGrass("st-augustine")}
              className="group w-full bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lawn/50 active:scale-[0.98]"
            >
              <div className="flex sm:flex-col">
                {/* Image - horizontal on mobile, full width on desktop */}
                <div className="w-28 sm:w-full aspect-square sm:aspect-[4/3] relative bg-gradient-to-br from-[#4a7c3f] to-[#2d5a27] flex items-center justify-center flex-shrink-0">
                  <div className="relative z-10 text-center text-white">
                    <div className="text-4xl sm:text-5xl">🌿</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 text-left flex flex-col justify-center">
                  <h2 className="font-display font-bold text-deep-brown text-lg">
                    St. Augustine
                  </h2>
                  <p className="mt-1 text-sm text-deep-brown/60">
                    Wide, flat blades. Popular in the South.
                  </p>
                </div>
                {/* Chevron on mobile */}
                <div className="sm:hidden flex items-center pr-4">
                  <svg className="w-5 h-5 text-deep-brown/30 group-hover:text-lawn transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Other grass types */}
            <button
              onClick={() => selectGrass("other")}
              className="group w-full bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lawn/50 active:scale-[0.98]"
            >
              <div className="flex sm:flex-col">
                {/* Image */}
                <div className="w-28 sm:w-full aspect-square sm:aspect-[4/3] relative bg-gradient-to-br from-[#6b8e5a] to-[#4a7340] flex items-center justify-center flex-shrink-0">
                  <div className="relative z-10 text-center text-white">
                    <div className="text-4xl sm:text-5xl">🌱</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 text-left flex flex-col justify-center">
                  <h2 className="font-display font-bold text-deep-brown text-lg">
                    Something Else
                  </h2>
                  <p className="mt-1 text-sm text-deep-brown/60">
                    Bermuda, Zoysia, Fescue, or not sure.
                  </p>
                </div>
                {/* Chevron on mobile */}
                <div className="sm:hidden flex items-center pr-4">
                  <svg className="w-5 h-5 text-deep-brown/30 group-hover:text-lawn transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/sandbox")}
              className="inline-flex items-center gap-1 text-sm text-deep-brown/50 hover:text-deep-brown transition-colors py-2 px-4"
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
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <GrassSelection />
    </Suspense>
  );
}
