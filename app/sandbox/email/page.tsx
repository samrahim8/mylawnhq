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

      // Create account
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
        // Check if user already exists
        if (signUpError.message.includes("already registered")) {
          // Try to sign in instead
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

      // Store onboarding data in localStorage for the product to pick up
      localStorage.setItem("lawnhq_onboarding", JSON.stringify({
        zipCode: zip,
        grassType: grass === "st-augustine" ? "st-augustine" : "other",
        pending: true,
      }));

      // Redirect to the product
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

      // Store onboarding data before OAuth redirect
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
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-sm text-lawn font-medium mb-2">Almost there</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
              Your plan is ready.
            </h1>
            <p className="mt-3 text-deep-brown/70 leading-relaxed">
              We've built a week-by-week playbook for <span className="font-medium text-deep-brown">{zip || "your area"}</span>.<br className="hidden sm:block" />
              Create a free account to unlock it.
            </p>
          </div>

          {/* Value props */}
          <div className="bg-lawn/5 border border-lawn/10 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-lawn/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-deep-brown">What you'll get:</p>
                <ul className="mt-1.5 text-deep-brown/60 space-y-1">
                  <li>• Exact products to buy (no guessing at the store)</li>
                  <li>• Timing based on your local soil temps</li>
                  <li>• AI advisor that knows your lawn</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-deep-brown/10 p-6 shadow-sm">
            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-deep-brown/15 text-deep-brown font-medium py-3 rounded-lg hover:bg-cream/50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-deep-brown/10" />
              <span className="text-xs text-deep-brown/40">or</span>
              <div className="flex-1 h-px bg-deep-brown/10" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-deep-brown/70 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-deep-brown/15 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:ring-2 focus:ring-lawn/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-deep-brown/70 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 rounded-lg border border-deep-brown/15 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:ring-2 focus:ring-lawn/30"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full bg-lawn text-white font-semibold py-3.5 rounded-lg hover:bg-lawn/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Unlocking your plan..."
                ) : (
                  <>
                    Get My Lawn Plan
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-deep-brown/40 text-center">
              Free forever for basic features. No credit card required.
            </p>
          </div>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-deep-brown/60">
            Already have an account?{" "}
            <a href="/login" className="text-terracotta font-medium hover:underline">
              Log in
            </a>
          </p>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
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
