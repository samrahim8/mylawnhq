"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SandboxHero() {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit zip code");
      return;
    }
    router.push(`/sandbox/path?zip=${zip}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lawn text-xl">&#127793;</span>
          <span className="font-display font-bold text-deep-brown text-xl tracking-tight">
            LawnHQ
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-deep-brown/70">
          <a href="/dashboard" className="hover:text-deep-brown transition-colors">
            Demo
          </a>
          <a href="/login" className="hover:text-deep-brown transition-colors">
            Log In
          </a>
          <a
            href="/signup"
            className="bg-lawn text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lawn/90 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 lg:pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-deep-brown leading-[1.1] tracking-tight">
              YOUR LAWN CALLED.<br className="hidden lg:block" /> IT WANTS A PLAN.
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-deep-brown/70 leading-relaxed">
              Get a week-by-week playbook tuned to your frost dates, soil temps, and the weeds that hit your zip code hardest.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Tells you exactly which bag to grab at the store",
                "Timed to your local weather and soil temps",
                "No credit card required",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-deep-brown/80"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lawn/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-lawn"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>


            {/* Social proof - visible on mobile below the card, on desktop here */}
            <div className="hidden lg:flex items-center gap-3 mt-10 text-sm text-deep-brown/60">
              <div className="flex text-ochre">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span>
                Trusted by 12,000+ homeowners &middot; 4.9 average rating
              </span>
            </div>
          </div>

          {/* Right column - CTA card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-lg p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lawn text-lg">&#127793;</span>
                  <h2 className="font-display font-semibold text-deep-brown text-lg">
                    30-Second Setup
                  </h2>
                </div>
                <p className="mt-1 text-sm text-deep-brown/50">
                  Enter your zip and we&rsquo;ll build your plan.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-deep-brown/70 mb-2"
                >
                  Zip code
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="e.g. 78701"
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-deep-brown/15 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/50 transition-colors"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  className="mt-4 w-full bg-terracotta text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-terracotta/90 active:bg-terracotta/80 transition-colors text-sm tracking-wide"
                >
                  GET MY FREE PLAN &rarr;
                </button>
              </form>

            </div>
          </div>
        </div>

        {/* Social proof - mobile */}
        <div className="flex lg:hidden items-center justify-center gap-3 mt-10 text-sm text-deep-brown/60">
          <div className="flex text-ochre">
            {"★★★★★".split("").map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <span>12,000+ homeowners</span>
        </div>
      </main>
    </div>
  );
}
