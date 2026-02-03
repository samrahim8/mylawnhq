export interface UserProfile {
  zipCode: string;
  grassType: "zoysia" | "bermuda" | "mixed";
  lawnSize: "small" | "medium" | "large";
  soilType?: string;
  sunExposure?: "full" | "partial" | "shade";
  spreaderType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CalendarActivity {
  id: string;
  type: "mow" | "water" | "fertilize" | "aerate" | "pest" | "weedControl" | "seed" | "other";
  date: string;
  notes?: string;
  product?: string;
  // Mowing specific
  height?: string;
  method?: "bagged" | "mulched" | "side-discharge";
  // Watering specific
  duration?: number; // minutes
  zones?: string;
  amount?: string;
  // Fertilizing specific
  applicationRate?: "light" | "normal" | "heavy";
  npk?: string;
  nextDue?: string;
  // Seeding specific
  grassType?: string;
  seedAmount?: string;
  germinationWindow?: string;
  // Weed/Pest control
  treatmentType?: "spot" | "broadcast";
  target?: string;
  // General
  area?: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  forecast: DayForecast[];
  location: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface LawnTip {
  id: string;
  category: "mowing" | "watering" | "fertilizing" | "pest";
  title: string;
  description: string;
  priority: "info" | "warning" | "action";
}

export interface LawnPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  note?: string;
  date: string;
  area?: string;
}

// Spreader Settings Calculator Types
export interface LawnProduct {
  id: string;
  name: string;
  brand: string;
  category: "fertilizer" | "seed" | "weedControl" | "pestControl" | "other";
  applicationRate: {
    lbsPer1000sqft: number;
    lbsPer1000sqftLow?: number; // Optional lower rate from product label
    lbsPer1000sqftHigh?: number; // Optional higher rate from product label
    bagSize?: number;
    bagCoverage?: number;
  };
  npk?: string;
  source: "curated" | "user";
  createdAt?: string;
}

export interface SpreaderSetting {
  spreaderId: string;
  spreaderName: string;
  settingsMap: Record<string, string | number>;
}

export interface ApplicationResult {
  product?: LawnProduct;
  spreaderType: string;
  spreaderSetting: string | number;
  spreaderSettingLow: string | number; // Setting for low application rate
  spreaderSettingHigh: string | number; // Setting for high application rate
  confidence: "exact" | "interpolated" | "estimated";
  lbsPer1000sqft: number;
  lbsPer1000sqftLow: number; // Low application rate
  lbsPer1000sqftHigh: number; // High application rate
  totalLbsNeeded?: number;
  bagsNeeded?: number;
}
