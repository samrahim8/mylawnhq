"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherData } from "@/types";

// WMO Weather interpretation codes to condition text and icon
function getWeatherCondition(code: number): { condition: string; icon: string } {
  const conditions: Record<number, { condition: string; icon: string }> = {
    0: { condition: "Clear sky", icon: "01d" },
    1: { condition: "Mainly clear", icon: "01d" },
    2: { condition: "Partly cloudy", icon: "02d" },
    3: { condition: "Overcast", icon: "03d" },
    45: { condition: "Foggy", icon: "50d" },
    48: { condition: "Depositing rime fog", icon: "50d" },
    51: { condition: "Light drizzle", icon: "09d" },
    53: { condition: "Moderate drizzle", icon: "09d" },
    55: { condition: "Dense drizzle", icon: "09d" },
    56: { condition: "Light freezing drizzle", icon: "09d" },
    57: { condition: "Dense freezing drizzle", icon: "09d" },
    61: { condition: "Slight rain", icon: "10d" },
    63: { condition: "Moderate rain", icon: "10d" },
    65: { condition: "Heavy rain", icon: "10d" },
    66: { condition: "Light freezing rain", icon: "13d" },
    67: { condition: "Heavy freezing rain", icon: "13d" },
    71: { condition: "Slight snow", icon: "13d" },
    73: { condition: "Moderate snow", icon: "13d" },
    75: { condition: "Heavy snow", icon: "13d" },
    77: { condition: "Snow grains", icon: "13d" },
    80: { condition: "Slight rain showers", icon: "09d" },
    81: { condition: "Moderate rain showers", icon: "09d" },
    82: { condition: "Violent rain showers", icon: "09d" },
    85: { condition: "Slight snow showers", icon: "13d" },
    86: { condition: "Heavy snow showers", icon: "13d" },
    95: { condition: "Thunderstorm", icon: "11d" },
    96: { condition: "Thunderstorm with slight hail", icon: "11d" },
    99: { condition: "Thunderstorm with heavy hail", icon: "11d" },
  };
  return conditions[code] || { condition: "Unknown", icon: "01d" };
}

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
      // Step 1: Convert zipcode to lat/long using Zippopotam.us
      const geoResponse = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

      if (!geoResponse.ok) {
        throw new Error("Invalid zipcode");
      }

      const geoData = await geoResponse.json();
      const lat = parseFloat(geoData.places[0].latitude);
      const lon = parseFloat(geoData.places[0].longitude);
      const location = `${geoData.places[0]["place name"]}, ${geoData.places[0]["state abbreviation"]}`;

      // Step 2: Fetch weather from Open-Meteo
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7`;

      const meteoResponse = await fetch(meteoUrl);

      if (!meteoResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const meteoData = await meteoResponse.json();

      // Get current weather
      const currentCondition = getWeatherCondition(meteoData.current.weather_code);

      // Get daily forecast
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const forecast = meteoData.daily.time.map((date: string, i: number) => {
        const dateObj = new Date(date);
        const condition = getWeatherCondition(meteoData.daily.weather_code[i]);
        return {
          date,
          dayName: i === 0 ? "Today" : dayNames[dateObj.getDay()],
          high: Math.round(meteoData.daily.temperature_2m_max[i]),
          low: Math.round(meteoData.daily.temperature_2m_min[i]),
          condition: condition.condition,
          icon: condition.icon,
        };
      });

      const weatherData: WeatherData = {
        current: {
          temp: Math.round(meteoData.current.temperature_2m),
          feelsLike: Math.round(meteoData.current.apparent_temperature),
          humidity: meteoData.current.relative_humidity_2m,
          windSpeed: Math.round(meteoData.current.wind_speed_10m),
          uvIndex: Math.round(meteoData.daily.uv_index_max[0]),
          condition: currentCondition.condition,
          icon: currentCondition.icon,
        },
        forecast,
        location,
      };

      setWeather(weatherData);
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
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    current: {
      temp: 72,
      feelsLike: 75,
      humidity: 55,
      windSpeed: 8,
      uvIndex: 6,
      condition: "Partly cloudy",
      icon: "02d",
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        dayName: i === 0 ? "Today" : dayNames[date.getDay()],
        high: 75 + Math.floor(Math.random() * 10),
        low: 58 + Math.floor(Math.random() * 8),
        condition: i % 3 === 0 ? "Partly cloudy" : "Clear sky",
        icon: i % 3 === 0 ? "02d" : "01d",
      };
    }),
    location: `${zipCode} Area`,
  };
}
