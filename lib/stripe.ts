import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe functionality will be disabled.");
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Price IDs from Stripe Dashboard
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
};

// Free tier limits (per month)
export const FREE_TIER_LIMITS = {
  AI_CHAT: 5,
  PHOTO_DIAGNOSIS: 3,
};

// Plan details
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      `${FREE_TIER_LIMITS.AI_CHAT} AI chat messages/month`,
      `${FREE_TIER_LIMITS.PHOTO_DIAGNOSIS} photo diagnoses/month`,
      "Basic lawn profile",
      "Weather integration",
    ],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 80, // ~$28 savings vs monthly
    features: [
      "Unlimited AI chat messages",
      "Unlimited photo diagnoses",
      "Priority support",
      "Advanced lawn analytics",
      "Custom care schedules",
    ],
  },
};
