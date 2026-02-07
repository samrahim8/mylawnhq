"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

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
      {/* Nav */}
      <nav className="px-4 py-3 flex items-center justify-between lg:max-w-6xl lg:mx-auto lg:w-full lg:px-8 lg:py-5">
        <Logo />
        <a href="/login" className="text-sm text-deep-brown/60 hover:text-deep-brown">
          Log In
        </a>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-4 pb-6 lg:max-w-6xl lg:mx-auto lg:w-full lg:px-8 lg:py-16">

        {/* Mobile Layout */}
        <div className="flex-1 flex flex-col lg:hidden">
          {/* Hero text */}
          <div className="pt-4 pb-6">
            <h1 className="font-display text-[28px] font-bold text-deep-brown leading-[1.15] tracking-tight">
              YOUR LAWN CALLED.<br />IT WANTS A PLAN.
            </h1>
            <p className="mt-3 text-base text-deep-brown/70 leading-relaxed">
              Get a week-by-week playbook tuned to your zip code, soil temps, and local weeds.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-deep-brown/10">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="Enter your zip code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full px-4 py-4 rounded-xl border-2 border-deep-brown/10 bg-cream/50 text-deep-brown text-lg text-center placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn transition-colors"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
              <button
                type="submit"
                className="mt-3 w-full bg-terracotta text-white font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-transform"
              >
                GET MY FREE PLAN →
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-sm text-deep-brown/50">
              <span className="text-ochre">★★★★★</span>
              <span>12,000+ homeowners</span>
            </div>
          </div>

          {/* Value props */}
          <div className="mt-6 space-y-2">
            {[
              "Tells you exactly which products to buy",
              "Timed to your local weather & soil temps",
              "100% free — no credit card required",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 text-sm text-deep-brown/70">
                <svg className="w-5 h-5 text-lawn flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:flex-1">
          {/* Left column */}
          <div>
            <h1 className="font-display text-5xl xl:text-6xl font-bold text-deep-brown leading-[1.1] tracking-tight">
              YOUR LAWN CALLED.<br />IT WANTS A PLAN.
            </h1>
            <p className="mt-6 text-xl text-deep-brown/70 leading-relaxed">
              Get a week-by-week playbook tuned to your frost dates, soil temps, and the weeds that hit your zip code hardest.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Tells you exactly which bag to grab at the store",
                "Timed to your local weather and soil temps",
                "No credit card required",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-deep-brown/80">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lawn/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mt-10 text-sm text-deep-brown/60">
              <span className="text-ochre">★★★★★</span>
              <span>Trusted by 12,000+ homeowners · 4.9 average rating</span>
            </div>
          </div>

          {/* Right column - CTA card */}
          <div className="w-full max-w-md ml-auto">
            <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-xl p-8">
              <h2 className="font-display font-bold text-deep-brown text-xl mb-1">
                30-Second Setup
              </h2>
              <p className="text-sm text-deep-brown/50 mb-6">
                Enter your zip and we&apos;ll build your plan.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="zip-desktop" className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Zip code
                </label>
                <input
                  id="zip-desktop"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="e.g. 78701"
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-deep-brown/10 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:border-lawn transition-colors"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full bg-terracotta text-white font-bold py-4 rounded-xl hover:bg-terracotta/90 transition-colors"
                >
                  GET MY FREE PLAN →
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
