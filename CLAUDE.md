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
├── (auth)/              # Public auth pages
│   ├── login/           # Login (email/password + Google OAuth)
│   └── signup/          # Signup (email/password + Google OAuth)
├── (app)/               # Authenticated pages (protected by middleware)
│   ├── dashboard/       # Main dashboard
│   ├── chat/            # AI lawn care chat
│   ├── profile/         # User profile
│   ├── calendars/       # Lawn care calendar
│   ├── tips/            # Lawn care tips
│   ├── spreader/        # Spreader calculator
│   ├── export/          # Data export
│   └── home/            # Home page (authenticated)
├── api/
│   ├── chat/            # Anthropic Claude chat endpoint
│   └── weather/         # OpenWeatherMap weather endpoint
├── auth/
│   └── callback/        # OAuth callback handler (Google sign-in)
└── layout.tsx           # Root layout
lib/
└── supabase/
    ├── client.ts        # Browser Supabase client
    └── server.ts        # Server Supabase client
middleware.ts            # Route protection (redirects unauthenticated users to /login)
```

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
- **OpenWeatherMap API:** Powers weather data on the dashboard

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
