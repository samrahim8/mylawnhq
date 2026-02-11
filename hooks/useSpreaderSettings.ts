import { useMemo } from "react";
import { useProfile } from "./useProfile";
import {
  SPREADER_SETTINGS_DATABASE,
  getSpreaderById,
} from "@/lib/spreader-settings-data";
import {
  CURATED_PRODUCTS,
  searchProducts,
  getProductsByCategory,
} from "@/lib/products-database";
import { LawnProduct, SpreaderSetting, ApplicationResult } from "@/types";

// Lawn size estimates in sq ft
const LAWN_SIZE_ESTIMATES: Record<string, number> = {
  small: 2500,
  medium: 6000,
  large: 15000,
};

interface InterpolationResult {
  setting: string | number;
  confidence: "exact" | "interpolated" | "estimated";
}

// Parse fractional notation like "6 1/2", "12 1/4", "6 3/4" to decimal
function parseFractionalSetting(setting: string | number): number | null {
  if (typeof setting === "number") return setting;

  const str = String(setting).trim();

  // Check for pure letter settings (A, B, C, etc.) - not interpolatable
  if (/^[A-Za-z](\s|$)/.test(str) && !/\d/.test(str)) {
    return null;
  }

  // Handle "X 1/2", "X 1/4", "X 3/4" patterns (e.g., "12 1/2" → 12.5)
  const fractionMatch = str.match(/^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const whole = parseFloat(fractionMatch[1]);
    const numerator = parseFloat(fractionMatch[2]);
    const denominator = parseFloat(fractionMatch[3]);
    return whole + numerator / denominator;
  }

  // Handle standalone fractions "1/2", "1/4"
  const standaloneFraction = str.match(/^(\d+)\/(\d+)$/);
  if (standaloneFraction) {
    return parseFloat(standaloneFraction[1]) / parseFloat(standaloneFraction[2]);
  }

  // Handle plain numbers or decimals
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

// Interpolate spreader setting when exact rate isn't in the table
function interpolateSetting(
  targetRate: number,
  settingsMap: Record<string, string | number>
): InterpolationResult {
  const targetKey = targetRate.toString();

  // Check for exact match
  if (settingsMap[targetKey] !== undefined) {
    return { setting: settingsMap[targetKey], confidence: "exact" };
  }

  // Get all rates as numbers and sort
  const rates = Object.keys(settingsMap)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (rates.length === 0) {
    return { setting: "N/A", confidence: "estimated" };
  }

  // Find bracketing values
  const lower = rates.filter((r) => r < targetRate).pop();
  const upper = rates.find((r) => r > targetRate);

  // If target is below minimum rate
  if (lower === undefined && upper !== undefined) {
    return {
      setting: settingsMap[upper.toString()],
      confidence: "estimated",
    };
  }

  // If target is above maximum rate
  if (upper === undefined && lower !== undefined) {
    return {
      setting: settingsMap[lower.toString()],
      confidence: "estimated",
    };
  }

  // Both bounds exist - interpolate
  if (lower !== undefined && upper !== undefined) {
    const lowerSetting = settingsMap[lower.toString()];
    const upperSetting = settingsMap[upper.toString()];

    // Parse fractional settings properly (e.g., "12 1/2" → 12.5)
    const lowerNum = parseFractionalSetting(lowerSetting);
    const upperNum = parseFractionalSetting(upperSetting);

    if (lowerNum !== null && upperNum !== null) {
      const ratio = (targetRate - lower) / (upper - lower);
      const interpolated = lowerNum + ratio * (upperNum - lowerNum);
      // Round to nearest 0.5
      const rounded = Math.round(interpolated * 2) / 2;
      return { setting: rounded, confidence: "interpolated" };
    }

    // For letter-based settings, use the closest bound
    return { setting: lowerSetting, confidence: "interpolated" };
  }

  return { setting: "N/A", confidence: "estimated" };
}

export function useSpreaderSettings(externalProfile?: { spreaderType?: string; lawnSize?: string } | null) {
  const { profile: internalProfile } = useProfile();
  const profile = externalProfile !== undefined ? externalProfile : internalProfile;

  // Get user's selected spreader
  const userSpreader = useMemo(() => {
    if (!profile?.spreaderType) return null;
    return getSpreaderById(profile.spreaderType);
  }, [profile?.spreaderType]);

  // Check if user has a spreader selected
  const hasSpreader = !!userSpreader;

  // Get user's lawn size in sq ft
  const lawnSqFt = useMemo(() => {
    if (!profile?.lawnSize) return LAWN_SIZE_ESTIMATES.medium;
    return LAWN_SIZE_ESTIMATES[profile.lawnSize] || LAWN_SIZE_ESTIMATES.medium;
  }, [profile?.lawnSize]);

  // Calculate spreader setting for a given application rate
  const calculateSetting = (
    lbsPer1000sqft: number,
    spreaderId?: string
  ): InterpolationResult => {
    const spreader = spreaderId
      ? getSpreaderById(spreaderId)
      : userSpreader;

    if (!spreader) {
      return { setting: "No spreader selected", confidence: "estimated" };
    }

    return interpolateSetting(lbsPer1000sqft, spreader.settingsMap);
  };

  // Calculate full application result for a product
  const calculateApplication = (
    product: LawnProduct,
    customSqFt?: number
  ): ApplicationResult | null => {
    if (!userSpreader) return null;

    const baseRate = product.applicationRate.lbsPer1000sqft;

    // Use product-specific low/high rates if available, otherwise ±20%
    const lowRate = product.applicationRate.lbsPer1000sqftLow ?? baseRate * 0.8;
    const highRate = product.applicationRate.lbsPer1000sqftHigh ?? baseRate * 1.2;

    const { setting, confidence } = calculateSetting(baseRate);
    const { setting: settingLow } = calculateSetting(lowRate);
    const { setting: settingHigh } = calculateSetting(highRate);

    const sqFt = customSqFt || lawnSqFt;
    const totalLbsNeeded = (baseRate * sqFt) / 1000;

    let bagsNeeded: number | undefined;
    if (product.applicationRate.bagSize) {
      bagsNeeded = Math.ceil(totalLbsNeeded / product.applicationRate.bagSize);
    }

    return {
      product,
      spreaderType: userSpreader.spreaderName,
      spreaderSetting: setting,
      spreaderSettingLow: settingLow,
      spreaderSettingHigh: settingHigh,
      confidence,
      lbsPer1000sqft: baseRate,
      lbsPer1000sqftLow: Math.round(lowRate * 100) / 100,
      lbsPer1000sqftHigh: Math.round(highRate * 100) / 100,
      totalLbsNeeded: Math.round(totalLbsNeeded * 10) / 10,
      bagsNeeded,
    };
  };

  // Calculate for a custom rate (manual entry)
  const calculateForRate = (
    lbsPer1000sqft: number,
    customSqFt?: number
  ): Omit<ApplicationResult, "product"> | null => {
    if (!userSpreader) return null;

    // For manual entry, use ±20% for low/high range
    const lowRate = lbsPer1000sqft * 0.8;
    const highRate = lbsPer1000sqft * 1.2;

    const { setting, confidence } = calculateSetting(lbsPer1000sqft);
    const { setting: settingLow } = calculateSetting(lowRate);
    const { setting: settingHigh } = calculateSetting(highRate);

    const sqFt = customSqFt || lawnSqFt;
    const totalLbsNeeded = (lbsPer1000sqft * sqFt) / 1000;

    return {
      spreaderType: userSpreader.spreaderName,
      spreaderSetting: setting,
      spreaderSettingLow: settingLow,
      spreaderSettingHigh: settingHigh,
      confidence,
      lbsPer1000sqft,
      lbsPer1000sqftLow: Math.round(lowRate * 100) / 100,
      lbsPer1000sqftHigh: Math.round(highRate * 100) / 100,
      totalLbsNeeded: Math.round(totalLbsNeeded * 10) / 10,
    };
  };

  // Search curated products
  const searchCuratedProducts = (query: string): LawnProduct[] => {
    return searchProducts(query);
  };

  // Get products by category
  const getProductsInCategory = (
    category: LawnProduct["category"]
  ): LawnProduct[] => {
    return getProductsByCategory(category);
  };

  // Get all curated products
  const getAllProducts = (): LawnProduct[] => {
    return CURATED_PRODUCTS;
  };

  // Get all spreaders (for reference/comparison)
  const getAllSpreaders = (): SpreaderSetting[] => {
    return SPREADER_SETTINGS_DATABASE;
  };

  // Get setting for all spreaders (comparison view)
  const getSettingsForAllSpreaders = (
    lbsPer1000sqft: number
  ): Array<{ spreader: SpreaderSetting; setting: string | number; confidence: string }> => {
    return SPREADER_SETTINGS_DATABASE.map((spreader) => {
      const { setting, confidence } = interpolateSetting(
        lbsPer1000sqft,
        spreader.settingsMap
      );
      return { spreader, setting, confidence };
    });
  };

  return {
    // User's spreader
    userSpreader,
    hasSpreader,
    lawnSqFt,

    // Calculation functions
    calculateSetting,
    calculateApplication,
    calculateForRate,

    // Product search
    searchCuratedProducts,
    getProductsInCategory,
    getAllProducts,

    // Spreader utilities
    getAllSpreaders,
    getSettingsForAllSpreaders,
  };
}
