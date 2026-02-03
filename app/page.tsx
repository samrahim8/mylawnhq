"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Feature icons as components
const WeatherIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const ThermometerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const GrassIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const features = [
  {
    icon: <WeatherIcon />,
    title: "Local Weather",
    description: "Real-time data for your zip.",
  },
  {
    icon: <ThermometerIcon />,
    title: "Soil Temperature",
    description: "Time your pre-emergent perfectly.",
  },
  {
    icon: <CalendarIcon />,
    title: "Smart Calendar",
    description: "Month-by-month schedule.",
  },
  {
    icon: <ChatIcon />,
    title: "AI Expert",
    description: "Get answers instantly.",
  },
  {
    icon: <GrassIcon />,
    title: "Grass Specific",
    description: "Bermuda, Zoysia, Fescue.",
  },
  {
    icon: <LocationIcon />,
    title: "Climate Tuned",
    description: "Local conditions matter.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about your lawn",
    description: "Zip code and grass type. We pull local weather and soil data automatically.",
  },
  {
    number: "02",
    title: "Get your calendar",
    description: "Personalized schedule—when to fertilize, treat, mow, water.",
  },
  {
    number: "03",
    title: "Ask anything",
    description: "Chat with your AI lawn expert. Instant answers, any time.",
  },
];

export default function LandingPage() {
  const [chatInput, setChatInput] = useState("");
  const router = useRouter();

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      router.push(`/home?q=${encodeURIComponent(chatInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f6f3]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-base sm:text-lg text-[#1a1a1a]">LawnHQ</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-6">
            <Link href="/dashboard" className="text-[10px] sm:text-sm font-bold sm:font-medium text-[#525252] hover:text-[#1a1a1a] transition-colors tracking-wide uppercase">
              Demo
            </Link>
            <Link href="/login" className="text-[10px] sm:text-sm font-bold sm:font-medium text-[#525252] hover:text-[#1a1a1a] transition-colors tracking-wide uppercase">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-[10px] sm:text-sm font-medium text-white bg-[#c17f59] hover:bg-[#b06f49] px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg transition-colors tracking-wide uppercase whitespace-nowrap"
            >
              Get Started
            </Link>
          </nav>
        </div>
        {/* Gradient line under header */}
        <div className="h-1 bg-gradient-to-r from-[#7a8b6e] via-[#c17f59] to-[#7a8b6e]"></div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Terracotta accent line */}
          <div className="w-16 h-1 bg-[#1a1a1a] mb-8"></div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left side - Text content */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a1a] mb-5 leading-[1.1]">
                Perfect grass,<br />
                <span className="text-[#7a8b6e]">zero guesswork.</span>
              </h1>
              <p className="text-base text-[#525252] mb-8 max-w-md leading-relaxed">
                AI lawn care, personalized to your grass type and zip code. Expert guidance, 24/7.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-1.5 text-[#a3a3a3]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium tracking-wider uppercase">Zip Code Specific</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#a3a3a3]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-xs font-medium tracking-wider uppercase">Grass Type Tailored</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#a3a3a3]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs font-medium tracking-wider uppercase">24/7 AI Chat</span>
                </div>
              </div>
            </div>

            {/* Right side - Chat input card */}
            <div className="lg:pt-4">
              <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#7a8b6e]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-[#1a1a1a]">Ask your lawn question</span>
                </div>

                {/* Chat input - light style */}
                <form onSubmit={handleChatSubmit} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="When should I fertilize my bermuda lawn?"
                    className="flex-1 border border-[#e5e5e5] rounded-lg px-3 py-2.5 text-sm text-[#525252] placeholder-[#a3a3a3] outline-none focus:border-[#7a8b6e]"
                  />
                  <button type="submit" className="w-10 h-10 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>

                {/* Suggestions */}
                <p className="text-xs text-[#a3a3a3]">
                  Try: &quot;What&apos;s the best height to mow zoysia?&quot; or &quot;How do I fix brown patches?&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-12 px-6 lg:px-12 bg-[#f0efec]">
        <div className="max-w-7xl mx-auto">
          {/* Section header - left aligned with accent line */}
          <div className="mb-6">
            <div className="w-12 h-1 bg-[#1a1a1a] mb-6"></div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-2">
              Real results
            </h2>
            <p className="text-[#737373]">From patchy to perfect.</p>
          </div>

          {/* Before → LawnHQ → After Flow */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-4 lg:gap-6 items-center mx-auto">
            {/* Before Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
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
            <div className="flex flex-col items-center gap-3 py-4 md:py-0">
              {/* Arrow In */}
              <div className="hidden md:flex items-center text-[#7a8b6e]">
                <svg className="w-8 h-8 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Dashboard Card */}
              <div className="bg-white rounded-xl shadow-xl border-2 border-[#c17f59] p-4 w-48 md:w-56">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#f0f0f0]">
                  <div className="w-7 h-7 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className="font-display font-semibold text-sm text-[#1a1a1a]">LawnHQ</span>
                </div>

                {/* Mini Dashboard Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#7a8b6e]"></div>
                    <span className="text-[10px] text-[#525252]">Fertilize Schedule</span>
                    <span className="ml-auto text-[10px] text-[#7a8b6e] font-medium">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#c17f59]"></div>
                    <span className="text-[10px] text-[#525252]">Soil Temp</span>
                    <span className="ml-auto text-[10px] text-[#525252]">68°F</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                    <span className="text-[10px] text-[#525252]">Mowing Height</span>
                    <span className="ml-auto text-[10px] text-[#525252]">1.5&quot;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#a3a3a3]"></div>
                    <span className="text-[10px] text-[#525252]">Watering</span>
                    <span className="ml-auto text-[10px] text-[#7a8b6e] font-medium">On Track</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                  <div className="flex justify-between text-[9px] text-[#a3a3a3] mb-1">
                    <span>Lawn Health</span>
                    <span className="text-[#7a8b6e] font-medium">92%</span>
                  </div>
                  <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-[#7a8b6e] to-[#8a9b7e] rounded-full"></div>
                  </div>
                </div>

                {/* Ask AI Section */}
                <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-3 h-3 text-[#c17f59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-[9px] font-medium text-[#1a1a1a]">Ask AI</span>
                  </div>
                  <div className="bg-[#f8f6f3] rounded-md px-2 py-1.5 flex items-center gap-1.5">
                    <span className="text-[8px] text-[#a3a3a3]">What fertilizer should I use?</span>
                    <svg className="w-2.5 h-2.5 text-[#c17f59] ml-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Arrow Out */}
              <div className="hidden md:flex items-center text-[#7a8b6e]">
                <svg className="w-8 h-8 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* After Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src="/lawn-after.jpg"
                  alt="Lawn after using LawnHQ"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute top-3 left-3 bg-[#c17f59]/90 backdrop-blur-sm text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded">
                After
              </span>
              {/* Success Badge */}
              <div className="absolute -bottom-3 -right-3 bg-[#7a8b6e] text-white rounded-full p-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 lg:px-12 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto">
          {/* Section header - left aligned with accent line */}
          <div className="mb-12">
            <div className="w-12 h-1 bg-[#1a1a1a] mb-6"></div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-2">
              How it works
            </h2>
            <p className="text-[#737373]">Set up once. Get guidance all season.</p>
          </div>

          {/* Steps - left aligned */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="font-display text-5xl md:text-6xl font-semibold text-[#e0e0e0] mb-3">{step.number}</div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">
                  {step.title}
                </h3>
                <p className="text-[#737373] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 lg:px-12 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto">
          {/* Section header - left aligned with accent line */}
          <div className="mb-12">
            <div className="w-12 h-1 bg-[#1a1a1a] mb-6"></div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-2">
              Everything you need
            </h2>
            <p className="text-[#737373]">Built by lawn people, for lawn people.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="w-8 h-8 text-[#737373] mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">
                  {feature.title}
                </h3>
                <p className="text-[#a3a3a3] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-16 px-6 lg:px-12 bg-[#f0efec]">
        <div className="max-w-6xl mx-auto">
          {/* Section header - centered */}
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#1a1a1a] mb-6 mx-auto"></div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-2">
              See it in action
            </h2>
            <p className="text-[#737373]">Your personal lawn command center.</p>
          </div>

          {/* Preview Image */}
          <div className="relative">
            {/* Browser chrome mockup */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-[#e5e5e5]">
              {/* Browser header */}
              <div className="bg-[#f5f5f5] px-4 py-3 flex items-center gap-2 border-b border-[#e5e5e5]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                </div>
              </div>
              {/* Screenshot */}
              <div className="relative">
                <img
                  src="/app-preview.png"
                  alt="LawnHQ Dashboard Preview"
                  className="w-full h-auto"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#7a8b6e]/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#c17f59]/10 rounded-full blur-2xl"></div>
          </div>

          {/* Feature callouts below image */}
          <div className="grid grid-cols-3 gap-6 mt-10 text-center">
            <div>
              <div className="w-10 h-10 bg-[#7a8b6e]/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#1a1a1a]">Track Activities</p>
              <p className="text-xs text-[#737373]">Log mowing, watering & more</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-[#c17f59]/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#c17f59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#1a1a1a]">Weather Aware</p>
              <p className="text-xs text-[#737373]">Real-time local forecasts</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-[#7a8b6e]/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#1a1a1a]">AI Assistant</p>
              <p className="text-xs text-[#737373]">Ask anything, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark green/sage gradient */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#4a5a40] via-[#5a6a4e] to-[#3d4a35]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready for the lawn you&apos;ve always wanted?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands getting personalized guidance.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/10 text-white font-medium border border-white/30 rounded-lg transition-all uppercase tracking-wider text-sm"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Chat CTA Bar */}
      <section className="py-6 px-6 lg:px-12 bg-[#7a8b6e]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-white/90">
            Questions? Our AI knows lawns inside and out.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm hover:text-white/80 transition-colors"
          >
            Try the Chat
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 lg:px-12 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-display font-medium text-[#1a1a1a]">LawnHQ</span>
          </div>
          <p className="text-sm text-[#737373]">
            © 2026 LawnHQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
