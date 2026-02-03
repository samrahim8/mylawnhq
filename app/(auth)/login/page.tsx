"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Terracotta with messaging */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#c17f59] flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="font-display font-semibold text-lg text-white">LawnHQ</span>
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
            Welcome back to your lawn command center.
          </h1>
          <p className="text-white/70">
            Your grass missed you.
          </p>
        </div>

        <p className="text-white/50 text-sm">
          © 2025 LawnHQ
        </p>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg text-[#1a1a1a]">LawnHQ</span>
          </div>

          <div className="w-16 h-1 bg-[#1a1a1a] mb-6"></div>

          <h2 className="font-display text-2xl font-semibold text-[#1a1a1a] mb-2">
            Log in
          </h2>
          <p className="text-[#737373] mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#1a1a1a] font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#1a1a1a] placeholder-[#c17f59]/60 outline-none focus:border-[#7a8b6e] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#1a1a1a] placeholder-[#c17f59]/60 outline-none focus:border-[#7a8b6e] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6b7a5d] hover:bg-[#5a6950] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

          <p className="text-center text-[#a3a3a3] text-sm mt-6">
            <Link href="#" className="hover:text-[#737373]">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
