"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLElement>;
}

export default function ScrollIndicator({ containerRef }: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const hasMoreContent = container.scrollHeight > container.clientHeight;
    const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

    setShowIndicator(hasMoreContent && !isNearBottom);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check
    checkScroll();

    // Check on scroll
    container.addEventListener("scroll", checkScroll);

    // Check on resize
    window.addEventListener("resize", checkScroll);

    // Check periodically for dynamic content
    const interval = setInterval(checkScroll, 1000);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearInterval(interval);
    };
  }, [containerRef, checkScroll]);

  if (!showIndicator) return null;

  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-[#7a8b6e] text-white rounded-full p-2 shadow-lg animate-bounce">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
