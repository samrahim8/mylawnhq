"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EmailCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const zip = searchParams.get("zip") || "";
  const grass = searchParams.get("grass") || "";
  const grassLabel = grass === "st-augustine" ? "St. Augustine" : "Your lawn";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    localStorage.setItem("lawnhq_guest", JSON.stringify({
      email,
      zipCode: zip,
      grassType: grass === "st-augustine" ? "st-augustine" : "other",
      createdAt: new Date().toISOString(),
    }));

    localStorage.setItem("lawnhq_profile", JSON.stringify({
      zipCode: zip,
      grassType: grass === "st-augustine" ? "st-augustine" : "other",
    }));

    router.push(`/sandbox/path?zip=${zip}&grass=${grass}`);
  };

  return (
    <div className="min-h-dvh bg-cream flex flex-col supports-[min-height:100dvh]:min-h-dvh">
      {/* Progress bar */}
      <div className="h-1 bg-deep-brown/10">
        <div className="h-full bg-lawn w-2/3 transition-all duration-300" />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Content - vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-5 py-6">
          <div className="space-y-6">
            {/* Success banner */}
            <div className="bg-lawn rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">{grassLabel} plan ready</p>
                  <p className="text-sm text-white/80">Personalized for {zip}</p>
                </div>
              </div>
            </div>

            {/* Email form */}
            <div>
              <h1 className="font-display text-2xl font-bold text-deep-brown mb-1 leading-[1.1]">
                Where should we send it?
              </h1>
              <p className="text-base text-deep-brown/70 mb-4">
                We&apos;ll email you the full plan.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="email-mobile" className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Email address
                </label>
                <input
                  id="email-mobile"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@email.com"
                  autoFocus
                  autoComplete="email"
                  autoCapitalize="none"
                  className="w-full h-14 px-4 rounded-2xl border-2 border-deep-brown/10 bg-white text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn focus:ring-0 text-lg"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full h-14 bg-lawn text-white font-bold rounded-2xl active:scale-[0.97] transition-transform duration-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      GET MY PLAN
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Trust signals */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-deep-brown/50">
                <span>✓ 100% free</span>
                <span>✓ No spam</span>
              </div>
            </div>

            {/* Login link */}
            <p className="text-sm text-deep-brown/50 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-lawn font-medium">Log in</a>
            </p>
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
        <div className="w-full max-w-md">
          {/* Success banner */}
          <div className="bg-lawn rounded-2xl p-5 text-white mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold">{grassLabel} plan ready</p>
                <p className="text-sm text-white/80">Personalized for {zip}</p>
              </div>
            </div>
          </div>

          {/* Email form card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-deep-brown/10">
            <h1 className="font-display text-2xl font-bold text-deep-brown mb-1">
              Where should we send it?
            </h1>
            <p className="text-sm text-deep-brown/70 mb-4">
              We&apos;ll email you the full plan.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@email.com"
                autoFocus
                autoComplete="email"
                className="w-full px-4 py-4 rounded-xl border-2 border-deep-brown/10 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn text-lg"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full bg-lawn text-white font-bold py-4 rounded-xl hover:bg-lawn/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    GET MY PLAN
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-deep-brown/50">
              <span>✓ 100% free</span>
              <span>✓ No spam</span>
            </div>
          </div>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-deep-brown/50">
              Already have an account?{" "}
              <a href="/login" className="text-lawn font-medium hover:underline">Log in</a>
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-sm text-deep-brown/40 hover:text-deep-brown py-2 transition-colors"
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

export default function EmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-cream flex flex-col">
          <div className="h-1 bg-deep-brown/10">
            <div className="h-full bg-lawn/50 w-2/3" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-5 py-6">
            <div className="space-y-6 animate-pulse">
              <div className="h-24 bg-lawn/20 rounded-2xl" />
              <div>
                <div className="h-7 bg-deep-brown/10 rounded-lg w-3/4" />
                <div className="h-4 bg-deep-brown/10 rounded-lg w-1/2 mt-2" />
                <div className="h-14 bg-deep-brown/10 rounded-2xl mt-4" />
                <div className="h-14 bg-deep-brown/10 rounded-2xl mt-3" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EmailCapture />
    </Suspense>
  );
}
