# LawnHQ

## Project Overview
LawnHQ is an AI-powered lawn care advisor built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

**Live URL:** https://mylawnhq-theta.vercel.app
**Repo:** https://github.com/mylawnhq/mylawnhq

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Auth & Database:** Supabase (email/password + Google OAuth)
- **AI:** Anthropic Claude API (chat feature)
- **Weather:** OpenWeatherMap API
- **Hosting:** Vercel (auto-deploys on push to main)

## Getting Started

```bash
git clone https://github.com/mylawnhq/mylawnhq.git
cd mylawnhq
npm install
```

Create `.env.local` in the project root. Ask a team member for the values:

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
ANTHROPIC_API_KEY=<anthropic-api-key>
OPENWEATHERMAP_API_KEY=<openweathermap-api-key>
```

Then run:

```bash
npm run dev
```

App runs at http://localhost:3000

## Project Structure

```
app/
├── page.tsx             # Public landing page (hero + zip code entry)
├── (auth)/              # Public auth pages
│   ├── login/           # Login (email/password + Google OAuth)
│   └── signup/          # Signup (email/password + Google OAuth)
├── (public)/            # Public pages (no auth required)
│   ├── onboarding-v2/   # Main onboarding flow (zip + grass selection)
│   ├── onboarding/      # Quick 3-step onboarding
│   ├── grass/           # Grass type selector
│   ├── email/           # Email capture
│   ├── path/            # Path selection (quick vs expert)
│   ├── expert/          # Expert profile form
│   ├── save/            # Plan save + PDF export
│   ├── plan/            # 90-day plan display
│   └── game/            # Mow Town game
├── (app)/               # Authenticated pages (protected by middleware, no sidebar)
│   ├── chat/            # AI lawn care chat with Larry (session persistence via ChatContext)
│   ├── home/            # Home dashboard (weather, plan progress, activity log, spreader calc, inline chat)
│   ├── profile/         # User profile
│   ├── gear/            # My Gear (equipment management) — unlinked, future feature
│   ├── calendars/       # Lawn care calendar — unlinked, future feature
│   ├── tips/            # Lawn care tips — unlinked, future feature
│   ├── spreader/        # Spreader calculator — unlinked, future feature
│   └── export/          # Data export — unlinked, future feature
├── (admin)/             # Admin dashboard (role-protected)
│   └── admin/           # Admin pages
│       ├── page.tsx     # Dashboard with stats
│       └── users/       # User management
├── api/
│   ├── chat/            # Anthropic Claude chat endpoint (with usage tracking)
│   ├── equipment/       # Equipment identification endpoint (with usage tracking)
│   ├── profile/         # Profile CRUD endpoint
│   ├── subscription/    # Stripe subscription endpoints
│   │   ├── checkout/    # Create Stripe Checkout session
│   │   ├── portal/      # Open Stripe Billing Portal
│   │   └── status/      # Get subscription status
│   ├── webhooks/stripe/ # Stripe webhook handler
│   └── admin/           # Admin API endpoints
│       ├── subscription/ # Update user subscription
│       └── role/        # Update user role
├── auth/
│   └── callback/        # OAuth callback handler (Google sign-in)
└── layout.tsx           # Root layout
lib/
├── supabase/
│   ├── client.ts        # Browser Supabase client
│   └── server.ts        # Server Supabase client
├── stripe.ts            # Stripe client and plan config
└── usage.ts             # Usage tracking helpers
hooks/
├── useProfile.ts        # Profile hook (syncs with Supabase)
└── useSubscription.ts   # Subscription status hook
middleware.ts            # Route protection
supabase/
└── migrations/          # Database migrations
    └── 001_*.sql        # User auth, profiles, subscriptions schema
```

## Database Schema

```sql
-- profiles: User lawn profiles (linked to auth.users)
profiles (id, email, zip_code, grass_type, lawn_size, sun_exposure,
          lawn_goal, mower_type, spreader_type, irrigation_system,
          soil_type, lawn_age, known_issues[], role, created_at, updated_at)

-- subscriptions: Stripe subscription status per user
subscriptions (id, user_id, plan, status, stripe_customer_id,
               stripe_subscription_id, billing_interval, current_period_end,
               trial_end, cancel_at_period_end, created_at)

-- usage: Monthly usage tracking for rate limiting
usage (id, user_id, period_start, ai_chat_count, photo_diagnosis_count)
```

## Subscription & Usage Limits

| Feature | Free Tier | Pro Tier |
|---------|-----------|----------|
| AI Chat Messages | 5/month | Unlimited |
| Photo Diagnoses | 3/month | Unlimited |
| Price | Free | $10/mo or $88/yr |

## Deployment
- **Vercel team:** `team-7411` — ALWAYS deploy to this account.
- **GitHub repo:** https://github.com/mylawnhq/mylawnhq — ALWAYS push to this repo.
- Pushes to `main` auto-deploy to Vercel. No manual steps needed.

## Git Author (IMPORTANT)
**ALWAYS use the mylawnhq team account for git commits and pushes:**
```
git config user.email "team@mylawnhq.com"
git config user.name "mylawnhq"
```
**NEVER use sam@samrahim.com** — Vercel will not auto-deploy from that author. All commits must use `team@mylawnhq.com` or deploys will silently fail.

## External Services
- **Supabase Dashboard:** https://supabase.com/dashboard (project: rjeqfqrqcdrznyojhumk)
- **Google OAuth:** Configured in Google Cloud Console (project: LawnHQ)
- **Anthropic API:** Powers the AI chat feature
- **OpenWeatherMap API:** Powers weather data

## Knowledge Base
- Cool season lawn care data: `docs/cool-season-lawn-care-kb.md`
- Lawn Love blog knowledge: `docs/lawnlove-blog-knowledge-base.md`
- Structured KB data (Section 10 schema): `lib/knowledge-base/` — grass types, seasonal tasks, products, soil targets, knowledge articles
- Never include affiliate links or third-party monetization URLs

## Security Notes
- Never commit `.env.local` or any API keys to the repo
- Login/signup pages use generic error messages to prevent account enumeration
- Weather API validates zip codes (5-digit format only)
- OAuth redirects go through Supabase callback URL

## Important: Updating This File
After every significant change (new feature, bug fix, config change), update this file. Add the change to the changelog below so the team stays in sync.

## Changelog

### 2026-02-03
- **Initial codebase** — Landing page, dashboard, chat, profile, calendar, tips, spreader calculator, export
- **Supabase auth** — Added email/password login and signup with session middleware and route protection
- **Google OAuth** — Added "Continue with Google" button to login and signup pages
- **Moved to Vercel** — Migrated hosting from Netlify to Vercel with auto-deploy on push to main
- **Security fixes** — Removed hardcoded credentials from docs, added zip code validation, generic auth error messages
- **Demo access** — Opened app routes for public demo, pointed Demo link to /dashboard
- **Mobile UX improvements** — Improved layout and responsiveness for dashboard, activity modal, recent activities, and chat
- **Vercel GitHub connection** — Switched Vercel deploy from samrahim88 personal account to mylawnhq org. ALWAYS deploy to Vercel team `team-7411` and push to https://github.com/mylawnhq/mylawnhq

### 2026-02-04
- **Sandbox hero + onboarding flow** — Full /sandbox landing page with hero, zip code entry, 4-step novice onboarding, expert form, plan generation via /api/chat, email capture, and Pro upsell
- **Middleware fix** — Early-return for /sandbox routes to skip Supabase auth
- **Git author fix** — Set git author to team@mylawnhq.com for Vercel auto-deploys
- **Removed dashboard** — Deleted /dashboard page and all components/dashboard/ components. Demo link and auth redirects now point to /home
- **Photo upload in chat** — Added photo upload and camera capture buttons to home page and chat input
- **Mobile chat fixes** — Fixed mobile chat input layout, sidebar chat history, and empty state sizing
- **Tab styling** — Restyled tabs as folder-style with pill buttons and rounded corners
- **Empty state font sizes** — Increased font size on empty activities and todo list states
- **My Gear feature** — New /gear page to add and manage lawn equipment. Supports photo-based AI identification (full equipment or model sticker), manual entry, and automatic owner's manual lookup. Uses localStorage for storage. Added nav item to sidebar under Resources.

### 2026-02-06
- **Database schema** — Created profiles, subscriptions, and usage tables with RLS policies and auto-create trigger on signup
- **Profile sync with Supabase** — Modified useProfile hook to sync with database when authenticated, localStorage for sandbox
- **Profile API** — New /api/profile endpoint for CRUD operations
- **Stripe integration** — Added Stripe client (lib/stripe.ts), checkout/portal API routes, and webhook handler for subscription events
- **Subscription hook** — New useSubscription hook for checking plan status and usage limits
- **Usage tracking** — AI chat and photo diagnosis now track usage per user with monthly limits (Free: 5 chats, 3 photos; Pro: unlimited)
- **Admin dashboard** — New /admin route with stats (total users, MRR, usage), user list, and individual user management
- **Admin actions** — Admins can upgrade/downgrade subscriptions and change user roles
- **Environment variables** — Added STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRO_MONTHLY_PRICE_ID, STRIPE_PRO_YEARLY_PRICE_ID, SUPABASE_SERVICE_ROLE_KEY to .env.example

### 2026-02-08
- **Lawn Love blog KB integration** — Enriched AI chat system prompt (`lib/lawn-knowledge.ts`) with knowledge from lawnlove.com/blog covering watering guidelines, aeration, overseeding, dethatching, pre-emergent timing, lawn diseases (dollar spot, brown patch, summer patch, leaf spot, iron chlorosis), lawn pests (grubs, armyworms, chinch bugs, sod webworms, voles), and expanded soil pH management. Created reference doc at `docs/lawnlove-blog-knowledge-base.md`.

### 2026-02-11
- **V2 migration — sandbox becomes the app** — Moved all sandbox pages to be the main app pages. Sandbox hero replaces the root landing page. Onboarding funnel (`/onboarding-v2`, `/onboarding`, `/grass`, `/email`, `/path`, `/expert`, `/save`, `/plan`, `/game`) moved to `(public)` route group (no auth). App pages (`/home`, `/chat`, `/profile`) now auth-required with sandbox UX (no sidebar, cream background, mobile-first dashboard). Removed old sidebar layout.
- **Chat session persistence** — Wired ChatContext into the chat page so conversations are saved to localStorage and persist across page refreshes. Uses `createSession()` and `updateSession()` from ChatContext.
- **Shared samplePlan utility** — Extracted `samplePlan.ts` from sandbox to `lib/samplePlan.ts` so both home page and LawnPlan component share the same import.
- **Middleware update** — Removed sandbox skip. Public paths now include onboarding funnel routes. App pages (`/home`, `/chat`, `/profile`, `/gear`, `/spreader`) require authentication.
- **Unlinked v1 features** — Gear, Calendar, Tips, Export, Spreader pages remain in repo at `(app)/` routes but have no nav links. Available for future re-integration.
