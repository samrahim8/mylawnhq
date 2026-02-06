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
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <p className="text-sm text-deep-brown/50 mb-2">Step 2 of 3</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
              What type of grass do you have?
            </h1>
            <p className="mt-2 text-deep-brown/60">
              This helps us tailor your care plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* St. Augustine */}
            <button
              onClick={() => selectGrass("st-augustine")}
              className="group relative bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lawn/50"
            >
              <div className="aspect-[4/3] relative bg-gradient-to-br from-[#4a7c3f] to-[#2d5a27] flex items-center justify-center">
                {/* Decorative grass pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <pattern id="grass1" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M5 20 Q7 10 10 0 M10 20 Q12 8 15 0 M15 20 Q17 12 20 0" stroke="white" strokeWidth="2" fill="none"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grass1)"/>
                  </svg>
                </div>
                <div className="relative z-10 text-center text-white">
                  <div className="text-5xl mb-2">&#127811;</div>
                  <span className="text-sm font-medium opacity-90">Wide blades</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-4 text-left">
                <h2 className="font-display font-semibold text-deep-brown text-lg">
                  St. Augustine
                </h2>
                <p className="mt-1 text-sm text-deep-brown/60">
                  Wide, flat blades with rounded tips. Popular in the South.
                </p>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white bg-white/20 group-hover:bg-lawn group-hover:border-lawn transition-colors flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>

            {/* Other grass types */}
            <button
              onClick={() => selectGrass("other")}
              className="group relative bg-white rounded-2xl border-2 border-deep-brown/10 overflow-hidden transition-all hover:border-lawn hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lawn/50"
            >
              <div className="aspect-[4/3] relative bg-gradient-to-br from-[#6b8e5a] to-[#4a7340] flex items-center justify-center">
                {/* Decorative grass pattern - finer blades */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <pattern id="grass2" width="10" height="20" patternUnits="userSpaceOnUse">
                      <path d="M2 20 Q3 10 5 0 M5 20 Q6 8 8 0" stroke="white" strokeWidth="1" fill="none"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grass2)"/>
                  </svg>
                </div>
                <div className="relative z-10 text-center text-white">
                  <div className="text-5xl mb-2">&#127807;</div>
                  <span className="text-sm font-medium opacity-90">Fine to medium blades</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-4 text-left">
                <h2 className="font-display font-semibold text-deep-brown text-lg">
                  Something Else
                </h2>
                <p className="mt-1 text-sm text-deep-brown/60">
                  Bermuda, Zoysia, Fescue, or not sure yet.
                </p>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white bg-white/20 group-hover:bg-lawn group-hover:border-lawn transition-colors flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/sandbox")}
              className="text-sm text-deep-brown/50 hover:text-deep-brown transition-colors"
            >
              &larr; Back
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
