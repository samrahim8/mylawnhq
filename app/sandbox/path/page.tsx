"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PathSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
              How would you like to get started?
            </h1>
            <p className="mt-2 text-deep-brown/60">
              Either way, Ace will build you a free 90-day plan.
            </p>
          </div>

          <div className="space-y-4">
            {/* Novice path */}
            <button
              onClick={() => router.push(`/sandbox/onboarding?zip=${zip}`)}
              className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-5 sm:p-6 text-left transition-all hover:border-lawn/50 hover:shadow-md group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-lawn/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">&#127793;</span>
                </div>
                <div>
                  <h2 className="font-display font-semibold text-deep-brown text-lg">
                    Guide me through it
                  </h2>
                  <p className="mt-1 text-sm text-deep-brown/60 leading-relaxed">
                    Answer 4 quick questions and Ace will build your plan. Takes 30 seconds.
                    Perfect if you&rsquo;re not sure about your grass type or
                    where to start.
                  </p>
                  <span className="inline-block mt-3 text-sm font-medium text-terracotta group-hover:underline">
                    Start quick setup &rarr;
                  </span>
                </div>
              </div>
            </button>

            {/* Expert path */}
            <button
              onClick={() => router.push(`/sandbox/expert?zip=${zip}`)}
              className="w-full bg-white rounded-xl border-2 border-deep-brown/10 p-5 sm:p-6 text-left transition-all hover:border-lawn/50 hover:shadow-md group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-ochre/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">&#128736;&#65039;</span>
                </div>
                <div>
                  <h2 className="font-display font-semibold text-deep-brown text-lg">
                    I already know my lawn
                  </h2>
                  <p className="mt-1 text-sm text-deep-brown/60 leading-relaxed">
                    Fill in the details yourself&mdash;grass type, equipment,
                    issues, soil info. The more you share, the better your plan.
                  </p>
                  <span className="inline-block mt-3 text-sm font-medium text-terracotta group-hover:underline">
                    Go to detailed form &rarr;
                  </span>
                </div>
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
