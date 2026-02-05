"use client";

import { useState, useEffect, useCallback } from "react";

export interface SoilTempData {
  current: number;
  trend: number[];
  location: string;
}

export function useSoilTemp(zipCode: string | undefined) {
  const [soilTemp, setSoilTemp] = useState<SoilTempData | null>(null);
  const [loading, setLoading] = useState(!!zipCode);
  const [error, setError] = useState<string | null>(null);

  const fetchSoilTemp = useCallback(async () => {
    if (!zipCode) {
      setSoilTemp(null);
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

      // Step 2: Fetch soil temperature from Open-Meteo
      // Using soil_temperature_6cm (approximately 2 inches depth)
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=soil_temperature_6cm&hourly=soil_temperature_6cm&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`;

      const meteoResponse = await fetch(meteoUrl);

      if (!meteoResponse.ok) {
        throw new Error("Failed to fetch soil temperature data");
      }

      const meteoData = await meteoResponse.json();

      // Current soil temperature
      const currentTemp = Math.round(meteoData.current.soil_temperature_6cm);

      // Get daily averages for 7-day trend
      // Open-Meteo returns hourly data, so we average each day (24 hours)
      const hourlyTemps: number[] = meteoData.hourly.soil_temperature_6cm;
      const trend: number[] = [];

      for (let day = 0; day < 7; day++) {
        const startHour = day * 24;
        const endHour = startHour + 24;
        const dayTemps = hourlyTemps.slice(startHour, endHour);
        const avgTemp = dayTemps.reduce((sum, t) => sum + t, 0) / dayTemps.length;
        trend.push(Math.round(avgTemp));
      }

      setSoilTemp({
        current: currentTemp,
        trend,
        location,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch soil temperature");
      // Use mock data as fallback
      setSoilTemp(getMockSoilTemp(zipCode));
    } finally {
      setLoading(false);
    }
  }, [zipCode]);

  useEffect(() => {
    fetchSoilTemp();
  }, [fetchSoilTemp]);

  return { soilTemp, loading, error, refetch: fetchSoilTemp };
}

// Mock soil temperature data for development/fallback
function getMockSoilTemp(zipCode: string): SoilTempData {
  return {
    current: 68,
    trend: [65, 66, 67, 66, 68, 67, 68],
    location: `${zipCode} Area`,
  };
}
