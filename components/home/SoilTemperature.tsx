"use client";

interface SoilTemperatureProps {
  temperature: number;
  trend: number[];
  compact?: boolean;
}

export default function SoilTemperature({ temperature, trend, compact }: SoilTemperatureProps) {
  const getStatus = (temp: number) => {
    if (temp >= 65 && temp <= 75) return { text: "Optimal for growth", color: "text-[#7a8b6e]" };
    if (temp >= 55 && temp < 65) return { text: "Cool - slow growth", color: "text-[#a3a3a3]" };
    if (temp > 75 && temp <= 85) return { text: "Warm - active growth", color: "text-[#c17f59]" };
    if (temp < 55) return { text: "Too cold - dormant", color: "text-[#525252]" };
    return { text: "Too hot - stress possible", color: "text-[#c17f59]" };
  };

  const status = getStatus(temperature);

  // Calculate trend line points for SVG
  const maxTemp = Math.max(...trend);
  const minTemp = Math.min(...trend);
  const range = maxTemp - minTemp || 1;
  const points = trend
    .map((temp, i) => {
      const x = (i / (trend.length - 1)) * 200;
      const y = 30 - ((temp - minTemp) / range) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  const trendChange = trend.length >= 2 ? trend[trend.length - 1] - trend[0] : 0;

  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  return (
    <div className={wrapperClass}>
      {!compact && <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a] mb-1.5 sm:mb-2 flex-shrink-0">Soil Temperature</h3>}

      {/* Main temperature display */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
          {temperature}°F
        </div>
        <p className="text-[10px] sm:text-xs text-[#a3a3a3]">Current soil temp</p>
        <p className={`text-[10px] sm:text-xs font-medium ${status.color}`}>{status.text}</p>
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
      <div className="border-t border-[#e5e5e5] pt-1.5 sm:pt-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <span className="text-[9px] sm:text-[10px] text-[#a3a3a3]">7-Day Trend</span>
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
            <span>7d ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
