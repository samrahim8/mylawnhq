# LawnHQ

## Project Overview
LawnHQ is an AI-powered lawn care advisor built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

**Live URL:** https://mylawnhq-theta.vercel.app
**Repo:** https://github.com/mylawnhq/mylawnhq

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Auth & Database:** Supabase (email/password + Google OAuth)
- **Hosting:** Vercel

## Getting Started

```bash
git clone https://github.com/mylawnhq/mylawnhq.git
cd mylawnhq
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://rjeqfqrqcdrznyojhumk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZXFmcXJxY2Ryem55b2podW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDk5OTAsImV4cCI6MjA4NTYyNTk5MH0.6qTtAR2nHLDTVzsTHGZU9s_qGAyDoKVE7jsA8bFJV1g
```

Then run:

```bash
npm run dev
```

App runs at http://localhost:3000

## Project Structure
- `app/(auth)/` — Login and signup pages (email/password + Google OAuth)
- `app/(main)/` — Authenticated pages (dashboard, profile, etc.)
- `app/auth/callback/` — OAuth callback handler
- `lib/supabase/` — Supabase client and server helpers
- `middleware.ts` — Route protection (redirects unauthenticated users to /login)

## Deployment
Pushes to `main` auto-deploy to Vercel. No manual steps needed.

## External Services
- **Supabase Dashboard:** https://supabase.com/dashboard (project: rjeqfqrqcdrznyojhumk)
- **Google OAuth:** Configured in Google Cloud Console (project: LawnHQ)
