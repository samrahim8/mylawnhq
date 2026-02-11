import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a dummy client during build time
    return null as unknown as ReturnType<typeof createBrowserClient>;
  }

  // Return existing client if already created (singleton pattern)
  if (client) {
    return client;
  }

  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
