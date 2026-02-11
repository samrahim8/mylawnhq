"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useSubscription } from "@/hooks/useSubscription";
import { PLANS, FREE_TIER_LIMITS } from "@/lib/stripe";

export default function PricingPage() {
  const router = useRouter();
  const { subscription, isPro, loading, startCheckout, openBillingPortal } =
    useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState<
    "month" | "year" | null
  >(null);

  const handleCheckout = async (interval: "month" | "year") => {
    setCheckoutLoading(interval);
    try {
      await startCheckout(interval);
    } catch {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      await openBillingPortal();
    } catch {
      // Portal error handled in hook
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-deep-brown/50 hover:text-deep-brown transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
            Unlock your best lawn
          </h1>
          <p className="mt-2 text-deep-brown/60">
            Everything you need to grow a lawn you&rsquo;re proud of.
          </p>
        </div>

        {/* Current plan indicator */}
        {!loading && isPro && (
          <div className="mb-6 bg-lawn/10 border border-lawn/20 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-lawn">
              You&rsquo;re on the Pro plan
              {subscription?.billingInterval === "year"
                ? " (Annual)"
                : " (Monthly)"}
            </p>
            <button
              onClick={handleManageBilling}
              className="mt-2 text-sm text-lawn underline underline-offset-2 hover:text-lawn/80 transition-colors"
            >
              Manage Billing
            </button>
          </div>
        )}

        {/* Pro Plan - Annual (Best Value) */}
        <div className="relative mb-4">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-terracotta text-white text-xs font-semibold px-3 py-1 rounded-full">
              BEST VALUE
            </span>
          </div>
          <div className="bg-white rounded-xl border-2 border-terracotta p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-display text-lg font-bold text-deep-brown">
                Pro Annual
              </h3>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-deep-brown">
                  ${PLANS.pro.yearlyPrice}
                </span>
                <span className="text-deep-brown/50 text-sm">/year</span>
              </div>
            </div>
            <p className="text-sm text-terracotta font-medium mb-4">
              ${(PLANS.pro.yearlyPrice / 12).toFixed(2)}/mo — save $
              {(PLANS.pro.monthlyPrice * 12 - PLANS.pro.yearlyPrice).toFixed(2)}{" "}
              vs monthly
            </p>

            <ul className="space-y-2.5 mb-5">
              {PLANS.pro.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-deep-brown/70"
                >
                  <svg
                    className="w-4 h-4 text-lawn flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {isPro ? (
              <button
                onClick={handleManageBilling}
                className="w-full bg-deep-brown/10 text-deep-brown font-semibold py-3 rounded-lg text-sm cursor-pointer hover:bg-deep-brown/15 transition-colors"
              >
                Manage Billing
              </button>
            ) : (
              <button
                onClick={() => handleCheckout("year")}
                disabled={checkoutLoading !== null}
                className="w-full bg-terracotta text-white font-semibold py-3 rounded-lg text-sm hover:bg-terracotta/90 transition-colors disabled:opacity-50"
              >
                {checkoutLoading === "year"
                  ? "Redirecting..."
                  : "START 7-DAY FREE TRIAL"}
              </button>
            )}
          </div>
        </div>

        {/* Pro Plan - Monthly */}
        <div className="bg-white rounded-xl border border-deep-brown/10 p-6 mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-display text-lg font-bold text-deep-brown">
              Pro Monthly
            </h3>
            <div className="text-right">
              <span className="font-display text-2xl font-bold text-deep-brown">
                ${PLANS.pro.monthlyPrice}
              </span>
              <span className="text-deep-brown/50 text-sm">/mo</span>
            </div>
          </div>
          <p className="text-sm text-deep-brown/50 mb-4">Cancel anytime</p>

          <ul className="space-y-2.5 mb-5">
            {PLANS.pro.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-deep-brown/70"
              >
                <svg
                  className="w-4 h-4 text-lawn flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {isPro ? (
            <button
              onClick={handleManageBilling}
              className="w-full bg-deep-brown/10 text-deep-brown font-semibold py-3 rounded-lg text-sm cursor-pointer hover:bg-deep-brown/15 transition-colors"
            >
              Manage Billing
            </button>
          ) : (
            <button
              onClick={() => handleCheckout("month")}
              disabled={checkoutLoading !== null}
              className="w-full bg-deep-brown text-white font-semibold py-3 rounded-lg text-sm hover:bg-deep-brown/90 transition-colors disabled:opacity-50"
            >
              {checkoutLoading === "month"
                ? "Redirecting..."
                : "START 7-DAY FREE TRIAL"}
            </button>
          )}
        </div>

        {/* Free Plan */}
        <div className="bg-cream border border-deep-brown/10 rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-deep-brown">
              Free
            </h3>
            <span className="font-display text-lg font-bold text-deep-brown">
              $0
            </span>
          </div>
          <ul className="space-y-2.5">
            {PLANS.free.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-deep-brown/50"
              >
                <svg
                  className="w-4 h-4 text-deep-brown/30 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-deep-brown/40 mt-6">
          7-day free trial on all Pro plans. Cancel anytime, no questions asked.
        </p>
      </div>
    </div>
  );
}
