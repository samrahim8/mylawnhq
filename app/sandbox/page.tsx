"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, LogoIcon } from "@/components/Logo";

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
    router.push(`/sandbox/grass?zip=${zip}`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav - minimal on mobile */}
      <nav className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo />
        <div className="hidden sm:flex items-center gap-6 text-sm text-deep-brown/70">
          <a href="/login" className="hover:text-deep-brown transition-colors">
            Log In
          </a>
        </div>
      </nav>

      {/* Hero - Mobile first: CTA card at top */}
      <main className="flex-1 flex flex-col lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pt-12 lg:pb-16">

        {/* Mobile: Hero + CTA */}
        <div className="lg:hidden w-full mb-6">
          {/* Hero headline */}
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-deep-brown leading-tight tracking-tight">
              YOUR LAWN CALLED.<br />IT WANTS A PLAN.
            </h1>
            <p className="mt-3 text-deep-brown/70">
              Week-by-week playbook tuned to your zip code.
            </p>
          </div>

          {/* CTA card */}
          <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-lg p-5">
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-deep-brown/70 mb-2 text-center">
                Enter your zip to get started
              </label>
              <input
                id="zip-mobile"
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="e.g. 78701"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full px-4 py-4 rounded-xl border border-deep-brown/15 bg-cream/50 text-deep-brown text-lg text-center placeholder:text-deep-brown/40 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/50 transition-colors"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="mt-4 w-full bg-terracotta text-white font-bold py-4 px-6 rounded-xl hover:bg-terracotta/90 active:scale-[0.98] transition-all text-base"
              >
                GET MY FREE PLAN →
              </button>
            </form>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-deep-brown/50">
              <div className="flex text-ochre text-sm">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span>12,000+ homeowners</span>
            </div>
          </div>

          {/* Value props */}
          <div className="mt-6 space-y-2.5">
            {[
              { icon: "🛒", text: "Tells you exactly which bag to grab" },
              { icon: "🌡️", text: "Timed to your local weather & soil temps" },
              { icon: "✓", text: "100% free, no credit card" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-sm text-deep-brown/70"
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Two column layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div className="max-w-xl">
            <h1 className="font-display text-5xl lg:text-[3.5rem] font-bold text-deep-brown leading-[1.1] tracking-tight">
              YOUR LAWN CALLED.<br /> IT WANTS A PLAN.
            </h1>
            <p className="mt-5 text-xl text-deep-brown/70 leading-relaxed">
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

            <div className="flex items-center gap-3 mt-10 text-sm text-deep-brown/60">
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
          <div className="w-full max-w-md ml-auto">
            <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <LogoIcon className="w-5 h-5" />
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
      </main>
    </div>
  );
}
