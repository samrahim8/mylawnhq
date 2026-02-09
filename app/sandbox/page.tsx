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
    <div className="bg-cream flex flex-col h-dvh overflow-hidden">
      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        {/* Nav */}
        <nav className="flex items-center justify-between px-5 pt-[max(12px,env(safe-area-inset-top))] pb-2">
          <Logo />
          <a href="/login" className="text-sm text-deep-brown/70 min-h-[44px] min-w-[44px] flex items-center justify-end">
            Log In
          </a>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex flex-col justify-center px-5 min-h-0">
          <div className="space-y-3">
            <div>
              <h1 className="font-display text-[28px] font-bold text-deep-brown leading-[1.1] tracking-tight">
                YOUR LAWN CALLED.<br />IT WANTS A PLAN.
              </h1>
              <p className="mt-2 text-sm text-deep-brown/70 leading-relaxed max-w-[320px]">
                Get a personalized playbook tuned to your zip code, weather, and grass type.
              </p>
            </div>

            <div className="space-y-2">
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
                className="w-full h-12 px-4 rounded-2xl border-2 border-deep-brown/15 bg-white text-deep-brown text-lg text-center placeholder:text-deep-brown/40 focus:outline-none focus:border-lawn focus:ring-0 transition-colors"
              />
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-12 bg-terracotta text-white font-bold rounded-2xl text-base active:scale-[0.97] transition-transform duration-100"
              >
                GET MY FREE PLAN →
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-deep-brown/70">
                <span className="text-ochre">★★★★★</span>
                <span>Trusted by 12,000+ homeowners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Before/After */}
        <div className="px-5 pb-2">
          <div className="mb-2">
            <div className="w-8 h-0.5 bg-[#1a1a1a] mb-2"></div>
            <p className="font-display text-sm font-semibold text-[#1a1a1a]">Real results <span className="font-normal text-[#737373]">— From patchy to perfect.</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src="/lawn-before.jpg" alt="Lawn before using LawnHQ" className="w-full h-full object-cover" />
              </div>
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#525252] text-[8px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded">
                Before
              </span>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src="/lawn-after.jpg" alt="Lawn after using LawnHQ" className="w-full h-full object-cover" />
              </div>
              <span className="absolute top-2 left-2 bg-[#c17f59]/90 backdrop-blur-sm text-white text-[8px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded">
                After
              </span>
            </div>
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom,4px)] min-h-1" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-col lg:h-dvh lg:overflow-hidden">
        {/* Nav - pinned to top */}
        <nav className="max-w-6xl mx-auto w-full px-8 py-3 flex items-center justify-between flex-shrink-0">
          <Logo />
          <a href="/login" className="text-sm text-deep-brown/70 hover:text-deep-brown transition-colors">Log In</a>
        </nav>

        {/* All content centered vertically */}
        <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-8 min-h-0">
          {/* Hero */}
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display text-3xl xl:text-4xl font-bold text-deep-brown leading-[1.1] tracking-tight">
                YOUR LAWN CALLED.<br />IT WANTS A PLAN.
              </h1>
              <p className="mt-3 text-base text-deep-brown/70 leading-relaxed">
                Get a week-by-week playbook tuned to your frost dates, soil temps, and the weeds that hit your zip code hardest.
              </p>

              <ul className="mt-3 space-y-1.5">
                {[
                  "Tells you exactly which bag to grab at the store",
                  "Timed to your local weather and soil temps",
                  "No credit card required",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-deep-brown/80">
                    <span className="w-4 h-4 rounded-full bg-lawn/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 mt-3 text-sm text-deep-brown/70">
                <span className="text-ochre">★★★★★</span>
                <span>Trusted by 12,000+ homeowners · 4.9 rating</span>
              </div>
            </div>

            <div className="w-full max-w-sm ml-auto">
              <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-xl p-5">
                <h2 className="font-display font-bold text-deep-brown text-lg mb-1">
                  30-Second Setup
                </h2>
                <p className="text-sm text-deep-brown/50 mb-3">
                  Enter your zip and we&apos;ll build your plan.
                </p>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="zip-desktop" className="block text-sm font-medium text-deep-brown/70 mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-deep-brown/10 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:border-lawn transition-colors"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="mt-3 w-full bg-terracotta text-white font-bold py-3.5 rounded-xl hover:bg-terracotta/90 transition-colors"
                  >
                    GET MY FREE PLAN →
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Before/After Section - same width as hero */}
          <div className="mt-3 pt-2 border-t border-deep-brown/10">
            <div className="mb-1.5">
              <div className="w-10 h-0.5 bg-[#1a1a1a] mb-2"></div>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-xl font-semibold text-[#1a1a1a]">
                  Real results
                </h2>
                <p className="text-sm text-[#737373]">From patchy to perfect.</p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Before Image */}
              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <img
                    src="/lawn-before.jpg"
                    alt="Lawn before using LawnHQ"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#525252] text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded">
                  Before
                </span>
              </div>

              {/* Center LawnHQ Dashboard Card */}
              <div className="flex flex-col items-center gap-1">
                {/* Arrow In */}
                <div className="flex items-center text-[#7a8b6e]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Dashboard Card */}
                <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-3 w-44">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#f0f0f0]">
                    <div className="w-6 h-6 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <span className="font-display font-semibold text-xs text-[#1a1a1a]">LawnHQ</span>
                  </div>

                  {/* Mini Dashboard Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7a8b6e]"></div>
                      <span className="text-[9px] text-[#525252]">Fertilize Schedule</span>
                      <span className="ml-auto text-[9px] text-[#7a8b6e] font-medium">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c17f59]"></div>
                      <span className="text-[9px] text-[#525252]">Soil Temp</span>
                      <span className="ml-auto text-[9px] text-[#525252]">68&deg;F</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
                      <span className="text-[9px] text-[#525252]">Mowing Height</span>
                      <span className="ml-auto text-[9px] text-[#525252]">1.5&quot;</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]"></div>
                      <span className="text-[9px] text-[#525252]">Watering</span>
                      <span className="ml-auto text-[9px] text-[#7a8b6e] font-medium">On Track</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 pt-2 border-t border-[#f0f0f0]">
                    <div className="flex justify-between text-[8px] text-[#a3a3a3] mb-1">
                      <span>Lawn Health</span>
                      <span className="text-[#7a8b6e] font-medium">92%</span>
                    </div>
                    <div className="h-1 bg-[#f0f0f0] rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-[#7a8b6e] to-[#8a9b7e] rounded-full"></div>
                    </div>
                  </div>

                  {/* Ask AI Section */}
                  <div className="mt-2 pt-2 border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-1 mb-1">
                      <svg className="w-2.5 h-2.5 text-[#c17f59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-[8px] font-medium text-[#1a1a1a]">Ask AI</span>
                    </div>
                    <div className="bg-[#f8f6f3] rounded-md px-1.5 py-1 flex items-center gap-1">
                      <span className="text-[7px] text-[#a3a3a3]">What fertilizer should I use?</span>
                      <svg className="w-2 h-2 text-[#c17f59] ml-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Arrow Out */}
                <div className="flex items-center text-[#7a8b6e]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* After Image */}

              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <img
                    src="/lawn-after.jpg"
                    alt="Lawn after using LawnHQ"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute top-3 left-3 bg-[#c17f59]/90 backdrop-blur-sm text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded">
                  After
                </span>
                <div className="absolute bottom-3 right-3 bg-[#7a8b6e] text-white rounded-full p-1.5 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
