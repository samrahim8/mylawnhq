"use client";

import { useState, useRef } from "react";

interface SoilTemperatureProps {
  temperature: number | null;
  trend: number[];
  loading?: boolean;
  compact?: boolean;
}

export default function SoilTemperature({ temperature, trend, loading, compact }: SoilTemperatureProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const getStatus = (temp: number) => {
    if (temp >= 55 && temp <= 85) return { text: "Optimal for growth", color: "text-[#7a8b6e]" };
    if (temp >= 45 && temp < 55) return { text: "Cool - slow growth", color: "text-[#a3a3a3]" };
    if (temp > 85 && temp <= 95) return { text: "Warm - active growth", color: "text-[#c17f59]" };
    if (temp < 45) return { text: "Too cold - dormant", color: "text-[#525252]" };
    return { text: "Too hot - stress possible", color: "text-[#c17f59]" };
  };

  const status = temperature !== null ? getStatus(temperature) : null;

  // Get day of week labels starting from today
  const getDayLabels = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => days[(today + i) % 7]);
  };
  const dayLabels = getDayLabels();

  // Calculate trend line points for SVG
  const hasTrend = trend.length >= 2;
  const maxTemp = hasTrend ? Math.max(...trend) : 0;
  const minTemp = hasTrend ? Math.min(...trend) : 0;
  const range = maxTemp - minTemp || 1;
  const points = hasTrend
    ? trend
        .map((temp, i) => {
          const x = (i / (trend.length - 1)) * 200;
          const y = 30 - ((temp - minTemp) / range) * 25;
          return `${x},${y}`;
        })
        .join(" ")
    : "";

  const trendChange = hasTrend ? trend[trend.length - 1] - trend[0] : 0;

  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  // Loading state
  if (loading) {
    return (
      <div className={wrapperClass}>
        {!compact && <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a] mb-1.5 sm:mb-2 flex-shrink-0">Soil Temperature</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[#7a8b6e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#a3a3a3]">Loading soil data...</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state (no zipcode set)
  if (temperature === null) {
    return (
      <div className={wrapperClass}>
        {!compact && <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a] mb-1.5 sm:mb-2 flex-shrink-0">Soil Temperature</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-8 h-8 text-[#a3a3a3] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-[#525252]">Set your zipcode in your profile to see soil temperature</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {!compact && <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a] mb-1.5 sm:mb-2 flex-shrink-0">Soil Temperature</h3>}

      {/* Main temperature display */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
          {temperature}°F
        </div>
        <p className="text-[10px] sm:text-xs text-[#a3a3a3]">Current soil temp (2&quot; depth)</p>
        {status && <p className={`text-[10px] sm:text-xs font-medium ${status.color}`}>{status.text}</p>}
      </div>

      {/* Temperature ranges */}
      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3 flex-1">
        <div className="flex justify-between text-[10px] sm:text-xs">
          <span className="text-[#525252]">Seed Germination</span>
          <span className="text-[#1a1a1a]">65-75°F</span>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs">
          <span className="text-[#525252]">Root Growth</span>
          <span className="text-[#1a1a1a]">60-70°F</span>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs">
          <span className="text-[#525252]">Fertilizer Active</span>
          <span className="text-[#1a1a1a]">55-85°F</span>
        </div>
      </div>

      {/* 7-day trend */}
      {hasTrend && (
        <div className="border-t border-[#e5e5e5] pt-1.5 sm:pt-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-[10px] text-[#a3a3a3]">7-Day Forecast</span>
            <span className={`text-[9px] sm:text-[10px] font-medium ${trendChange >= 0 ? "text-[#7a8b6e]" : "text-[#c17f59]"}`}>
              {trendChange >= 0 ? "↗" : "↘"} {trendChange >= 0 ? "+" : ""}{trendChange}°F
            </span>
          </div>
          <div className="flex gap-1">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[8px] sm:text-[9px] text-[#a3a3a3] h-12 sm:h-14 lg:h-16 pr-1">
              <span>{maxTemp}°</span>
              <span>{minTemp}°</span>
            </div>
            {/* Chart area */}
            <div
              ref={chartRef}
              className="relative flex-1 h-12 sm:h-14 lg:h-16 cursor-crosshair"
              onMouseMove={(e) => {
                if (!chartRef.current) return;
                const rect = chartRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                const index = Math.round(percent * (trend.length - 1));
                if (index >= 0 && index < trend.length) {
                  setHoveredIndex(index);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover tooltip */}
              {hoveredIndex !== null && (
                <div
                  className="absolute -top-6 transform -translate-x-1/2 bg-[#1a1a1a] text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10"
                  style={{ left: `${(hoveredIndex / (trend.length - 1)) * 100}%` }}
                >
                  {trend[hoveredIndex]}°F
                </div>
              )}
              <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="2" x2="100" y2="2" stroke="#e5e5e5" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e5e5" strokeWidth="0.5" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="48" x2="100" y2="48" stroke="#e5e5e5" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                {/* Trend line */}
                <polyline
                  points={trend
                    .map((temp, i) => {
                      const x = (i / (trend.length - 1)) * 100;
                      const y = 46 - ((temp - minTemp) / range) * 40;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#c17f59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* Dots rendered as absolute positioned divs for perfect circles */}
              {trend.map((temp, i) => {
                const xPercent = (i / (trend.length - 1)) * 100;
                const yPercent = ((temp - minTemp) / range) * 80 + 10;
                return (
                  <div
                    key={i}
                    className="absolute rounded-full bg-[#7a8b6e] transition-all duration-150"
                    style={{
                      left: `${xPercent}%`,
                      bottom: `${yPercent}%`,
                      width: hoveredIndex === i ? 8 : 5,
                      height: hoveredIndex === i ? 8 : 5,
                      transform: "translate(-50%, 50%)",
                    }}
                  />
                );
              })}
            </div>
          </div>
          {/* X-axis day labels */}
          <div className="flex justify-between text-[8px] sm:text-[9px] text-[#a3a3a3] mt-0.5 pl-6">
            {dayLabels.map((day, i) => (
              <span key={i} className={hoveredIndex === i ? "text-[#1a1a1a] font-medium" : ""}>{day}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
