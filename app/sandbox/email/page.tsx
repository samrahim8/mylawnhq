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
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-deep-brown/10">
        <div className="h-full bg-lawn w-2/3 transition-all" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 py-6 lg:max-w-md lg:mx-auto lg:w-full lg:py-16 lg:justify-center">

        {/* Plan ready banner */}
        <div className="bg-lawn rounded-2xl p-4 mb-5 text-white lg:p-5">
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
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-deep-brown/10 lg:p-6">
          <h1 className="font-display text-xl font-bold text-deep-brown mb-1 lg:text-2xl">
            Where should we send it?
          </h1>
          <p className="text-sm text-deep-brown/60 mb-4">
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
              className="w-full px-4 py-4 rounded-xl border-2 border-deep-brown/10 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn text-lg"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full bg-lawn text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 text-base lg:text-lg"
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
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-deep-brown/50">
            <span>✓ 100% free</span>
            <span>✓ No spam</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-auto pt-6 text-center space-y-3 lg:mt-8">
          <p className="text-sm text-deep-brown/50">
            Already have an account?{" "}
            <a href="/login" className="text-lawn font-medium hover:underline">
              Log in
            </a>
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-deep-brown/40 hover:text-deep-brown py-2"
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
