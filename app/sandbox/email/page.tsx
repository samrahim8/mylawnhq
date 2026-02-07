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
  const grassLabel = grass === "st-augustine" ? "St. Augustine" : "your lawn";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Store as guest user - no account created yet
    localStorage.setItem("lawnhq_guest", JSON.stringify({
      email,
      zipCode: zip,
      grassType: grass === "st-augustine" ? "st-augustine" : "other",
      createdAt: new Date().toISOString(),
    }));

    // Also store in the profile for the app to use
    localStorage.setItem("lawnhq_profile", JSON.stringify({
      zipCode: zip,
      grassType: grass === "st-augustine" ? "st-augustine" : "other",
    }));

    // Send them to choose their onboarding path
    router.push(`/sandbox/path?zip=${zip}&grass=${grass}`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">

          {/* Plan Preview Card */}
          <div className="bg-gradient-to-br from-lawn to-lawn/80 rounded-2xl p-5 sm:p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your plan is ready
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold mb-4">
              {grassLabel} care plan for {zip || "your area"}
            </h1>

            {/* Preview items */}
            <div className="space-y-2.5">
              {[
                { icon: "📅", text: "Week-by-week schedule through the season" },
                { icon: "🛒", text: "Exact products to grab at the store" },
                { icon: "🌡️", text: "Timed to your local soil temps & frost dates" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl border border-deep-brown/10 p-5 sm:p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="block text-sm font-medium text-deep-brown mb-2">
                Where should we send your plan?
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@email.com"
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl border border-deep-brown/15 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/30 text-lg"
              />

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-lawn text-white font-semibold py-4 rounded-xl hover:bg-lawn/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading your plan...
                  </>
                ) : (
                  <>
                    See My Plan
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Trust signals */}
            <div className="mt-5 pt-4 border-t border-deep-brown/5 flex items-center justify-center gap-4 text-xs text-deep-brown/40">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                100% free
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                No spam
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant access
              </span>
            </div>
          </div>

          {/* Already have account */}
          <p className="mt-5 text-center text-sm text-deep-brown/50">
            Already have an account?{" "}
            <a href="/login" className="text-lawn font-medium hover:underline">
              Log in
            </a>
          </p>

          {/* Back link */}
          <div className="mt-4 text-center">
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

export default function EmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <EmailCapture />
    </Suspense>
  );
}
