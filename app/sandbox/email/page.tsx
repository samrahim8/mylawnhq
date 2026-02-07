"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function EmailCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            zip_code: zip,
            grass_type: grass === "st-augustine" ? "st-augustine" : "other",
            onboarding_pending: true,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            setError("Account exists. Please check your password or sign in.");
            setLoading(false);
            return;
          }
        } else {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      localStorage.setItem("lawnhq_onboarding", JSON.stringify({
        zipCode: zip,
        grassType: grass === "st-augustine" ? "st-augustine" : "other",
        pending: true,
      }));

      router.push("/home?onboarding=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      localStorage.setItem("lawnhq_onboarding", JSON.stringify({
        zipCode: zip,
        grassType: grass === "st-augustine" ? "st-augustine" : "other",
        pending: true,
      }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/home?onboarding=true`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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

          {/* Signup Card */}
          <div className="bg-white rounded-2xl border border-deep-brown/10 p-5 sm:p-6 shadow-sm">
            <p className="text-center text-deep-brown/60 text-sm mb-5">
              Create a free account to unlock your plan
            </p>

            {/* Google Sign Up - Primary CTA */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-deep-brown text-white font-medium py-3.5 rounded-xl hover:bg-deep-brown/90 transition-colors disabled:opacity-50 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-deep-brown/10" />
              <span className="text-xs text-deep-brown/40">or use email</span>
              <div className="flex-1 h-px bg-deep-brown/10" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl border border-deep-brown/15 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/30"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-xl border border-deep-brown/15 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/30"
                />
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-lawn text-white font-semibold py-3.5 rounded-xl hover:bg-lawn/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating your plan...
                  </>
                ) : (
                  <>
                    Get My Plan
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                No credit card
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
