"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

/* ── Dashboard Card ── */
function DashboardCard() {
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-2.5 w-40 h-[220px] overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-[#f0f0f0]">
        <div className="w-5 h-5 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <span className="font-display font-semibold text-xs text-[#1a1a1a]">LawnHQ</span>
      </div>
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
      <div className="mt-2 pt-2 border-t border-[#f0f0f0]">
        <div className="flex justify-between text-[8px] text-[#a3a3a3] mb-1">
          <span>Lawn Health</span>
          <span className="text-[#7a8b6e] font-medium">92%</span>
        </div>
        <div className="h-1 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div className="h-full w-[92%] bg-gradient-to-r from-[#7a8b6e] to-[#8a9b7e] rounded-full"></div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-1 mb-1">
          <svg className="w-2.5 h-2.5 text-[#c17f59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[8px] font-medium text-[#1a1a1a]">Ask Larry</span>
        </div>
        <div className="bg-[#f8f6f3] rounded-md px-1.5 py-1 flex items-center gap-1">
          <span className="text-[7px] text-[#a3a3a3]">What fertilizer should I use?</span>
          <svg className="w-2 h-2 text-[#c17f59] ml-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Chat Card ── */
function ChatCard() {
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-2.5 w-40 h-[220px] overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-[#f0f0f0]">
        <div className="w-5 h-5 bg-[#c17f59] rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="font-display font-semibold text-xs text-[#1a1a1a]">Ask Larry</span>
      </div>
      <div className="space-y-1.5">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-[#7a8b6e] rounded-lg rounded-br-sm px-2 py-1 max-w-[85%]">
            <span className="text-[8px] text-white leading-tight block">Brown spots on my lawn?</span>
          </div>
        </div>
        {/* Photo thumbnail */}
        <div className="flex justify-end">
          <div className="w-10 h-7 bg-[#e8e0d8] rounded-md overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#8a7a60] to-[#6b8a5e] flex items-center justify-center">
              <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        {/* AI reply */}
        <div className="flex justify-start">
          <div className="bg-[#f8f6f3] rounded-lg rounded-bl-sm px-2 py-1.5 max-w-[90%]">
            <span className="text-[8px] text-[#525252] leading-tight block">Looks like <span className="font-semibold text-[#c17f59]">dollar spot fungus</span>. Here&apos;s what to do...</span>
          </div>
        </div>
      </div>
      {/* Input bar */}
      <div className="mt-1.5 pt-1.5 border-t border-[#f0f0f0]">
        <div className="bg-[#f8f6f3] rounded-md px-1.5 py-1 flex items-center gap-1">
          <svg className="w-2 h-2 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          <span className="text-[7px] text-[#a3a3a3]">Ask anything...</span>
          <svg className="w-2 h-2 text-[#c17f59] ml-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Activity Log Card ── */
function ActivityLogCard() {
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-2.5 w-40 h-[220px] overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-[#f0f0f0]">
        <div className="w-5 h-5 bg-[#525252] rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-display font-semibold text-xs text-[#1a1a1a]">Activity Log</span>
      </div>
      <div className="space-y-1.5">
        {/* Today */}
        <div className="flex items-start gap-1.5">
          <div className="mt-0.5 w-2.5 h-2.5 rounded-full bg-[#7a8b6e] flex items-center justify-center flex-shrink-0">
            <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[8px] text-[#1a1a1a] font-medium block">Mowed front yard</span>
            <span className="text-[7px] text-[#a3a3a3]">Today &middot; 2.5&quot;</span>
          </div>
        </div>
        {/* 3 days ago */}
        <div className="flex items-start gap-1.5">
          <div className="mt-0.5 w-2.5 h-2.5 rounded-full bg-[#c17f59] flex items-center justify-center flex-shrink-0">
            <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[8px] text-[#1a1a1a] font-medium block">Applied fertilizer</span>
            <span className="text-[7px] text-[#a3a3a3]">3 days ago &middot; PGF Complete</span>
          </div>
        </div>
        {/* 5 days ago */}
        <div className="flex items-start gap-1.5">
          <div className="mt-0.5 w-2.5 h-2.5 rounded-full bg-[#5b9bd5] flex items-center justify-center flex-shrink-0">
            <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[8px] text-[#1a1a1a] font-medium block">Watered</span>
            <span className="text-[7px] text-[#a3a3a3]">5 days ago &middot; 30 min</span>
          </div>
        </div>
      </div>
      {/* Log button */}
      <div className="mt-1.5 pt-1.5 border-t border-[#f0f0f0]">
        <div className="bg-[#7a8b6e] rounded-md py-1 flex items-center justify-center">
          <span className="text-[8px] font-medium text-white leading-none">+ Log Activity</span>
        </div>
      </div>
    </div>
  );
}

/* ── Spreader Card ── */
function SpreaderCard() {
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-2.5 w-40 h-[220px] overflow-hidden">
      <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-[#f0f0f0]">
        <div className="w-5 h-5 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="font-display font-semibold text-xs text-[#1a1a1a]">Spreader Calc</span>
      </div>
      {/* Product */}
      <div className="mb-1">
        <span className="text-[7px] text-[#a3a3a3] uppercase tracking-wider">Product</span>
        <span className="text-[9px] text-[#1a1a1a] font-medium block">Andersons PGF Complete</span>
      </div>
      {/* Spreader */}
      <div className="mb-1">
        <span className="text-[7px] text-[#a3a3a3] uppercase tracking-wider">Spreader</span>
        <span className="text-[9px] text-[#1a1a1a] font-medium block">Earthway 2600A</span>
      </div>
      {/* Setting */}
      <div className="bg-[#f8f6f3] rounded-md px-2 py-1 mb-1 text-center">
        <span className="text-[7px] text-[#a3a3a3] block">Setting</span>
        <span className="text-[12px] text-[#1a1a1a] font-bold">15</span>
      </div>
      {/* Coverage */}
      <div className="pt-1 border-t border-[#f0f0f0]">
        <div className="flex justify-between items-center">
          <span className="text-[7px] text-[#a3a3a3]">Coverage</span>
          <span className="text-[8px] text-[#7a8b6e] font-medium">5,000 sq ft</span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[7px] text-[#a3a3a3]">Bags Needed</span>
          <span className="text-[9px] text-[#c17f59] font-bold">2 bags</span>
        </div>
      </div>
    </div>
  );
}

/* ── Rotating Preview Carousel ── */
function PreviewCardCarousel() {
  const [activeCard, setActiveCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cards = [DashboardCard, ChatCard, ActivityLogCard, SpreaderCard];

  const advance = useCallback(() => {
    setActiveCard((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(advance, 4000);
    return () => clearInterval(id);
  }, [isPaused, advance]);

  return (
    <div
      className="flex flex-col items-center gap-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Arrow In */}
      <div className="flex items-center text-[#7a8b6e]">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Card container — fixed height to prevent layout shift */}
      <div className="relative w-40 h-[220px]">
        {cards.map((Card, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === activeCard ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Card />
          </div>
        ))}
      </div>

      {/* Arrow Out */}
      <div className="flex items-center text-[#7a8b6e]">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center gap-1.5 mt-0.5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === activeCard ? "bg-[#c17f59] scale-125" : "bg-[#d4d4d4]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Season Badge ── */
function SeasonBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-terracotta rounded-full px-4 py-2 mb-4">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#7a8b6e] opacity-75 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#7a8b6e]" />
      </span>
      <span className="font-display text-xs font-semibold tracking-widest uppercase text-white">
        Lawn Season is Live
      </span>
    </div>
  );
}

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
    router.push(`/sandbox/onboarding-v2?zip=${zip}`);
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
              <SeasonBadge />
              <h1 className="font-display text-[28px] font-bold text-deep-brown leading-[1.1] tracking-tight">
                YOUR <span className="text-[#7a8b6e]">LAWN</span> CALLED.<br />IT WANTS A PLAN.
              </h1>
              <p className="mt-2 text-sm text-deep-brown/70 leading-relaxed max-w-[320px]">
                A week-by-week playbook built for your zip code — what to buy, when to apply, and when to just kick back.
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
              <p className="text-xs text-deep-brown/40 text-center flex items-center justify-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>No credit card required.</p>
            </div>
          </div>
        </div>

        {/* Mobile Before/After */}
        <div className="px-5 pb-2">
          <div className="mb-2">
            <div className="w-8 h-0.5 bg-[#c17f59] mb-2"></div>
            <p className="font-display text-sm font-semibold text-[#1a1a1a]">Real <span className="text-[#7a8b6e]">yards</span>. Real <span className="text-[#7a8b6e]">results</span>.</p>
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
              <SeasonBadge />
              <h1 className="font-display text-3xl xl:text-4xl font-bold text-deep-brown leading-[1.1] tracking-tight">
                YOUR <span className="text-[#7a8b6e]">LAWN</span> CALLED.<br />IT WANTS A PLAN.
              </h1>
              <p className="mt-3 text-base text-deep-brown/70 leading-relaxed">
                A week-by-week playbook built for your zip code — what to buy, when to apply, and when to just kick back.
              </p>

              <ul className="mt-3 space-y-1.5">
                {[
                  "Know exactly what to do and when \u2014 personalized to your lawn.",
                  "Get instant answers \u2014 snap a photo or ask anything.",
                  "Track everything \u2014 no more guessing what you put down last month.",
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
                  Punch in your zip. We&apos;ll handle the rest.
                </p>

                <form onSubmit={handleSubmit}>
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
                  <p className="mt-2 text-xs text-deep-brown/40 text-center flex items-center justify-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>No credit card required.</p>
                </form>
              </div>
            </div>
          </div>

          {/* Before/After Section - same width as hero */}
          <div className="mt-5 pt-8 border-t border-deep-brown/10">
            <div className="mb-2">
              <div className="w-10 h-0.5 bg-[#c17f59] mb-3"></div>
              <h2 className="font-display text-xl font-semibold text-[#1a1a1a]">
                Real <span className="text-[#7a8b6e]">yards</span>. Real <span className="text-[#7a8b6e]">results</span>.
              </h2>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Before Image */}
              <div>
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
                <p className="mt-1.5 text-xs text-[#737373] italic">March &mdash; &ldquo;I don&apos;t even know where to start.&rdquo;</p>
              </div>

              {/* Center Rotating Preview Cards */}
              <PreviewCardCarousel />

              {/* After Image */}
              <div>
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
                <p className="mt-1.5 text-xs text-[#737373] italic">September &mdash; &ldquo;My neighbor asked what my secret is.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
