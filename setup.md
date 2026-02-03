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

3. Create the `.env.local` file in the project root. Ask Sam for the Supabase keys:
```
NEXT_PUBLIC_SUPABASE_URL=<ask Sam>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Sam>
```

4. Start the dev server:
```bash
npm run dev
```

5. Verify it works by visiting http://localhost:3000

Done. The app is deployed on Vercel (not Netlify). Pushing to `main` auto-deploys to https://mylawnhq-theta.vercel.app.
