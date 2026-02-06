-- LawnHQ User Auth, Profile Storage & Subscription Schema
-- Run this migration in Supabase SQL Editor

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Linked to auth.users, stores lawn profile data

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  zip_code TEXT,
  grass_type TEXT,  -- 'bermuda' | 'zoysia' | 'fescue-kbg' | 'st-augustine'
  lawn_size TEXT,   -- 'small' | 'medium' | 'large'
  sun_exposure TEXT, -- 'full' | 'partial' | 'shade'
  lawn_goal TEXT,   -- 'low-maintenance' | 'healthy-green' | 'golf-course'
  mower_type TEXT,  -- 'rotary' | 'reel' | 'riding'
  spreader_type TEXT,
  irrigation_system TEXT, -- 'none' | 'manual' | 'in-ground' | 'drip'
  soil_type TEXT,
  lawn_age TEXT,    -- 'new' | 'established'
  known_issues TEXT[], -- Array of issue strings
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. SUBSCRIPTIONS TABLE
-- ============================================
-- Tracks Stripe subscription status per user

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'canceled', 'past_due')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  billing_interval TEXT CHECK (billing_interval IN ('month', 'year')),
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. USAGE TABLE
-- ============================================
-- Monthly usage tracking for rate limiting

CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  ai_chat_count INTEGER DEFAULT 0,
  photo_diagnosis_count INTEGER DEFAULT 0,
  UNIQUE(user_id, period_start)
);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles: Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscriptions: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions: Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscriptions: Admins can update all subscriptions
CREATE POLICY "Admins can update all subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usage: Users can view their own usage
CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT
  USING (auth.uid() = user_id);

-- Usage: Admins can view all usage
CREATE POLICY "Admins can view all usage"
  ON public.usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 5. AUTO-CREATE TRIGGER ON SIGNUP
-- ============================================
-- Creates profile + free subscription when user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');

  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Get current month's usage for a user
CREATE OR REPLACE FUNCTION get_current_usage(p_user_id UUID)
RETURNS TABLE (
  ai_chat_count INTEGER,
  photo_diagnosis_count INTEGER
) AS $$
DECLARE
  current_period DATE := DATE_TRUNC('month', NOW())::DATE;
BEGIN
  -- Ensure usage record exists for current period
  INSERT INTO public.usage (user_id, period_start)
  VALUES (p_user_id, current_period)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  -- Return usage
  RETURN QUERY
  SELECT u.ai_chat_count, u.photo_diagnosis_count
  FROM public.usage u
  WHERE u.user_id = p_user_id AND u.period_start = current_period;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment AI chat usage
CREATE OR REPLACE FUNCTION increment_ai_chat_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_period DATE := DATE_TRUNC('month', NOW())::DATE;
  new_count INTEGER;
BEGIN
  -- Upsert and increment
  INSERT INTO public.usage (user_id, period_start, ai_chat_count)
  VALUES (p_user_id, current_period, 1)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET ai_chat_count = public.usage.ai_chat_count + 1
  RETURNING ai_chat_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment photo diagnosis usage
CREATE OR REPLACE FUNCTION increment_photo_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_period DATE := DATE_TRUNC('month', NOW())::DATE;
  new_count INTEGER;
BEGIN
  -- Upsert and increment
  INSERT INTO public.usage (user_id, period_start, photo_diagnosis_count)
  VALUES (p_user_id, current_period, 1)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET photo_diagnosis_count = public.usage.photo_diagnosis_count + 1
  RETURNING photo_diagnosis_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON public.subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
  ON public.subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_usage_user_period
  ON public.usage(user_id, period_start);
