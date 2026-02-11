"use client";

import { useState, useEffect, useCallback } from "react";
import { FREE_TIER_LIMITS } from "@/lib/stripe";

export interface SubscriptionStatus {
  plan: "free" | "pro";
  status: "active" | "trialing" | "canceled" | "past_due";
  billingInterval?: "month" | "year";
  currentPeriodEnd?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    aiChatCount: number;
    photoDiagnosisCount: number;
  };
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch("/api/subscription/status");

      if (response.status === 401) {
        // Not authenticated - return free tier defaults
        setSubscription({
          plan: "free",
          status: "active",
          cancelAtPeriodEnd: false,
          usage: {
            aiChatCount: 0,
            photoDiagnosisCount: 0,
          },
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      console.error("Subscription fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Default to free tier on error
      setSubscription({
        plan: "free",
        status: "active",
        cancelAtPeriodEnd: false,
        usage: {
          aiChatCount: 0,
          photoDiagnosisCount: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPro = subscription?.plan === "pro" &&
    (subscription?.status === "active" || subscription?.status === "trialing");

  const canUseAiChat = isPro ||
    (subscription?.usage?.aiChatCount ?? 0) < FREE_TIER_LIMITS.AI_CHAT;

  const canUsePhotoDiagnosis = isPro ||
    (subscription?.usage?.photoDiagnosisCount ?? 0) < FREE_TIER_LIMITS.PHOTO_DIAGNOSIS;

  const aiChatRemaining = isPro
    ? Infinity
    : Math.max(0, FREE_TIER_LIMITS.AI_CHAT - (subscription?.usage?.aiChatCount ?? 0));

  const photoDiagnosisRemaining = isPro
    ? Infinity
    : Math.max(0, FREE_TIER_LIMITS.PHOTO_DIAGNOSIS - (subscription?.usage?.photoDiagnosisCount ?? 0));

  const startCheckout = async (interval: "month" | "year") => {
    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });

      if (!response.ok) {
        throw new Error("Failed to start checkout");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      throw err;
    }
  };

  const openBillingPortal = async () => {
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to open billing portal");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Portal error:", err);
      throw err;
    }
  };

  /**
   * Mock upgrade - directly updates database without Stripe
   * Use this for testing the upgrade UX flow
   */
  const mockUpgrade = async (interval: "month" | "year") => {
    try {
      const response = await fetch("/api/subscription/mock-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upgrade");
      }

      // Refresh subscription status after upgrade
      await fetchSubscription();
      return true;
    } catch (err) {
      console.error("Mock upgrade error:", err);
      throw err;
    }
  };

  return {
    subscription,
    loading,
    error,
    isPro,
    canUseAiChat,
    canUsePhotoDiagnosis,
    aiChatRemaining,
    photoDiagnosisRemaining,
    startCheckout,
    openBillingPortal,
    mockUpgrade,
    refresh: fetchSubscription,
  };
}
