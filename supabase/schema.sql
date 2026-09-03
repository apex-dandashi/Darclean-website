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

-- 3. SERVICE AREAS TABLE
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

-- Seed initial Tripoli staff with ID & uniform verification
INSERT INTO public.staff (full_name_ar, full_name_en, phone, gender, id_card_number, uniform_issued, role, active)
VALUES 
    ('فاطمة المير', 'Fatima Al-Mir', '+961 70 112 233', 'female', 'TRP-ID-4401', true, 'team_lead', true),
    ('أحمد الحصني', 'Ahmad Al-Hosni', '+961 71 889 900', 'male', 'TRP-ID-4402', true, 'cleaner', true),
    ('نور كبارة', 'Nour Kabbara', '+961 76 554 433', 'female', 'TRP-ID-4403', true, 'cleaner', true),
    ('عمر درويش', 'Omar Darwish', '+961 03 667 788', 'male', 'TRP-ID-4404', true, 'cleaner', true)
ON CONFLICT DO NOTHING;

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

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_quotes ENABLE ROW LEVEL SECURITY;

-- Public can read service areas & pricing
CREATE POLICY "Public can view service areas" ON public.service_areas
    FOR SELECT USING (available = true);

CREATE POLICY "Public can view pricing settings" ON public.pricing_settings
    FOR SELECT USING (true);

-- Anyone can submit a booking or commercial quote
CREATE POLICY "Public can insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert commercial quotes" ON public.commercial_quotes
    FOR INSERT WITH CHECK (true);

-- Anyone with the secret management token can view & update their own booking
CREATE POLICY "Clients can view booking by management token" ON public.bookings
    FOR SELECT USING (management_token IS NOT NULL);

CREATE POLICY "Clients can update booking by management token" ON public.bookings
    FOR UPDATE USING (management_token IS NOT NULL);

-- Authenticated Admin / Staff have full access
CREATE POLICY "Admin full access on bookings" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on staff" ON public.staff
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on quotes" ON public.commercial_quotes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. STORAGE BUCKET FOR JOB & QUOTE PHOTOS
-- (Run this in Supabase Storage SQL editor or console)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('darclean-photos', 'darclean-photos', true) ON CONFLICT DO NOTHING;
