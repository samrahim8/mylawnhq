import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy-load Supabase admin client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No user ID in checkout session metadata");
    return;
  }

  // Get subscription details from Stripe
  const stripeSubscription = await stripe!.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

  // Get the next billing date from the latest invoice or items
  const nextBillingDate = stripeSubscription.items.data[0]?.current_period_end;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      plan: "pro",
      status: stripeSubscription.status === "trialing" ? "trialing" : "active",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      billing_interval: stripeSubscription.items.data[0]?.price?.recurring?.interval,
      current_period_end: nextBillingDate
        ? new Date(nextBillingDate * 1000).toISOString()
        : null,
      trial_end: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000).toISOString()
        : null,
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
    })
    .eq("user_id", userId);

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find subscription by Stripe customer ID
  const { data: existingSub } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existingSub) {
    console.error("No subscription found for customer:", customerId);
    return;
  }

  // Map Stripe status to our status
  let status: string;
  switch (subscription.status) {
    case "active":
      status = "active";
      break;
    case "trialing":
      status = "trialing";
      break;
    case "past_due":
      status = "past_due";
      break;
    case "canceled":
    case "unpaid":
      status = "canceled";
      break;
    default:
      status = "active";
  }

  // Get the next billing date from the subscription items
  const nextBillingDate = subscription.items.data[0]?.current_period_end;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      status,
      current_period_end: nextBillingDate
        ? new Date(nextBillingDate * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq("stripe_customer_id", customerId);

  console.log(`Subscription updated for customer ${customerId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Downgrade to free plan
  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      plan: "free",
      status: "canceled",
      stripe_subscription_id: null,
      current_period_end: null,
      trial_end: null,
      cancel_at_period_end: false,
    })
    .eq("stripe_customer_id", customerId);

  console.log(`Subscription canceled for customer ${customerId}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Confirm the subscription is active after successful renewal payment
  const { data } = await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      status: "active",
    })
    .eq("stripe_customer_id", customerId)
    .eq("plan", "pro")
    .select("user_id");

  if (data?.length) {
    console.log(`Invoice paid — subscription confirmed active for customer ${customerId}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      status: "past_due",
    })
    .eq("stripe_customer_id", customerId);

  console.log(`Payment failed for customer ${customerId}`);
}
