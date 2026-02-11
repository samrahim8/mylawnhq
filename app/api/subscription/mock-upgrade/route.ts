import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Mock upgrade endpoint - directly updates database without Stripe
 * Use this for testing the upgrade UX flow
 *
 * POST /api/subscription/mock-upgrade
 * Body: { interval: "month" | "year" }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { interval } = body as { interval: "month" | "year" };

    if (!interval || !["month", "year"].includes(interval)) {
      return NextResponse.json(
        { error: "Invalid interval. Must be 'month' or 'year'" },
        { status: 400 }
      );
    }

    // Calculate dates
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const periodEnd = interval === "month"
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days

    // Upsert subscription record
    const { error: upsertError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan: "pro",
        status: "trialing",
        billing_interval: interval,
        current_period_end: periodEnd.toISOString(),
        trial_end: trialEnd.toISOString(),
        cancel_at_period_end: false,
        // Mock Stripe IDs (prefixed with mock_ for clarity)
        stripe_customer_id: `mock_cus_${user.id.slice(0, 8)}`,
        stripe_subscription_id: `mock_sub_${Date.now()}`,
      }, {
        onConflict: "user_id",
      });

    if (upsertError) {
      console.error("Failed to upsert subscription:", upsertError);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Upgraded to Pro with 7-day free trial",
      subscription: {
        plan: "pro",
        status: "trialing",
        billingInterval: interval,
        trialEnd: trialEnd.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
      },
    });
  } catch (error) {
    console.error("Mock upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
