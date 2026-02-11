"use client";

import { useState } from "react";
import { FREE_TIER_LIMITS, PLANS } from "@/lib/stripe";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: "ai_chat" | "photo_diagnosis";
  onUpgrade: (interval: "month" | "year") => Promise<void>;
}

export function UpgradeModal({ isOpen, onClose, limitType, onUpgrade }: UpgradeModalProps) {
  const [selectedInterval, setSelectedInterval] = useState<"month" | "year">("year");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const limitMessages = {
    ai_chat: {
      title: `You've used all ${FREE_TIER_LIMITS.AI_CHAT} AI chats`,
      subtitle: "this month",
    },
    photo_diagnosis: {
      title: `You've used all ${FREE_TIER_LIMITS.PHOTO_DIAGNOSIS} photo diagnoses`,
      subtitle: "this month",
    },
  };

  const { title, subtitle } = limitMessages[limitType];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await onUpgrade(selectedInterval);
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-deep-brown/40 hover:text-deep-brown/70 transition-colors rounded-lg hover:bg-deep-brown/5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center pt-2">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-lawn/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-xl font-display font-bold text-deep-brown mb-1">
            {title}
          </h2>
          <p className="text-deep-brown/60 mb-6">{subtitle}</p>

          {/* Benefits */}
          <div className="bg-cream/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-deep-brown mb-3">Upgrade to Pro for:</p>
            <ul className="space-y-2">
              {PLANS.pro.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-deep-brown/80">
                  <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-2 mb-4 p-1 bg-cream/50 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedInterval("month")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                selectedInterval === "month"
                  ? "bg-white text-deep-brown shadow-sm"
                  : "text-deep-brown/60 hover:text-deep-brown"
              }`}
            >
              ${PLANS.pro.monthlyPrice}/mo
            </button>
            <button
              type="button"
              onClick={() => setSelectedInterval("year")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                selectedInterval === "year"
                  ? "bg-white text-deep-brown shadow-sm"
                  : "text-deep-brown/60 hover:text-deep-brown"
              }`}
            >
              ${PLANS.pro.yearlyPrice}/yr
              <span className="ml-1 text-xs text-lawn font-semibold">(save!)</span>
            </button>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-lawn hover:bg-lawn/90 active:scale-[0.98] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              "Start 7-Day Free Trial"
            )}
          </button>

          {/* Dismiss link */}
          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-sm text-deep-brown/50 hover:text-deep-brown/70 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
