"use client";

import { useState } from "react";
import Link from "next/link";

const quickPrompts = [
  "What should I do with my lawn today?",
  "What products should I start preparing?",
  "What weeds should I protect against?",
];

export default function QuickChat() {
  const [message, setMessage] = useState("");

  return (
    <div className="h-full w-full bg-[#f8f6f3] rounded-lg border border-[#e5e5e5] p-2 sm:p-3 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">Quick Chat</h3>
      </div>

      {/* Input - Centered */}
      <div className="flex-1 flex items-center">
        <div className="flex gap-1.5 sm:gap-2 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about lawn care..."
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-[#e5e5e5] rounded-lg text-base sm:text-xs text-[#1a1a1a] placeholder-[#a3a3a3] outline-none focus:border-[#7a8b6e]"
          />
          <Link
            href={`/chat${message ? `?q=${encodeURIComponent(message)}` : ""}`}
            className="p-1.5 sm:p-2 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick Prompt Buttons */}
      <div className="flex flex-wrap justify-center md:justify-start gap-1 sm:gap-1.5 flex-shrink-0">
        {quickPrompts.map((prompt) => (
          <Link
            key={prompt}
            href={`/chat?q=${encodeURIComponent(prompt)}`}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded text-[9px] sm:text-[10px] transition-colors border border-[#e5e5e5] truncate"
          >
            {prompt}
          </Link>
        ))}
      </div>
    </div>
  );
}
