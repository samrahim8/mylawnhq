"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function SaveFlow() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // In a real implementation, this would call Supabase to create the account
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">&#127793;</div>
          <h2 className="font-display text-2xl font-bold text-deep-brown mb-3">
            Plan Saved!
          </h2>
          <p className="text-deep-brown/60 mb-8">
            We&rsquo;ve sent a confirmation to {email}. Your personalized 90-day
            plan is ready whenever you are.
          </p>

          {/* Upsell */}
          <div className="bg-white rounded-xl border border-deep-brown/10 p-6 text-left mb-6">
            <h3 className="font-display font-semibold text-deep-brown mb-3">
              Unlock Pro
            </h3>
            <p className="text-sm text-deep-brown/60 mb-4">
              You&rsquo;re on the free plan. Upgrade to unlock:
            </p>
            <ul className="space-y-2 text-sm text-deep-brown/70 mb-5">
              {[
                "Unlimited AI lawn expert chat",
                "Photo diagnosis (snap a pic, get answers)",
                "Product recommendations with buy links",
                "Spreader calculator",
                "Push notifications for weather alerts",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-deep-brown mb-4">
              $9/month or $79/year{" "}
              <span className="text-ochre font-normal">(save 27%)</span>
            </p>
            <button className="w-full bg-terracotta text-white font-semibold py-3 rounded-lg text-sm hover:bg-terracotta/90 transition-colors">
              START 7-DAY FREE TRIAL &rarr;
            </button>
            <p className="text-xs text-deep-brown/40 text-center mt-2">
              Cancel anytime. No questions asked.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-deep-brown/10" />
            <span className="text-xs text-deep-brown/40">
              or continue with free plan
            </span>
            <div className="flex-1 h-px bg-deep-brown/10" />
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-lawn text-white font-semibold py-3 rounded-lg text-sm hover:bg-lawn/90 transition-colors"
          >
            GO TO MY DASHBOARD &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
            Save your personalized plan
          </h2>
          <p className="mt-3 text-deep-brown/60">Enter your email to:</p>
          <ul className="mt-3 space-y-1.5 text-sm text-deep-brown/70">
            <li>Save your plan and lawn photo</li>
            <li>Get reminders when tasks are due</li>
            <li>Track your progress over time</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-deep-brown/10 p-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-deep-brown/70 mb-2"
          >
            Email address
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
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full bg-terracotta text-white font-semibold py-3.5 rounded-lg text-sm hover:bg-terracotta/90 transition-colors tracking-wide"
          >
            SAVE MY PLAN & CREATE ACCOUNT &rarr;
          </button>

          <p className="mt-3 text-xs text-deep-brown/40 text-center">
            By continuing, you agree to our Terms and Privacy Policy. We&rsquo;ll
            never spam you.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SavePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <SaveFlow />
    </Suspense>
  );
}
