-- ==============================================================================
-- FAST DELIVERY BILARIYAGANJ - USERS TABLE SCHEMA & PERMISSIONS
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  phone TEXT,
  address TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pincode TEXT;

-- 2. Fast lookup index for email queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. Grant Permissions to service_role, anon, authenticated, postgres
GRANT ALL ON TABLE public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 4. Disable Row Level Security (RLS)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
