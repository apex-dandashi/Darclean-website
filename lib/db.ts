import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Booking, CommercialQuote, PricingSettings, ServiceArea, StaffMember } from './types';

// Initial default configuration
export const DEFAULT_PRICING: PricingSettings = {
  standardHourlyRateUsd: 10.0,
  minimumHoursPerCleaner: 2,
  seasonalMultiplier: 1.0,
  seasonalNameAr: 'التسعير القياسي (10$ للساعة لكل عامل)',
  seasonalNameEn: 'Standard Pricing ($10 / cleaner-hour)',
  recleanGuaranteeHours: 24,
  productsAndTransportIncludedInTripoli: true,
};

export const DEFAULT_SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'tripoli_central',
    nameAr: 'طرابلس (وسط المدينة / التل / الزاهرية)',
    nameEn: 'Tripoli Central (Al-Tell / Zaheriyeh)',
    isInsideTripoli: true,
    travelChargeUsd: 0,
    available: true,
    notesAr: 'التنقل ومواد التنظيف مشمولة بالكامل',
    notesEn: 'Transportation & cleaning products fully included',
  },
  {
    id: 'dam_w_farez',
    nameAr: 'طرابلس (ضم وفرز / المعرض / المئتين)',
    nameEn: 'Tripoli (Dam w Farez / Maarad / Al-Miatayn)',
    isInsideTripoli: true,
    travelChargeUsd: 0,
    available: true,
    notesAr: 'التنقل ومواد التنظيف مشمولة بالكامل',
    notesEn: 'Transportation & cleaning products fully included',
  },
  {
    id: 'mina',
    nameAr: 'الميناء (الكورنيش / الميناء القديم / مار الياس)',
    nameEn: 'Al-Mina (Corniche / Old Port / Mar Elias)',
    isInsideTripoli: true,
    travelChargeUsd: 0,
    available: true,
    notesAr: 'التنقل ومواد التنظيف مشمولة بالكامل',
    notesEn: 'Transportation & cleaning products fully included',
  },
  {
    id: 'abi_samra',
    nameAr: 'أبي سمراء / القبة',
    nameEn: 'Abi Samra / Al-Qobbeh',
    isInsideTripoli: true,
    travelChargeUsd: 0,
    available: true,
    notesAr: 'التنقل ومواد التنظيف مشمولة بالكامل',
    notesEn: 'Transportation & cleaning products fully included',
  },
  {
    id: 'bahsas',
    nameAr: 'البهصاص / مدخل طرابلس الجنوبي',
    nameEn: 'Bahsas / Tripoli Southern Entrance',
    isInsideTripoli: true,
    travelChargeUsd: 0,
    available: true,
    notesAr: 'مشمول بدون رسوم إضافية',
    notesEn: 'Included with no extra transport fees',
  },
  {
    id: 'qalamoun',
    nameAr: 'القلمون',
    nameEn: 'Al-Qalamoun',
    isInsideTripoli: false,
    travelChargeUsd: 3,
    available: true,
    notesAr: 'رسم انتقال وتوصيل طاقم ومعدات: 3$',
    notesEn: 'Crew & equipment transport surcharge: $3',
  },
  {
    id: 'beddawi',
    nameAr: 'البداوي وجبل البداوي',
    nameEn: 'Beddawi / Jabal Beddawi',
    isInsideTripoli: false,
    travelChargeUsd: 2,
    available: true,
    notesAr: 'رسم انتقال طاقم: 2$',
    notesEn: 'Crew transport surcharge: $2',
  },
  {
    id: 'koura_near',
    nameAr: 'الكورة (رأس مسقا، برسا، ضهر العين)',
    nameEn: 'Koura (Ras Maska, Barsa, Dahr El-Ain)',
    isInsideTripoli: false,
    travelChargeUsd: 4,
    available: true,
    notesAr: 'رسم انتقال وتوصيل: 4$',
    notesEn: 'Crew & equipment transport surcharge: $4',
  },
  {
    id: 'zgharta',
    nameAr: 'زغرتا (المدينة، مجدليا، العيرونية)',
    nameEn: 'Zgharta (City, Majdlaya, Ayrouniyeh)',
    isInsideTripoli: false,
    travelChargeUsd: 5,
    available: true,
    notesAr: 'رسم انتقال وتوصيل: 5$',
    notesEn: 'Crew & equipment transport surcharge: $5',
  },
];

export const DEFAULT_STAFF: StaffMember[] = [];

// Fallback in-memory store for local dev / testing resilience
class ResilientDataStore {
  private bookings: Map<string, Booking> = new Map();
  private quotes: Map<string, CommercialQuote> = new Map();
  private staff: Map<string, StaffMember> = new Map();
  private areas: Map<string, ServiceArea> = new Map();
  private pricing: PricingSettings = { ...DEFAULT_PRICING };

  constructor() {
    // Seed system areas
    DEFAULT_SERVICE_AREAS.forEach((area) => this.areas.set(area.id, area));
  }

  // Bookings CRUD
  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getBookingById(id: string): Booking | null {
    return this.bookings.get(id) || null;
  }

  getBookingByReference(reference: string): Booking | null {
    for (const b of this.bookings.values()) {
      if (b.reference.toUpperCase() === reference.toUpperCase()) {
        return b;
      }
    }
    return null;
  }

  getBookingByToken(token: string): Booking | null {
    for (const b of this.bookings.values()) {
      if (b.managementToken === token) {
        return b;
      }
    }
    return null;
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const id = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const existing = this.bookings.get(id);
    if (!existing) return null;
    
    // Assign names if staff ids are updated
    let assignedStaffNames = existing.assignedStaffNames;
    if (updates.assignedStaffIds) {
      assignedStaffNames = updates.assignedStaffIds.map((sid) => {
        const member = this.staff.get(sid);
        return member ? member.fullNameAr : sid;
      });
    }

    const updated: Booking = {
      ...existing,
      ...updates,
      assignedStaffNames: assignedStaffNames || existing.assignedStaffNames,
      updatedAt: new Date().toISOString(),
    };
    this.bookings.set(id, updated);
    return updated;
  }

  // Commercial quotes
  getAllQuotes(): CommercialQuote[] {
    return Array.from(this.quotes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createQuote(quoteData: Omit<CommercialQuote, 'id' | 'createdAt'>): CommercialQuote {
    const id = `qt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newQuote: CommercialQuote = {
      ...quoteData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  updateQuote(id: string, updates: Partial<CommercialQuote>): CommercialQuote | null {
    const existing = this.quotes.get(id);
    if (!existing) return null;
    const updated: CommercialQuote = {
      ...existing,
      ...updates,
    };
    this.quotes.set(id, updated);
    return updated;
  }

  // Staff
  getAllStaff(): StaffMember[] {
    return Array.from(this.staff.values());
  }

  getStaffById(id: string): StaffMember | null {
    return this.staff.get(id) || null;
  }

  createStaff(staffData: StaffMember): StaffMember {
    this.staff.set(staffData.id, staffData);
    return staffData;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember | null {
    const existing = this.staff.get(id);
    if (!existing) return null;
    const updated: StaffMember = {
      ...existing,
      ...updates,
    };
    this.staff.set(id, updated);
    return updated;
  }

  // Service Areas
  getAllAreas(): ServiceArea[] {
    return Array.from(this.areas.values());
  }

  updateArea(id: string, updates: Partial<ServiceArea>): ServiceArea | null {
    const existing = this.areas.get(id);
    if (!existing) return null;
    const updated: ServiceArea = {
      ...existing,
      ...updates,
    };
    this.areas.set(id, updated);
    return updated;
  }

  // Pricing
  getPricing(): PricingSettings {
    return { ...this.pricing };
  }

  updatePricing(updates: Partial<PricingSettings>): PricingSettings {
    this.pricing = {
      ...this.pricing,
      ...updates,
    };
    return { ...this.pricing };
  }
}

// Global singleton for resilience across requests in dev/preview
const globalStore = (globalThis as any).__darclean_store || new ResilientDataStore();
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__darclean_store = globalStore;
}

// Supabase client instance (server-side with service role or public key)
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseClient;
}

// Production environment flag: In production, Supabase MUST be configured and operational.
// Fallback to in-memory store is strictly restricted to local development / test mock environments.
const isProduction = process.env.NODE_ENV === 'production';

export async function fetchAllBookings(): Promise<Booking[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isProduction) throw new Error(`Database query error: ${error.message}`);
        console.warn('Supabase fetch bookings error, using store:', error);
      } else if (data) {
        return data.map(mapDbToBooking);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase fetch bookings error, using store:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable. Supabase must be configured in production.');
  }
  return globalStore.getAllBookings();
}

export async function fetchBookingByIdOrReference(idOrRef: string): Promise<Booking | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`id.eq.${idOrRef},reference.ilike.${idOrRef}`)
        .maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Database error fetching booking: ${error.message}`);
        console.warn('Supabase fetch booking error:', error);
      } else if (data) {
        return mapDbToBooking(data);
      } else {
        return null;
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase fetch booking error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable. Supabase must be configured in production.');
  }
  return globalStore.getBookingById(idOrRef) || globalStore.getBookingByReference(idOrRef);
}

export async function fetchBookingByToken(token: string): Promise<Booking | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('management_token', token)
        .maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Database error fetching booking by token: ${error.message}`);
        console.warn('Supabase fetch booking by token error:', error);
      } else if (data) {
        return mapDbToBooking(data);
      } else {
        return null;
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase fetch booking by token error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable. Supabase must be configured in production.');
  }
  return globalStore.getBookingByToken(token);
}

export async function insertBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbPayload = mapBookingToDb(booking);
      const { data, error } = await supabase
        .from('bookings')
        .insert(dbPayload)
        .select()
        .single();
      if (error) {
        if (isProduction) throw new Error(`Database error creating booking: ${error.message}`);
        console.warn('Supabase insert error, falling back to store:', error);
      } else if (data) {
        const mapped = mapDbToBooking(data);
        if (!isProduction) globalStore.createBooking(booking);
        return mapped;
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase insert error, falling back to store:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable. Supabase must be configured in production.');
  }
  return globalStore.createBooking(booking);
}

export async function updateBookingStatusOrDetails(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.assignedStaffIds !== undefined) dbUpdates.assigned_staff_ids = updates.assignedStaffIds;
      if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
      if (updates.recleanRequestedAt !== undefined) dbUpdates.reclean_requested_at = updates.recleanRequestedAt;
      if (updates.recleanReason !== undefined) dbUpdates.reclean_reason = updates.recleanReason;
      if (updates.recleanScheduledDate !== undefined) dbUpdates.reclean_scheduled_date = updates.recleanScheduledDate;
      if (updates.recleanNotes !== undefined) dbUpdates.reclean_notes = updates.recleanNotes;
      if (updates.internalNotes !== undefined) dbUpdates.internal_notes = updates.internalNotes;
      if (updates.serviceDate !== undefined) dbUpdates.service_date = updates.serviceDate;
      if (updates.timeSlot !== undefined) dbUpdates.time_slot = updates.timeSlot;
      if (updates.startedAt !== undefined) dbUpdates.started_at = updates.startedAt;
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

      const { data, error } = await supabase
        .from('bookings')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Database error updating booking: ${error.message}`);
        console.warn('Supabase update error:', error);
      } else if (data) {
        return mapDbToBooking(data);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase update error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable. Supabase must be configured in production.');
  }
  return globalStore.updateBooking(id, updates);
}

export async function fetchAllServiceAreas(): Promise<ServiceArea[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          nameAr: d.name_ar,
          nameEn: d.name_en,
          isInsideTripoli: d.is_inside_tripoli,
          travelChargeUsd: Number(d.travel_charge_usd),
          available: d.available,
          notesAr: d.notes_ar,
          notesEn: d.notes_en,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch areas error:', err);
    }
  }
  // Return static geographic Tripoli service areas if table is not yet seeded
  return DEFAULT_SERVICE_AREAS;
}

export async function fetchPricingSettings(): Promise<PricingSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pricing_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return {
          standardHourlyRateUsd: Number(data.standard_hourly_rate_usd),
          minimumHoursPerCleaner: Number(data.minimum_hours_per_cleaner),
          seasonalMultiplier: Number(data.seasonal_multiplier),
          seasonalNameAr: data.seasonal_name_ar,
          seasonalNameEn: data.seasonal_name_en,
          recleanGuaranteeHours: Number(data.reclean_guarantee_hours),
          productsAndTransportIncludedInTripoli: data.products_and_transport_included,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch pricing error:', err);
    }
  }
  return DEFAULT_PRICING;
}

export async function updatePricingSettingsInDb(updates: Partial<PricingSettings>): Promise<PricingSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.standardHourlyRateUsd !== undefined) dbUpdates.standard_hourly_rate_usd = updates.standardHourlyRateUsd;
      if (updates.minimumHoursPerCleaner !== undefined) dbUpdates.minimum_hours_per_cleaner = updates.minimumHoursPerCleaner;
      if (updates.seasonalMultiplier !== undefined) dbUpdates.seasonal_multiplier = updates.seasonalMultiplier;
      if (updates.seasonalNameAr !== undefined) dbUpdates.seasonal_name_ar = updates.seasonalNameAr;
      if (updates.seasonalNameEn !== undefined) dbUpdates.seasonal_name_en = updates.seasonalNameEn;
      if (updates.recleanGuaranteeHours !== undefined) dbUpdates.reclean_guarantee_hours = updates.recleanGuaranteeHours;
      if (updates.productsAndTransportIncludedInTripoli !== undefined) dbUpdates.products_and_transport_included = updates.productsAndTransportIncludedInTripoli;

      const { data, error } = await supabase
        .from('pricing_settings')
        .update(dbUpdates)
        .eq('id', 'current_config')
        .select()
        .maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Database error updating pricing: ${error.message}`);
        console.warn('Supabase update pricing error:', error);
      } else if (data) {
        return {
          standardHourlyRateUsd: Number(data.standard_hourly_rate_usd),
          minimumHoursPerCleaner: Number(data.minimum_hours_per_cleaner),
          seasonalMultiplier: Number(data.seasonal_multiplier),
          seasonalNameAr: data.seasonal_name_ar,
          seasonalNameEn: data.seasonal_name_en,
          recleanGuaranteeHours: Number(data.reclean_guarantee_hours),
          productsAndTransportIncludedInTripoli: data.products_and_transport_included,
        };
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase update pricing error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.updatePricing(updates);
}

export async function fetchAllStaff(): Promise<StaffMember[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (isProduction) throw new Error(`Failed to fetch staff: ${error.message}`);
        console.warn('Supabase fetch staff error:', error);
      } else if (data) {
        return data.map(mapDbToStaff);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase fetch staff error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.getAllStaff();
}

export async function insertStaffMember(staff: StaffMember): Promise<StaffMember> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(staff.id);
      const dbPayload: any = {
        full_name_ar: staff.fullNameAr,
        full_name_en: staff.fullNameEn || staff.fullNameAr,
        phone: staff.phone,
        gender: staff.gender || 'female',
        id_card_number: staff.idCardNumber || `TRP-ID-${Math.floor(1000 + Math.random() * 9000)}`,
        uniform_issued: staff.uniformIssued ?? true,
        role: staff.role || 'cleaner',
        active: staff.active ?? true,
        notes: staff.notes || null,
      };
      if (isUuid) {
        dbPayload.id = staff.id;
        dbPayload.user_id = staff.id;
      }

      const { data, error } = await supabase
        .from('staff')
        .insert(dbPayload)
        .select()
        .single();

      if (error) {
        if (isProduction) throw new Error(`Failed to insert staff member: ${error.message}`);
        console.warn('Supabase insert staff error:', error);
      } else if (data) {
        return mapDbToStaff(data);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase insert staff error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.createStaff(staff);
}

export async function updateStaffMemberInDb(id: string, updates: Partial<StaffMember>): Promise<StaffMember | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.fullNameAr !== undefined) dbUpdates.full_name_ar = updates.fullNameAr;
      if (updates.fullNameEn !== undefined) dbUpdates.full_name_en = updates.fullNameEn;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.idCardNumber !== undefined) dbUpdates.id_card_number = updates.idCardNumber;
      if (updates.uniformIssued !== undefined) dbUpdates.uniform_issued = updates.uniformIssued;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      let query = supabase.from('staff').update(dbUpdates);
      if (isUuid) {
        query = query.or(`id.eq.${id},user_id.eq.${id}`);
      } else {
        query = query.eq('id', id);
      }

      const { data, error } = await query.select().maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Failed to update staff: ${error.message}`);
        console.warn('Supabase update staff error:', error);
      } else if (data) {
        return mapDbToStaff(data);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase update staff error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.updateStaff(id, updates);
}

export async function fetchAllCommercialQuotes(): Promise<CommercialQuote[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('commercial_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (isProduction) throw new Error(`Failed to fetch commercial quotes: ${error.message}`);
        console.warn('Supabase fetch quotes error:', error);
      } else if (data) {
        return data.map(mapDbToQuote);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase fetch quotes error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.getAllQuotes();
}

export async function insertCommercialQuote(quote: Omit<CommercialQuote, 'id' | 'createdAt'>): Promise<CommercialQuote> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('commercial_quotes')
        .insert({
          reference: quote.reference,
          company_name: quote.companyName,
          contact_person: quote.contactPerson,
          phone: quote.phone,
          email: quote.email || null,
          business_type: quote.businessType,
          estimated_sqm: quote.estimatedSqm || null,
          frequency: quote.frequency,
          service_needs: quote.serviceNeeds || [],
          preferred_timing: quote.preferredTiming || null,
          address: quote.address,
          area_id: quote.areaId || null,
          notes: quote.notes || null,
          status: quote.status || 'new',
          quoted_amount_usd: quote.quotedAmountUsd || null,
        })
        .select()
        .single();

      if (error) {
        if (isProduction) throw new Error(`Failed to create commercial quote: ${error.message}`);
        console.warn('Supabase insert quote error:', error);
      } else if (data) {
        return mapDbToQuote(data);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase insert quote error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.createQuote(quote);
}

export async function updateCommercialQuote(id: string, updates: Partial<CommercialQuote>): Promise<CommercialQuote | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.quotedAmountUsd !== undefined) dbUpdates.quoted_amount_usd = updates.quotedAmountUsd;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { data, error } = await supabase
        .from('commercial_quotes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        if (isProduction) throw new Error(`Failed to update commercial quote: ${error.message}`);
        console.warn('Supabase update quote error:', error);
      } else if (data) {
        return mapDbToQuote(data);
      }
    } catch (err: any) {
      if (isProduction) throw err;
      console.warn('Supabase update quote error:', err);
    }
  }

  if (isProduction) {
    throw new Error('Database service unavailable in production.');
  }
  return globalStore.updateQuote(id, updates);
}

// Helpers to map DB snakes to camelCase
function mapDbToBooking(d: any): Booking {
  return {
    id: d.id,
    reference: d.reference,
    managementToken: d.management_token,
    serviceCategory: d.service_category,
    serviceType: d.service_type,
    customerName: d.customer_name,
    customerPhone: d.customer_phone,
    customerEmail: d.customer_email,
    areaId: d.area_id,
    areaNameAr: d.area_name_ar,
    areaNameEn: d.area_name_en,
    addressDetails: d.address_details,
    building: d.building,
    floor: d.floor,
    landmark: d.landmark,
    serviceDate: d.service_date,
    timeSlot: d.time_slot,
    cleanersCount: d.cleaners_count,
    estimatedHours: Number(d.estimated_hours),
    hourlyRate: Number(d.hourly_rate),
    seasonalMultiplier: Number(d.seasonal_multiplier || 1),
    cleanersHourlyTotal: Number(d.cleaners_hourly_total),
    travelCharge: Number(d.travel_charge || 0),
    extrasCharge: Number(d.extras_charge || 0),
    selectedExtras: d.selected_extras || [],
    totalPrice: Number(d.total_price),
    currency: 'USD',
    paymentMethod: d.payment_method,
    paymentStatus: d.payment_status || 'pending',
    sameCleanerPreferred: d.same_cleaner_preferred || false,
    preferredCleanerId: d.preferred_cleaner_id,
    photoUrls: d.photo_urls || [],
    customerNotes: d.customer_notes,
    internalNotes: d.internal_notes,
    status: d.status,
    assignedStaffIds: d.assigned_staff_ids || [],
    recleanRequestedAt: d.reclean_requested_at,
    recleanReason: d.reclean_reason,
    recleanScheduledDate: d.reclean_scheduled_date,
    recleanNotes: d.reclean_notes,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    startedAt: d.started_at,
    completedAt: d.completed_at,
  };
}

function mapBookingToDb(b: any) {
  return {
    reference: b.reference,
    management_token: b.managementToken,
    service_category: b.serviceCategory,
    service_type: b.serviceType,
    customer_name: b.customerName,
    customer_phone: b.customerPhone,
    customer_email: b.customerEmail,
    area_id: b.areaId,
    area_name_ar: b.areaNameAr,
    area_name_en: b.areaNameEn,
    address_details: b.addressDetails,
    building: b.building,
    floor: b.floor,
    landmark: b.landmark,
    service_date: b.serviceDate,
    time_slot: b.timeSlot,
    cleaners_count: b.cleanersCount,
    estimated_hours: b.estimatedHours,
    hourly_rate: b.hourlyRate,
    seasonal_multiplier: b.seasonalMultiplier,
    cleaners_hourly_total: b.cleanersHourlyTotal,
    travel_charge: b.travelCharge,
    extras_charge: b.extrasCharge,
    selected_extras: b.selectedExtras,
    total_price: b.totalPrice,
    currency: 'USD',
    payment_method: b.paymentMethod,
    payment_status: b.paymentStatus,
    same_cleaner_preferred: b.sameCleanerPreferred,
    preferred_cleaner_id: b.preferredCleanerId,
    photo_urls: b.photoUrls,
    customer_notes: b.customerNotes,
    internal_notes: b.internalNotes,
    status: b.status,
    assigned_staff_ids: b.assignedStaffIds,
  };
}

function mapDbToStaff(d: any): StaffMember {
  return {
    id: d.id,
    fullNameAr: d.full_name_ar,
    fullNameEn: d.full_name_en,
    gender: d.gender,
    phone: d.phone,
    idCardNumber: d.id_card_number,
    uniformIssued: d.uniform_issued,
    active: d.active,
    role: d.role,
    notes: d.notes,
  };
}

function mapDbToQuote(d: any): CommercialQuote {
  return {
    id: d.id,
    reference: d.reference,
    companyName: d.company_name,
    contactPerson: d.contact_person,
    phone: d.phone,
    email: d.email,
    businessType: d.business_type,
    estimatedSqm: d.estimated_sqm != null ? Number(d.estimated_sqm) : undefined,
    frequency: d.frequency,
    serviceNeeds: d.service_needs || [],
    preferredTiming: d.preferred_timing,
    address: d.address,
    areaId: d.area_id,
    notes: d.notes,
    status: d.status,
    quotedAmountUsd: d.quoted_amount_usd != null ? Number(d.quoted_amount_usd) : undefined,
    createdAt: d.created_at,
  };
}
