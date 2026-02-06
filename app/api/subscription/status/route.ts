import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get subscription and usage
    const [subscriptionResult, usageResult] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single(),
      supabase.rpc("get_current_usage", { p_user_id: user.id }),
    ]);

    const subscription = subscriptionResult.data;
    const usage = usageResult.data?.[0];

    return NextResponse.json({
      plan: subscription?.plan || "free",
      status: subscription?.status || "active",
      billingInterval: subscription?.billing_interval,
      currentPeriodEnd: subscription?.current_period_end,
      trialEnd: subscription?.trial_end,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
      usage: {
        aiChatCount: usage?.ai_chat_count || 0,
        photoDiagnosisCount: usage?.photo_diagnosis_count || 0,
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
