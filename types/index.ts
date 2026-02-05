export interface UserProfile {
  zipCode: string;
  grassType: "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine";
  lawnSize: "small" | "medium" | "large";
  soilType?: string;
  sunExposure?: "full" | "partial" | "shade";
  mowerType?: "rotary" | "reel" | "riding";
  spreaderType?: string;
  irrigationSystem?: "none" | "manual" | "in-ground" | "drip";
  lawnGoal?: "low-maintenance" | "healthy-green" | "golf-course";
  lawnAge?: "new" | "established";
  knownIssues?: string[];
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

export interface ChatImage {
  id: string;
  data: string; // base64 encoded image data
  mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  preview?: string; // optional thumbnail preview URL
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  images?: ChatImage[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
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

// Equipment / My Gear Types
export interface Equipment {
  id: string;
  brand: string;
  model: string;
  type: string; // e.g., "Self-Propelled Mower", "Broadcast Spreader"
  manualUrl: string | null;
  serialNumber?: string;
  purchaseDate?: string; // ISO date string (YYYY-MM-DD)
  warrantyMonths?: number; // Total warranty duration in months
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentIdentificationResult {
  brand: string;
  model: string;
  type: string;
  manualUrl: string | null;
  confidence: "high" | "medium" | "low";
  warrantyMonths?: number; // AI-fetched typical warranty for this product
}

export const EQUIPMENT_TYPES = [
  "Push Mower",
  "Self-Propelled Mower",
  "Riding Mower",
  "Zero-Turn Mower",
  "Reel Mower",
  "Broadcast Spreader",
  "Drop Spreader",
  "Hand Spreader",
  "String Trimmer",
  "Edger",
  "Leaf Blower",
  "Backpack Blower",
  "Sprayer",
  "Aerator",
  "Dethatcher",
  "Chainsaw",
  "Hedge Trimmer",
  "Pressure Washer",
  "Other",
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];
