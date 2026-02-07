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
      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden">
        {/* Nav */}
        <nav className="flex items-center justify-between px-5 py-4">
          <Logo />
          <a href="/login" className="text-sm text-deep-brown/60">Log In</a>
        </nav>

        {/* Hero content - vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          <div className="space-y-6">
            {/* Headline */}
            <div>
              <h1 className="font-display text-[32px] font-bold text-deep-brown leading-[1.1] tracking-tight">
                YOUR LAWN CALLED.<br />IT WANTS A PLAN.
              </h1>
              <p className="mt-3 text-base text-deep-brown/70 leading-relaxed">
                Get a personalized playbook tuned to your zip code, weather, and grass type.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-3 pt-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="Enter zip code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full h-14 px-4 rounded-2xl border-2 border-deep-brown/15 bg-white text-deep-brown text-lg text-center placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn transition-colors"
              />
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-14 bg-terracotta text-white font-bold rounded-2xl text-base active:scale-[0.98] transition-transform"
              >
                GET MY FREE PLAN →
              </button>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-sm text-deep-brown/60">
                <span className="text-ochre">★★★★★</span>
                <span>Trusted by 12,000+ homeowners</span>
              </div>
            </div>

            {/* Value props */}
            <div className="space-y-2 pt-2">
              {[
                "✓ Exact products to buy at the store",
                "✓ Timed to your local weather",
                "✓ 100% free, no credit card",
              ].map((text) => (
                <p key={text} className="text-sm text-deep-brown/60">{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-col lg:min-h-screen">
        <nav className="max-w-6xl mx-auto w-full px-8 py-5 flex items-center justify-between">
          <Logo />
          <a href="/login" className="text-sm text-deep-brown/60 hover:text-deep-brown">Log In</a>
        </nav>

        <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12 grid grid-cols-2 gap-16 items-center">
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
                  <span className="w-5 h-5 rounded-full bg-lawn/10 flex items-center justify-center flex-shrink-0">
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
              <span>Trusted by 12,000+ homeowners · 4.9 rating</span>
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
}
