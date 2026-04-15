// ============================================================
// Supabase Client Configuration
// ============================================================
// Creates browser and server Supabase clients for auth and data.
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// environment variables.

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Create a Supabase client for use in browser/client components.
 * This is safe to call multiple times -- it returns a singleton-like client.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
