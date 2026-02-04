"use client";

import Link from "next/link";
import { WeatherData } from "@/types";

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  compact?: boolean;
}

export default function WeatherWidget({ weather, loading, compact }: WeatherWidgetProps) {
  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  if (loading) {
    return (
      <div className={compact ? "animate-pulse pt-3" : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 animate-pulse h-full flex flex-col"}>
        <div className="h-3 bg-[#e5e5e5] rounded w-1/3 mb-3"></div>
        <div className="h-10 bg-[#e5e5e5] rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-[#e5e5e5] rounded w-2/3"></div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={wrapperClass}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <p className="text-[11px] sm:text-xs font-medium text-[#525252] mb-1">Sun&apos;s out, guns out</p>
          <p className="text-[10px] sm:text-[11px] text-[#a3a3a3] mb-2">
            Let&apos;s get that profile created
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg text-[11px] sm:text-xs font-medium transition-colors"
          >
            Let&apos;s Go
          </Link>
        </div>
      </div>
    );
  }

  // Extract city name and zip from location string like "32832 Area (Alafaya)"
  const getLocationDisplay = (location: string) => {
    // Check for pattern like "12345 Area (CityName)"
    const zipMatch = location.match(/^(\d{5})/);
    const cityMatch = location.match(/\(([^)]+)\)/);

    if (zipMatch && cityMatch) {
      return { zip: zipMatch[1], city: cityMatch[1] };
    }
    // Check for pattern like "City, State"
    if (location.includes(",")) {
      return { zip: null, city: location.split(",")[0].trim() };
    }
    // Return as-is if no pattern matched
    return { zip: null, city: location };
  };

  const locationInfo = getLocationDisplay(weather.location);

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      clear: "☀️",
      sunny: "☀️",
      clouds: "☁️",
      cloudy: "☁️",
      "partly cloudy": "⛅",
      rain: "🌧️",
      drizzle: "🌦️",
      thunderstorm: "⛈️",
      snow: "❄️",
      mist: "🌫️",
      fog: "🌫️",
    };
    const key = condition.toLowerCase();
    for (const [k, v] of Object.entries(icons)) {
      if (key.includes(k)) return v;
    }
    return "🌤️";
  };

  return (
    <div className={wrapperClass}>
      {/* Location and temp */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div>
          <div className="flex items-center gap-1">
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">
              {locationInfo.zip && <span>{locationInfo.zip}</span>}
              {locationInfo.zip && locationInfo.city && <span className="text-[#a3a3a3] font-normal mx-0.5">•</span>}
              <span>{locationInfo.city}</span>
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-[#a3a3a3]">
            Humidity: {weather.current.humidity}% • Wind: {weather.current.windSpeed} mph
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
            {Math.round(weather.current.temp)}°F
          </div>
          <div className="flex items-center gap-1 text-[#525252] justify-end">
            <span className="text-sm sm:text-base lg:text-lg">{getWeatherIcon(weather.current.condition)}</span>
            <span className="text-[10px] sm:text-xs capitalize">{weather.current.condition}</span>
          </div>
        </div>
      </div>

      {/* Today's forecast */}
      <div className="flex-1 min-h-0 border-t border-[#e5e5e5] pt-2 sm:pt-3 flex flex-col">
        <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-[#525252] uppercase tracking-wider mb-1 sm:mb-2">
          Today&apos;s Forecast
        </p>
        <div className="text-center mb-2 sm:mb-3">
          <p className="text-[11px] sm:text-xs lg:text-sm text-[#525252]">
            High: {weather.forecast[0]?.high}°F • Low: {weather.forecast[0]?.low}°F
          </p>
          <p className="text-[10px] sm:text-xs text-[#a3a3a3] capitalize">
            {weather.forecast[0]?.condition}
          </p>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center mt-auto">
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#a3a3a3]">Real Feel</p>
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">
              {Math.round(weather.current.feelsLike)}°
            </p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#a3a3a3]">Wind</p>
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">
              {weather.current.windSpeed}
            </p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#a3a3a3]">Humidity</p>
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">
              {weather.current.humidity}%
            </p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#a3a3a3]">UV Index</p>
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">
              {weather.current.uvIndex}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
