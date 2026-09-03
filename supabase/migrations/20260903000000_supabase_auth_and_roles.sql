-- ==============================================================================
-- DarClean / دار كلين - Supabase Auth, Profiles, Roles, and Strict RLS Policies
-- Migration: 20260903000000_supabase_auth_and_roles.sql
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    full_name TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on role & email
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Create Audit Logs table for sensitive actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 4. Helper Security Definer Functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles 
  WHERE id = auth.uid() AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND (role = 'staff' OR role = 'admin')
      AND is_active = true
  );
$$;

-- 5. Trigger to prevent users from assigning or altering their own role or active status
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only administrators can assign roles or change account activation status';
    END IF;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();

-- 6. Trigger to automatically handle new auth.users creation if metadata specifies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Default newly signed up users to staff only if profile does not exist
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff'),
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 7. ENABLE ROW LEVEL SECURITY ON ALL EXPOSED TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can update own details" ON public.profiles;
CREATE POLICY "Users can update own details" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 9. RLS POLICIES FOR AUDIT LOGS
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- 10. RLS POLICIES FOR BOOKINGS
-- Drop old permissive policies
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin full access on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can view booking by management token" ON public.bookings;
DROP POLICY IF EXISTS "Clients can update booking by management token" ON public.bookings;

-- SELECT
CREATE POLICY "Admins can view all bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Staff can view assigned bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING (
      public.is_active_staff() AND (
        assigned_staff_ids @> to_jsonb(auth.uid()::text)
        OR EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() 
            AND public.bookings.assigned_staff_ids @> to_jsonb(s.id::text)
        )
      )
    );

-- INSERT (via validated server endpoint / public booking submission)
CREATE POLICY "Public can insert bookings via server" ON public.bookings
    FOR INSERT
    WITH CHECK (true);

-- UPDATE
CREATE POLICY "Admins can update any booking" ON public.bookings
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Staff can update assigned booking status" ON public.bookings
    FOR UPDATE TO authenticated
    USING (
      public.is_active_staff() AND (
        assigned_staff_ids @> to_jsonb(auth.uid()::text)
        OR EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() 
            AND public.bookings.assigned_staff_ids @> to_jsonb(s.id::text)
        )
      )
    )
    WITH CHECK (
      public.is_active_staff() AND (
        assigned_staff_ids @> to_jsonb(auth.uid()::text)
        OR EXISTS (
          SELECT 1 FROM public.staff s 
          WHERE s.user_id = auth.uid() 
            AND public.bookings.assigned_staff_ids @> to_jsonb(s.id::text)
        )
      )
    );

-- DELETE
CREATE POLICY "Admins can delete bookings" ON public.bookings
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 11. RLS POLICIES FOR STAFF
DROP POLICY IF EXISTS "Admin full access on staff" ON public.staff;

CREATE POLICY "Admins can view all staff" ON public.staff
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Staff can view own record" ON public.staff
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins can insert staff" ON public.staff
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update staff" ON public.staff
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete staff" ON public.staff
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 12. RLS POLICIES FOR COMMERCIAL QUOTES
DROP POLICY IF EXISTS "Admin full access on quotes" ON public.commercial_quotes;
DROP POLICY IF EXISTS "Public can insert commercial quotes" ON public.commercial_quotes;

CREATE POLICY "Admins can view commercial quotes" ON public.commercial_quotes
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Public can insert commercial quotes" ON public.commercial_quotes
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update commercial quotes" ON public.commercial_quotes
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete commercial quotes" ON public.commercial_quotes
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 13. RLS POLICIES FOR SERVICE AREAS & PRICING
DROP POLICY IF EXISTS "Public can view service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Public can view pricing settings" ON public.pricing_settings;

CREATE POLICY "Public can view service areas" ON public.service_areas
    FOR SELECT USING (available = true);

CREATE POLICY "Public can view pricing settings" ON public.pricing_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update service areas" ON public.service_areas
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update pricing settings" ON public.pricing_settings
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 14. EXPLICIT GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.service_areas TO anon, authenticated;
GRANT SELECT ON public.pricing_settings TO anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT INSERT ON public.commercial_quotes TO anon, authenticated;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.audit_logs TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.staff TO authenticated;
GRANT ALL ON public.commercial_quotes TO authenticated;
GRANT ALL ON public.service_areas TO authenticated;
GRANT ALL ON public.pricing_settings TO authenticated;

-- 15. CLEANUP LEGACY FAKE/MOCK SEEDED STAFF
DELETE FROM public.staff WHERE id_card_number LIKE 'TRP-ID-%';
