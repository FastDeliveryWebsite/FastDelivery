import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_Publishable_key ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabaseServiceKey =
  process.env.SUPABASE_Secret_key ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  supabaseAnonKey;

// Client for general public / anon requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
  },
});

// Admin client for backend API routes (service role bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
  },
});
