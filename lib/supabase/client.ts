import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnvOrThrow(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a public key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
    );
  }
  return { url, key };
}

/**
 * Browser Supabase client (anon / publishable key). Use in Client Components when needed.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const { url, key } = getEnvOrThrow();
  return createClient(url, key);
}
