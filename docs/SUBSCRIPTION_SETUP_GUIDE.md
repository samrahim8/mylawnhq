# LawnHQ Subscription System Setup Guide

This guide walks you through completing the setup for the user auth, profile storage, and subscription system.

---

## Prerequisites

- Access to your Supabase project dashboard
- A Stripe account (test mode for development)
- Your `.env.local` file ready to edit

---

## Step 1: Run the Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your LawnHQ project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/001_user_auth_subscription_schema.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd+Enter)

You should see "Success. No rows returned" - this means the tables were created.

### Verify the Migration

1. Go to **Table Editor** in the sidebar
2. You should see three new tables:
   - `profiles`
   - `subscriptions`
   - `usage`

---

## Step 2: Get the Supabase Service Role Key

The service role key is needed for webhook handling (bypasses RLS).

1. In Supabase Dashboard, go to **Settings** → **API**
2. Under "Project API keys", find **service_role** (secret)
3. Click the eye icon to reveal it
4. Copy the key

Add to `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> ⚠️ **Warning**: Never expose this key in client-side code or commit it to git.

---

## Step 3: Create Stripe Products & Prices

### 3.1 Create the Pro Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Navigate to **Products** → **Add product**
4. Fill in:
   - **Name**: LawnHQ Pro
   - **Description**: Unlimited AI chat and photo diagnoses

### 3.2 Create Monthly Price

1. Under "Pricing", click **Add price**
2. Fill in:
   - **Price**: $10.00
   - **Billing period**: Monthly
   - **Free trial**: 7 days
3. Click **Save**
4. Copy the **Price ID** (starts with `price_`)

### 3.3 Create Yearly Price

1. Click **Add another price**
2. Fill in:
   - **Price**: $88.00
   - **Billing period**: Yearly
   - **Free trial**: 7 days
3. Click **Save**
4. Copy the **Price ID** (starts with `price_`)

### 3.4 Get Your API Keys

1. Go to **Developers** → **API keys**
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)

Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_PRO_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_PRO_YEARLY_PRICE_ID=price_your_yearly_price_id
```

---

## Step 4: Set Up Stripe Webhook

### 4.1 For Local Development

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret shown (starts with `whsec_`)

Add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4.2 For Production (Vercel)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Fill in:
   - **Endpoint URL**: `https://mylawnhq-theta.vercel.app/api/webhooks/stripe`
   - **Events to listen to**: Select these events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (click "Reveal")

Add to Vercel Environment Variables:
1. Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add `STRIPE_WEBHOOK_SECRET` with the production signing secret

---

## Step 5: Create Your First Admin User

1. Sign up for a LawnHQ account (or use an existing one)
2. Go to Supabase Dashboard → **Table Editor** → **profiles**
3. Find your user row (match by email)
4. Click on the row to edit
5. Change `role` from `user` to `admin`
6. Click **Save**

Now you can access `/admin` in the app.

---

## Step 6: Test the System

### Test Signup Flow
1. Create a new account
2. Check Supabase → **profiles** table - a row should exist
3. Check **subscriptions** table - should have `plan: free`, `status: active`

### Test Profile Sync
1. Go to `/profile` and fill out your lawn details
2. Check Supabase → **profiles** table - fields should be populated
3. Log out, log back in - profile should persist

### Test Subscription Flow
1. (Requires implementing a checkout button in the UI)
2. Or test via API:
   ```bash
   curl -X POST http://localhost:3000/api/subscription/checkout \
     -H "Content-Type: application/json" \
     -H "Cookie: your_session_cookie" \
     -d '{"interval": "month"}'
   ```
3. Use Stripe test card: `4242 4242 4242 4242`

### Test Usage Limits
1. As a free user, send 5 AI chat messages
2. The 6th message should return a 429 error with upgrade prompt

### Test Admin Dashboard
1. Go to `/admin`
2. You should see user stats, MRR, and usage data
3. Click "Manage Users" to see user list
4. Click on a user to view details and change their plan

---

## Complete `.env.local` Template

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# OpenWeatherMap
OPENWEATHERMAP_API_KEY=your_weather_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
```

---

## Troubleshooting

### "Unauthorized" errors on profile API
- Check that the user is logged in
- Verify the Supabase session cookie is being sent

### Webhook events not processing
- Check Stripe CLI is running (for local dev)
- Verify `STRIPE_WEBHOOK_SECRET` matches the endpoint
- Check server logs for webhook handler errors

### Admin dashboard shows 0 users
- Verify the migration ran successfully
- Check that users have signed up after the migration
- Existing auth.users won't have profiles until they sign up again (or manually create rows)

### Usage tracking not working
- Verify the `usage` table exists
- Check that the helper functions were created (run migration again if needed)
- Look for errors in the chat API route logs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
├─────────────────────────────────────────────────────────┤
│  useProfile()     │  useSubscription()                  │
│  - Syncs with DB  │  - Checks plan/status               │
│  - localStorage   │  - Usage remaining                  │
│    fallback       │  - Checkout/portal helpers          │
└────────┬──────────┴────────────────┬────────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐    ┌─────────────────────────────────┐
│  /api/profile   │    │  /api/subscription/*            │
│  - GET/POST     │    │  - /checkout (create session)   │
│  - Auth check   │    │  - /portal (billing portal)     │
│                 │    │  - /status (get current plan)   │
└────────┬────────┘    └──────────────┬──────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase                            │
├─────────────────────────────────────────────────────────┤
│  profiles        │  subscriptions   │  usage           │
│  - User data     │  - Plan status   │  - Monthly       │
│  - Lawn profile  │  - Stripe IDs    │    tracking      │
│  - Role (admin)  │  - Trial info    │  - Rate limits   │
└─────────────────────────────────────────────────────────┘
         ▲
         │ Webhook
         │
┌────────┴────────────────────────────────────────────────┐
│                      Stripe                             │
├─────────────────────────────────────────────────────────┤
│  - Checkout Sessions                                    │
│  - Subscriptions                                        │
│  - Billing Portal                                       │
│  - Webhook Events → /api/webhooks/stripe                │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps (Future Enhancements)

- [ ] Add upgrade prompts in the UI when usage limits are reached
- [ ] Create a `/pricing` page with plan comparison
- [ ] Add subscription management to user settings
- [ ] Email notifications for trial ending, payment failed
- [ ] Analytics dashboard for usage trends
- [ ] Promo codes / discount system

---

*Last updated: 2026-02-06*
