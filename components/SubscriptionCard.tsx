"use client";

import { FREE_TIER_LIMITS } from "@/lib/stripe";
import type { SubscriptionStatus } from "@/hooks/useSubscription";

interface SubscriptionCardProps {
  subscription: SubscriptionStatus | null;
  loading: boolean;
  isPro: boolean;
  onUpgrade: () => void;
  onManageBilling: () => void;
}

export function SubscriptionCard({
  subscription,
  loading,
  isPro,
  onUpgrade,
  onManageBilling
}: SubscriptionCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
        <div className="animate-pulse">
          <div className="h-5 bg-cream rounded w-24 mb-4" />
          <div className="h-4 bg-cream rounded w-full mb-2" />
          <div className="h-4 bg-cream rounded w-3/4" />
        </div>
      </div>
    );
  }

  const aiChatUsed = subscription?.usage?.aiChatCount ?? 0;
  const photoUsed = subscription?.usage?.photoDiagnosisCount ?? 0;
  const aiChatLimit = FREE_TIER_LIMITS.AI_CHAT;
  const photoLimit = FREE_TIER_LIMITS.PHOTO_DIAGNOSIS;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-deep-brown">Your Plan</h2>
        {isPro ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-lawn bg-lawn/10 px-2 py-1 rounded-full">
            PRO
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span className="text-xs font-semibold text-deep-brown/50 bg-deep-brown/5 px-2 py-1 rounded-full">
            FREE
          </span>
        )}
      </div>

      {isPro ? (
        // Pro user view
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-deep-brown/70">AI Chats</span>
            <span className="text-sm font-medium text-lawn">Unlimited</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-deep-brown/70">Photo Diagnosis</span>
            <span className="text-sm font-medium text-lawn">Unlimited</span>
          </div>

          <div className="pt-3 border-t border-deep-brown/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-deep-brown/50">
                {subscription?.cancelAtPeriodEnd
                  ? `Ends ${formatDate(subscription?.currentPeriodEnd)}`
                  : `Renews ${formatDate(subscription?.currentPeriodEnd)}`
                }
              </span>
              <button
                type="button"
                onClick={onManageBilling}
                className="text-xs font-medium text-lawn hover:text-lawn/80 transition-colors"
              >
                Manage Billing
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Free user view
        <div className="space-y-3">
          {/* AI Chat usage bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-deep-brown/70">AI Chats</span>
              <span className={`font-medium ${aiChatUsed >= aiChatLimit ? "text-red-500" : "text-deep-brown"}`}>
                {aiChatUsed}/{aiChatLimit} this month
              </span>
            </div>
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  aiChatUsed >= aiChatLimit ? "bg-red-400" :
                  aiChatUsed >= aiChatLimit - 2 ? "bg-orange-400" : "bg-lawn"
                }`}
                style={{ width: `${Math.min(100, (aiChatUsed / aiChatLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Photo diagnosis usage bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-deep-brown/70">Photo Diagnosis</span>
              <span className={`font-medium ${photoUsed >= photoLimit ? "text-red-500" : "text-deep-brown"}`}>
                {photoUsed}/{photoLimit} this month
              </span>
            </div>
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  photoUsed >= photoLimit ? "bg-red-400" :
                  photoUsed >= photoLimit - 1 ? "bg-orange-400" : "bg-lawn"
                }`}
                style={{ width: `${Math.min(100, (photoUsed / photoLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Upgrade CTA */}
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full mt-2 py-2.5 px-4 bg-lawn hover:bg-lawn/90 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all"
          >
            Upgrade to Pro - 7 Day Free Trial
          </button>
        </div>
      )}
    </div>
  );
}
