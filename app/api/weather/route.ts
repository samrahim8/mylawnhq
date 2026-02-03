import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get("zip");

  if (!zip) {
    return NextResponse.json({ error: "Zip code is required" }, { status: 400 });
  }

  // If no API key, return mock data
  if (!API_KEY) {
    return NextResponse.json(getMockWeather(zip));
  }

  try {
    // Get coordinates from zip code using OpenWeatherMap
    const geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${API_KEY}`;
    const geoResponse = await fetchWithTimeout(geoUrl, 3000);

    if (!geoResponse.ok) {
      return NextResponse.json(getMockWeather(zip));
    }

    const geoData = await geoResponse.json();
    const { lat, lon } = geoData;

    // Get official USPS city name from Zippopotam.us API
    let cityName = geoData.name; // Fallback to OpenWeatherMap name
    try {
      const zippoResponse = await fetchWithTimeout(`https://api.zippopotam.us/us/${zip}`, 2000);
      if (zippoResponse.ok) {
        const zippoData = await zippoResponse.json();
        if (zippoData.places && zippoData.places.length > 0) {
          cityName = zippoData.places[0]["place name"];
        }
      }
    } catch {
      // If Zippopotam fails, continue with OpenWeatherMap name
    }

    // Get current weather and forecast in parallel
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetchWithTimeout(currentUrl, 3000),
      fetchWithTimeout(forecastUrl, 3000),
    ]);

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Get UV index (optional, don't block on this)
    let uvIndex = 5; // Default
    try {
      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const uvResponse = await fetchWithTimeout(uvUrl, 2000);
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = Math.round(uvData.value);
      }
    } catch {
      // UV index is optional, continue with default
    }

    // Process forecast data to get daily highs/lows
    const dailyForecasts = processForecast(forecastData.list);

    const weatherData = {
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed),
        uvIndex,
        condition: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      forecast: dailyForecasts,
      location: `${zip} (${cityName})`,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(getMockWeather(zip));
  }
}

function processForecast(list: Array<{
  dt: number;
  main: { temp_max: number; temp_min: number };
  weather: Array<{ description: string; icon: string }>;
}>) {
  const days: { [key: string]: { temps: number[]; conditions: string[]; icons: string[] } } = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split("T")[0];

    if (!days[dateKey]) {
      days[dateKey] = { temps: [], conditions: [], icons: [] };
    }

    days[dateKey].temps.push(item.main.temp_max, item.main.temp_min);
    days[dateKey].conditions.push(item.weather[0].description);
    days[dateKey].icons.push(item.weather[0].icon);
  });

  const result = Object.entries(days)
    .slice(0, 7)
    .map(([date, data], index) => {
      const dateObj = new Date(date);
      return {
        date,
        dayName: index === 0 ? "Today" : dayNames[dateObj.getDay()],
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        condition: data.conditions[Math.floor(data.conditions.length / 2)],
        icon: data.icons[Math.floor(data.icons.length / 2)],
      };
    });

  return result;
}

function getMockWeather(zip: string) {
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const conditions = [
        "Partly Cloudy",
        "Mist",
        "Partly Cloudy",
        "Moderate rain",
        "Heavy rain",
        "Patchy rain nearby",
        "Patchy rain nearby",
      ];
      return {
        date: date.toISOString().split("T")[0],
        dayName: i === 0 ? "Today" : dayNames[date.getDay()],
        high: 85 + Math.floor(Math.random() * 10),
        low: 70 + Math.floor(Math.random() * 8),
        condition: conditions[i],
        icon: i < 2 ? "02d" : "10d",
      };
    }),
    location: `${zip} Area`,
  };
}
