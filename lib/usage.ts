import { createClient } from "@supabase/supabase-js";
import { FREE_TIER_LIMITS } from "./stripe";

// Admin client for server-side usage operations
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface UsageCheckResult {
  allowed: boolean;
  plan: "free" | "pro";
  currentCount: number;
  limit: number;
  remaining: number;
}

// Check if user can use AI chat
export async function checkAiChatUsage(userId: string): Promise<UsageCheckResult> {
  const supabase = getAdminClient();

  // Get subscription and usage
  const [subscriptionResult, usageResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .single(),
    supabase.rpc("get_current_usage", { p_user_id: userId }),
  ]);

  const subscription = subscriptionResult.data;
  const usage = usageResult.data?.[0];

  const plan = subscription?.plan || "free";
  const isPro = plan === "pro" &&
    (subscription?.status === "active" || subscription?.status === "trialing");

  const currentCount = usage?.ai_chat_count || 0;
  const limit = isPro ? Infinity : FREE_TIER_LIMITS.AI_CHAT;
  const remaining = isPro ? Infinity : Math.max(0, limit - currentCount);

  return {
    allowed: isPro || currentCount < FREE_TIER_LIMITS.AI_CHAT,
    plan: plan as "free" | "pro",
    currentCount,
    limit,
    remaining,
  };
}

// Check if user can use photo diagnosis
export async function checkPhotoDiagnosisUsage(userId: string): Promise<UsageCheckResult> {
  const supabase = getAdminClient();

  // Get subscription and usage
  const [subscriptionResult, usageResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .single(),
    supabase.rpc("get_current_usage", { p_user_id: userId }),
  ]);

  const subscription = subscriptionResult.data;
  const usage = usageResult.data?.[0];

  const plan = subscription?.plan || "free";
  const isPro = plan === "pro" &&
    (subscription?.status === "active" || subscription?.status === "trialing");

  const currentCount = usage?.photo_diagnosis_count || 0;
  const limit = isPro ? Infinity : FREE_TIER_LIMITS.PHOTO_DIAGNOSIS;
  const remaining = isPro ? Infinity : Math.max(0, limit - currentCount);

  return {
    allowed: isPro || currentCount < FREE_TIER_LIMITS.PHOTO_DIAGNOSIS,
    plan: plan as "free" | "pro",
    currentCount,
    limit,
    remaining,
  };
}

// Increment AI chat usage
export async function incrementAiChatUsage(userId: string): Promise<number> {
  const supabase = getAdminClient();
  const { data } = await supabase.rpc("increment_ai_chat_usage", { p_user_id: userId });
  return data || 0;
}

// Increment photo diagnosis usage
export async function incrementPhotoDiagnosisUsage(userId: string): Promise<number> {
  const supabase = getAdminClient();
  const { data } = await supabase.rpc("increment_photo_usage", { p_user_id: userId });
  return data || 0;
}
