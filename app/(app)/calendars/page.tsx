"use client";

import { useState } from "react";
import Link from "next/link";

const calendars = [
  {
    id: "warm-season",
    name: "Warm Season Lawn Care Calendar",
    description: "Zoysia, Bermuda, and other warm season grasses",
    previewPath: "/images/warm-season-calendar.png",
    downloadPath: "/images/warm-season-calendar.pdf",
  },
];

export default function CalendarsPage() {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const handleDownload = (downloadPath: string, name: string) => {
    const link = document.createElement("a");
    link.href = downloadPath;
    link.download = `${name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selected = calendars.find((c) => c.id === selectedCalendar);

  return (
    <div className="h-full flex flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
      {/* Header */}
      <div className="flex-shrink-0 bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 mb-2 sm:mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1a1a1a]">
              Lawn Care Calendars
            </h1>
            <p className="text-xs sm:text-sm text-[#525252]">
              Reference guides for your lawn care schedule
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-[#525252] hover:text-[#7a8b6e] text-xs sm:text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex gap-2 sm:gap-3">
        {/* Calendar List */}
        <div className="w-64 flex-shrink-0 bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 overflow-y-auto">
          <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">Available Calendars</h2>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <button
                key={calendar.id}
                onClick={() => setSelectedCalendar(calendar.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedCalendar === calendar.id
                    ? "border-[#7a8b6e] bg-[#f8f6f3]"
                    : "border-[#e5e5e5] hover:border-[#d4d4d4] hover:bg-[#fafafa]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-[#1a1a1a]">{calendar.name}</span>
                </div>
                <p className="text-xs text-[#737373]">{calendar.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Viewer */}
        <div className="flex-1 bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Viewer Header */}
              <div className="flex-shrink-0 p-3 border-b border-[#e5e5e5] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">{selected.name}</h3>
                <button
                  onClick={() => handleDownload(selected.downloadPath, selected.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
              {/* Image Viewer */}
              <div className="flex-1 overflow-auto p-4 bg-[#f5f5f5]">
                <img
                  src={selected.previewPath}
                  alt={selected.name}
                  className="w-full h-auto max-w-4xl mx-auto rounded-lg shadow-lg"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <svg className="w-16 h-16 text-[#d4d4d4] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-[#737373]">Select a calendar from the list to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
