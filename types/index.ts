export interface UserProfile {
  email?: string;
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

// ============================================
// Knowledge Base Entities (Section 10 Schema)
// ============================================

export type ToleranceLevel = "low" | "moderate" | "good" | "high";
export type GrassCategory = "cool_season" | "warm_season";
export type GerminationSpeed = "slow" | "moderate" | "fast";
export type ThatchProduction = "low" | "moderate" | "significant";

export interface GrassType {
  id: string;
  name: string;
  category: GrassCategory;
  spread_method: "tillers" | "tillers_and_rhizomes";
  cutting_height_min: number;
  cutting_height_max: number;
  drought_tolerance: ToleranceLevel;
  traffic_tolerance: ToleranceLevel;
  shade_tolerance: ToleranceLevel;
  heat_tolerance: ToleranceLevel;
  cold_tolerance: ToleranceLevel;
  sun_preference: string;
  n_requirement: string;
  germination_speed: GerminationSpeed;
  thatch_production: ThatchProduction;
  description: string;
  notes: string;
}

export type Season =
  | "winter"
  | "late_winter"
  | "early_spring"
  | "spring"
  | "summer"
  | "late_summer"
  | "fall"
  | "late_fall";

export interface SeasonalTask {
  id: string;
  season: Season;
  task_name: string;
  task_description: string;
  grass_category: GrassCategory | "both";
  priority: number;
  soil_temp_trigger: number | null;
  air_temp_trigger: string | null;
  products: string[];
  warnings: string | null;
}

export type KBProductType =
  | "fertilizer"
  | "supplement"
  | "soil_amendment"
  | "pre_emergent"
  | "pest_control"
  | "fungicide"
  | "weed_killer"
  | "seed"
  | "equipment";
export type ReleaseType = "slow_release" | "fast_release" | "supplement";

export interface KBProduct {
  id: string;
  name: string;
  product_type: KBProductType;
  npk_ratio: string | null;
  release_type: ReleaseType | null;
  use_case: string;
  application_season: Season[];
  product_url: string | null;
  notes: string | null;
  is_base_fertilizer: boolean;
}

export interface SoilTarget {
  grass_type_id: string;
  ideal_ph: number;
  ph_adjustment_product_up: string;
  ph_adjustment_product_down: string;
  ideal_npk_ratio: string;
  testing_notes: string;
}

export interface ExpertNote {
  author: string;
  note: string;
}

export interface ExternalReference {
  title: string;
  url: string;
}

export interface KnowledgeArticle {
  id: string;
  topic_slug: string;
  title: string;
  content: string;
  related_products: string[];
  related_grass_types: string[];
  related_seasons: Season[];
  source_url: string;
  expert_notes: ExpertNote[];
  external_references: ExternalReference[];
}

// ============================================
// Video References
// ============================================

export interface VideoReference {
  id: string;
  topic: string;
  youtube_url: string;
  related_article_ids: string[];
}

// ============================================
// Decision Trees (AI Assistant Routing)
// ============================================

export interface DecisionTreeStep {
  step: number;
  instruction: string;
  condition?: string;
  products?: string[];
  next_step?: number | null;
}

export interface DecisionTree {
  id: string;
  trigger_question: string;
  slug: string;
  keywords: string[];
  steps: DecisionTreeStep[];
}
