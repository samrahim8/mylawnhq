"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocation(zipCode: string | undefined) {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = useCallback(async () => {
    if (!zipCode || zipCode.length !== 5) {
      setLocation(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!res.ok) throw new Error("Invalid zip");
      const data = await res.json();
      const city = data.places[0]["place name"];
      const stateAbbr = data.places[0]["state abbreviation"];
      setLocation(`${city}, ${stateAbbr}`);
    } catch {
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, [zipCode]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, loading };
}
