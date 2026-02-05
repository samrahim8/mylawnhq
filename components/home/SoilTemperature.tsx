"use client";

interface SoilTemperatureProps {
  temperature: number | null;
  trend: number[];
  loading?: boolean;
  compact?: boolean;
}

export default function SoilTemperature({ temperature, trend, loading, compact }: SoilTemperatureProps) {
  const getStatus = (temp: number) => {
    if (temp >= 55 && temp <= 85) return { text: "Optimal for growth", color: "text-[#7a8b6e]" };
    if (temp >= 45 && temp < 55) return { text: "Cool - slow growth", color: "text-[#a3a3a3]" };
    if (temp > 85 && temp <= 95) return { text: "Warm - active growth", color: "text-[#c17f59]" };
    if (temp < 45) return { text: "Too cold - dormant", color: "text-[#525252]" };
    return { text: "Too hot - stress possible", color: "text-[#c17f59]" };
  };

  const status = temperature !== null ? getStatus(temperature) : null;

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
          <div className="relative h-5 sm:h-6 lg:h-8">
            <svg viewBox="0 0 200 35" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                points={points}
                fill="none"
                stroke="url(#soilGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="soilGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a3a3a3" />
                  <stop offset="100%" stopColor="#7a8b6e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between text-[9px] sm:text-[10px] text-[#525252] mt-0.5">
              <span>Today</span>
              <span>+7 days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
