"use client";

import { DayForecast } from "@/types";

interface WeeklyForecastProps {
  forecast: DayForecast[];
  loading: boolean;
  compact?: boolean;
}

export default function WeeklyForecast({ forecast, loading, compact }: WeeklyForecastProps) {
  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      clear: "☀️",
      sunny: "☀️",
      clouds: "☁️",
      cloudy: "☁️",
      "partly cloudy": "⛅",
      rain: "🌧️",
      drizzle: "🌦️",
      "heavy rain": "🌧️",
      "moderate rain": "🌧️",
      thunderstorm: "⛈️",
      snow: "❄️",
      mist: "🌫️",
      fog: "🌫️",
      patchy: "🌦️",
    };
    const key = condition.toLowerCase();
    for (const [k, v] of Object.entries(icons)) {
      if (key.includes(k)) return v;
    }
    return "🌤️";
  };

  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  if (loading) {
    return (
      <div className={compact ? "animate-pulse pt-3" : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 animate-pulse h-full flex flex-col"}>
        <div className="h-3 bg-[#e5e5e5] rounded w-1/3 mb-3"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 bg-[#e5e5e5] rounded mb-1"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {!compact && <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a] mb-1.5 sm:mb-2 flex-shrink-0">This Week</h3>}
      <div className="flex-1 overflow-auto min-h-0 scrollbar-hide">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className="flex items-center justify-between py-1 sm:py-1.5 border-b border-[#e5e5e5] last:border-0"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base lg:text-lg">{getWeatherIcon(day.condition)}</span>
              <div>
                <p className="text-[11px] sm:text-xs lg:text-sm font-medium text-[#1a1a1a]">
                  {index === 0 ? "Today" : day.dayName}
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#a3a3a3] capitalize">{day.condition}</p>
              </div>
            </div>
            <div className="text-right text-[11px] sm:text-xs lg:text-sm">
              <span className="text-[#1a1a1a] font-semibold">{day.high}°</span>
              <span className="text-[#a3a3a3]">/{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
