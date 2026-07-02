import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client factory. Returns null when env vars are absent, so the OS
 * builds and runs on seed data without credentials. Add keys to .env.local to
 * connect a live database.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
