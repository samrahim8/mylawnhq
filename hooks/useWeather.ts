"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherData } from "@/types";

export function useWeather(zipCode: string | undefined) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(!!zipCode);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!zipCode) {
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`/api/weather?zip=${zipCode}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
      // Use mock data as fallback
      setWeather(getMockWeather(zipCode));
    } finally {
      setLoading(false);
    }
  }, [zipCode]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}

// Mock weather data for development/fallback
function getMockWeather(zipCode: string): WeatherData {
  return {
    current: {
      temp: 85,
      feelsLike: 91,
      humidity: 75,
      windSpeed: 6,
      uvIndex: 7,
      condition: "Partly cloudy",
      icon: "02d",
    },
    forecast: [
      { date: "2025-06-24", dayName: "Today", high: 92, low: 73, condition: "Partly Cloudy", icon: "02d" },
      { date: "2025-06-25", dayName: "Tue", high: 96, low: 73, condition: "Mist", icon: "50d" },
      { date: "2025-06-26", dayName: "Wed", high: 92, low: 76, condition: "Partly Cloudy", icon: "02d" },
      { date: "2025-06-27", dayName: "Thu", high: 94, low: 77, condition: "Moderate rain", icon: "10d" },
      { date: "2025-06-28", dayName: "Fri", high: 94, low: 77, condition: "Heavy rain", icon: "09d" },
      { date: "2025-06-29", dayName: "Sat", high: 92, low: 72, condition: "Patchy rain nearby", icon: "10d" },
      { date: "2025-06-30", dayName: "Sun", high: 93, low: 74, condition: "Patchy rain nearby", icon: "10d" },
    ],
    location: `${zipCode} Area`,
  };
}
