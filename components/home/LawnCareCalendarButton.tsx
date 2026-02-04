"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface LawnCareCalendarButtonProps {
  calendarPreviewPath: string;
  calendarDownloadPath: string;
}

export default function LawnCareCalendarButton({
  calendarPreviewPath,
  calendarDownloadPath,
}: LawnCareCalendarButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position preview below the button, aligned to the right edge
      setPreviewPosition({
        top: rect.bottom + 8,
        left: Math.min(rect.right, window.innerWidth - 420), // Keep within viewport
      });
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = calendarDownloadPath;
    link.download = "warm-season-lawn-care-calendar.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleDownload}
        className="w-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded-md text-[11px] sm:text-xs font-medium transition-colors border border-[#e5e5e5]"
      >
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Lawn Care Calendar
      </button>

      {/* Hover Preview Portal */}
      {mounted &&
        showPreview &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: previewPosition.top,
              left: previewPosition.left,
              transform: "translateX(-100%)",
            }}
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
          >
            <div className="bg-white border border-[#e5e5e5] rounded-lg shadow-xl p-3 w-[400px]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-[#7a8b6e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="text-sm font-semibold text-[#1a1a1a]">
                  Warm Season Lawn Care Calendar
                </h4>
              </div>
              <div className="rounded-lg overflow-hidden border border-[#e5e5e5]">
                <img
                  src={calendarPreviewPath}
                  alt="Warm Season Lawn Care Calendar"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#a3a3a3] mt-2 text-center">
                Click to download
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
