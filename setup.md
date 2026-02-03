# Setup LawnHQ locally

Run these steps in order:

1. Pull the latest code:
```bash
git pull
```

2. Install dependencies:
```bash
npm install
```

3. Create the `.env.local` file in the project root with this content:
```
NEXT_PUBLIC_SUPABASE_URL=https://rjeqfqrqcdrznyojhumk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZXFmcXJxY2Ryem55b2podW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDk5OTAsImV4cCI6MjA4NTYyNTk5MH0.6qTtAR2nHLDTVzsTHGZU9s_qGAyDoKVE7jsA8bFJV1g
```

4. Start the dev server:
```bash
npm run dev
```

5. Verify it works by visiting http://localhost:3000

Done. The app is deployed on Vercel (not Netlify). Pushing to `main` auto-deploys to https://mylawnhq-theta.vercel.app.
