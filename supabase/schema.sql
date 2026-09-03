-- ==============================================================================
-- DarClean / دار كلين - Supabase PostgreSQL Schema & Security Policies
-- Location: Tripoli & North Lebanon (darclean.pro)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
      'new',
      'awaiting_confirmation',
      'confirmed',
      'staff_assigned',
      'on_the_way',
      'in_progress',
      'completed',
      'reclean_requested',
      'reclean_scheduled',
      'closed',
      'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_category AS ENUM ('home', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'whish');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Connected to auth.users)
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

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. AUDIT LOGS TABLE
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

-- 5. SERVICE AREAS TABLE
CREATE TABLE IF NOT EXISTS public.service_areas (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_inside_tripoli BOOLEAN NOT NULL DEFAULT true,
    travel_charge_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    available BOOLEAN NOT NULL DEFAULT true,
    notes_ar TEXT,
    notes_en TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Tripoli & Surrounding Service Areas
INSERT INTO public.service_areas (id, name_ar, name_en, is_inside_tripoli, travel_charge_usd, available, sort_order)
VALUES 
    ('tripoli_central', 'طرابلس (وسط المدينة / التل / الزاهرية)', 'Tripoli Central (Al-Tell / Zaheriyeh)', true, 0.00, true, 1),
    ('dam_w_farez', 'طرابلس (ضم وفرز / المعرض)', 'Tripoli (Dam w Farez / Maarad)', true, 0.00, true, 2),
    ('mina', 'الميناء (الكورنيش / الميناء القديم)', 'Al-Mina (Corniche / Old Port)', true, 0.00, true, 3),
    ('abi_samra', 'أبي سمراء / القبة', 'Abi Samra / Al-Qobbeh', true, 0.00, true, 4),
    ('bahsas', 'البهصاص / رأس مسقا شمالاً', 'Bahsas / North Ras Maska', true, 0.00, true, 5),
    ('qalamoun', 'القلمون', 'Al-Qalamoun', false, 3.00, true, 6),
    ('beddawi', 'البداوي وجبل البداوي', 'Beddawi / Jabal Beddawi', false, 2.00, true, 7),
    ('koura_near', 'الكورة (رأس مسقا، برسا، ضهر العين)', 'Koura (Ras Maska, Barsa, Dahr El-Ain)', false, 4.00, true, 8),
    ('zgharta', 'زغرتا (المدينة ومجدليا)', 'Zgharta & Majdlaya', false, 5.00, true, 9)
ON CONFLICT (id) DO NOTHING;

-- 4. PRICING & GUARANTEE CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.pricing_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_config',
    standard_hourly_rate_usd NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    minimum_hours_per_cleaner INT NOT NULL DEFAULT 2,
    seasonal_multiplier NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    seasonal_name_ar TEXT NOT NULL DEFAULT 'التسعير القياسي',
    seasonal_name_en TEXT NOT NULL DEFAULT 'Standard Season',
    reclean_guarantee_hours INT NOT NULL DEFAULT 24,
    products_and_transport_included BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.pricing_settings (id, standard_hourly_rate_usd, minimum_hours_per_cleaner, seasonal_multiplier, seasonal_name_ar, seasonal_name_en, reclean_guarantee_hours)
VALUES ('current_config', 10.00, 2, 1.00, 'التسعير القياسي (10$ / ساعة عامل)', 'Standard Rate ($10 / cleaner-hour)', 24)
ON CONFLICT (id) DO NOTHING;

-- 5. STAFF TABLE
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name_ar TEXT NOT NULL,
    full_name_en TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('female', 'male')),
    id_card_number TEXT NOT NULL,
    uniform_issued BOOLEAN NOT NULL DEFAULT true,
    role TEXT NOT NULL DEFAULT 'cleaner',
    active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT NOT NULL UNIQUE,
    management_token TEXT NOT NULL,
    service_category service_category NOT NULL DEFAULT 'home',
    service_type TEXT NOT NULL,
    
    -- Customer Contact
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    
    -- Location in Tripoli/North
    area_id TEXT REFERENCES public.service_areas(id),
    area_name_ar TEXT NOT NULL,
    area_name_en TEXT NOT NULL,
    address_details TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    landmark TEXT,
    
    -- Schedule
    service_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    
    -- Cleaner Calculations (Min 2 hrs/cleaner)
    cleaners_count INT NOT NULL DEFAULT 1 CHECK (cleaners_count >= 1),
    estimated_hours NUMERIC(4, 1) NOT NULL DEFAULT 2.0 CHECK (estimated_hours >= 2.0),
    
    -- Pricing Breakdown
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    seasonal_multiplier NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    cleaners_hourly_total NUMERIC(10, 2) NOT NULL,
    travel_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    extras_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    selected_extras JSONB DEFAULT '[]'::jsonb,
    total_price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Payment & Preferences
    payment_method payment_method NOT NULL DEFAULT 'cash',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    same_cleaner_preferred BOOLEAN NOT NULL DEFAULT false,
    preferred_cleaner_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    customer_notes TEXT,
    internal_notes TEXT,
    
    -- Status Lifecycle
    status booking_status NOT NULL DEFAULT 'new',
    assigned_staff_ids JSONB DEFAULT '[]'::jsonb,
    
    -- Re-clean Guarantee Tracking
    reclean_requested_at TIMESTAMPTZ,
    reclean_reason TEXT,
    reclean_scheduled_date DATE,
    reclean_notes TEXT,
    
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. COMMERCIAL QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.commercial_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    business_type TEXT NOT NULL,
    estimated_sqm NUMERIC(10, 2),
    frequency TEXT NOT NULL DEFAULT 'weekly',
    service_needs JSONB DEFAULT '[]'::jsonb,
    preferred_timing TEXT,
    address TEXT NOT NULL,
    area_id TEXT REFERENCES public.service_areas(id),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    quoted_amount_usd NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(service_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_commercial_quotes_status ON public.commercial_quotes(status);

-- 9. HELPER SECURITY DEFINER FUNCTIONS & TRIGGERS
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

-- Trigger to prevent users from assigning or altering their own role or active status
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

-- Auto create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users can update own details" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE TO authenticated USING (public.is_admin());

-- AUDIT LOGS RLS
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (public.is_admin());

-- BOOKINGS RLS
CREATE POLICY "Admins can view all bookings" ON public.bookings
    FOR SELECT TO authenticated USING (public.is_admin());

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

CREATE POLICY "Public can insert bookings via server" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update any booking" ON public.bookings
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

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

CREATE POLICY "Admins can delete bookings" ON public.bookings
    FOR DELETE TO authenticated USING (public.is_admin());

-- STAFF RLS
CREATE POLICY "Admins can view all staff" ON public.staff
    FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Staff can view own record" ON public.staff
    FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can insert staff" ON public.staff
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update staff" ON public.staff
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete staff" ON public.staff
    FOR DELETE TO authenticated USING (public.is_admin());

-- COMMERCIAL QUOTES RLS
CREATE POLICY "Admins can view commercial quotes" ON public.commercial_quotes
    FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Public can insert commercial quotes" ON public.commercial_quotes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update commercial quotes" ON public.commercial_quotes
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete commercial quotes" ON public.commercial_quotes
    FOR DELETE TO authenticated USING (public.is_admin());

-- SERVICE AREAS & PRICING RLS
CREATE POLICY "Public can view service areas" ON public.service_areas
    FOR SELECT USING (available = true);

CREATE POLICY "Public can view pricing settings" ON public.pricing_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update service areas" ON public.service_areas
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update pricing settings" ON public.pricing_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 11. EXPLICIT GRANTS
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
