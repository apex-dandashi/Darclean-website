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

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'stf-01',
    fullNameAr: 'فاطمة المير',
    fullNameEn: 'Fatima Al-Mir',
    gender: 'female',
    phone: '+961 70 112 233',
    idCardNumber: 'TRP-ID-4401',
    uniformIssued: true,
    active: true,
    role: 'team_lead',
    notes: 'خبرة 4 سنوات في تنظيف الفيلات والشقق المفروشة في الميناء وضم وفرز',
  },
  {
    id: 'stf-02',
    fullNameAr: 'أحمد الحصني',
    fullNameEn: 'Ahmad Al-Hosni',
    gender: 'male',
    phone: '+961 71 889 900',
    idCardNumber: 'TRP-ID-4402',
    uniformIssued: true,
    active: true,
    role: 'cleaner',
    notes: 'متخصص في ماكينات غسيل السجاد والواجهات الزجاجية للمكاتب',
  },
  {
    id: 'stf-03',
    fullNameAr: 'نور كبارة',
    fullNameEn: 'Nour Kabbara',
    gender: 'female',
    phone: '+961 76 554 433',
    idCardNumber: 'TRP-ID-4403',
    uniformIssued: true,
    active: true,
    role: 'cleaner',
    notes: 'دقيقة في تفاصيل المطابخ والتعقيم المنزلي',
  },
  {
    id: 'stf-04',
    fullNameAr: 'عمر درويش',
    fullNameEn: 'Omar Darwish',
    gender: 'male',
    phone: '+961 03 667 788',
    idCardNumber: 'TRP-ID-4404',
    uniformIssued: true,
    active: true,
    role: 'cleaner',
    notes: 'تنظيف ما بعد الصيانة ودهان الشقق والمؤسسات',
  },
];

// Fallback in-memory store for dev / preview resilience
class ResilientDataStore {
  private bookings: Map<string, Booking> = new Map();
  private quotes: Map<string, CommercialQuote> = new Map();
  private staff: Map<string, StaffMember> = new Map();
  private areas: Map<string, ServiceArea> = new Map();
  private pricing: PricingSettings = { ...DEFAULT_PRICING };

  constructor() {
    // Seed areas
    DEFAULT_SERVICE_AREAS.forEach((area) => this.areas.set(area.id, area));
    // Seed staff
    DEFAULT_STAFF.forEach((member) => this.staff.set(member.id, member));

    // Seed realistic sample bookings in Tripoli
    const sampleBooking1: Booking = {
      id: 'bk-tripoli-01',
      reference: 'DC-TRP-841920',
      managementToken: 'dc_token_dam_w_farez_9921',
      serviceCategory: 'home',
      serviceType: 'standard_home',
      customerName: 'طارق غندور',
      customerPhone: '+961 70 234 567',
      customerEmail: 'tarek.g@example.com',
      areaId: 'dam_w_farez',
      areaNameAr: 'طرابلس (ضم وفرز / المعرض / المئتين)',
      areaNameEn: 'Tripoli (Dam w Farez / Maarad / Al-Miatayn)',
      addressDetails: 'شارع المعرض، بناية الواحة، طابق 4',
      building: 'بناية الواحة',
      floor: 'الرابع',
      landmark: 'خلف باتيسري سابليه',
      serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      timeSlot: '09:00 - 12:00 (صباحاً)',
      cleanersCount: 2,
      estimatedHours: 3,
      hourlyRate: 10.0,
      seasonalMultiplier: 1.0,
      cleanersHourlyTotal: 60.0, // 2 cleaners * 3 hrs * $10
      travelCharge: 0,
      extrasCharge: 0,
      selectedExtras: [],
      totalPrice: 60.0,
      currency: 'USD',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      sameCleanerPreferred: true,
      preferredCleanerId: 'stf-01',
      status: 'confirmed',
      assignedStaffIds: ['stf-01', 'stf-03'],
      assignedStaffNames: ['فاطمة المير', 'نور كبارة'],
      customerNotes: 'الرجاء التركيز على تنظيف الشرفة والمطبخ جيداً',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    };

    const sampleBooking2: Booking = {
      id: 'bk-tripoli-02',
      reference: 'DC-TRP-930412',
      managementToken: 'dc_token_mina_8401',
      serviceCategory: 'home',
      serviceType: 'deep_home',
      customerName: 'رانيا الحلبي',
      customerPhone: '+961 76 890 123',
      customerEmail: 'rania.halabi@example.com',
      areaId: 'mina',
      areaNameAr: 'الميناء (الكورنيش / الميناء القديم / مار الياس)',
      areaNameEn: 'Al-Mina (Corniche / Old Port / Mar Elias)',
      addressDetails: 'كورنيش الميناء، بجانب كافيه بحري، بناية صيداوي طابق 2',
      building: 'بناية صيداوي',
      floor: 'الثاني',
      landmark: 'قرب كافيه بحري',
      serviceDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '13:00 - 16:00 (بعد الظهر)',
      cleanersCount: 1,
      estimatedHours: 4,
      hourlyRate: 10.0,
      seasonalMultiplier: 1.0,
      cleanersHourlyTotal: 40.0,
      travelCharge: 0,
      extrasCharge: 10.0,
      selectedExtras: ['oven_deep_clean'],
      totalPrice: 50.0,
      currency: 'USD',
      paymentMethod: 'whish',
      paymentStatus: 'pending',
      sameCleanerPreferred: false,
      status: 'awaiting_confirmation',
      assignedStaffIds: [],
      customerNotes: 'الدفع سيتم عبر Whish Money فور التأكيد',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    };

    const sampleBooking3: Booking = {
      id: 'bk-tripoli-03',
      reference: 'DC-TRP-771239',
      managementToken: 'dc_token_qalamoun_5502',
      serviceCategory: 'business',
      serviceType: 'office_commercial',
      customerName: 'مكتب المحامي سامي كبارة',
      customerPhone: '+961 03 445 566',
      areaId: 'tripoli_central',
      areaNameAr: 'طرابلس (وسط المدينة / التل / الزاهرية)',
      areaNameEn: 'Tripoli Central (Al-Tell / Zaheriyeh)',
      addressDetails: 'ساحة التل، بناية فتال سنتر، طابق 5',
      serviceDate: new Date().toISOString().split('T')[0], // Today
      timeSlot: '08:30 - 11:30 (صباحاً)',
      cleanersCount: 2,
      estimatedHours: 2.5,
      hourlyRate: 10.0,
      seasonalMultiplier: 1.0,
      cleanersHourlyTotal: 50.0,
      travelCharge: 0,
      extrasCharge: 0,
      selectedExtras: [],
      totalPrice: 50.0,
      currency: 'USD',
      paymentMethod: 'cash',
      paymentStatus: 'received',
      sameCleanerPreferred: false,
      status: 'in_progress',
      assignedStaffIds: ['stf-02', 'stf-04'],
      assignedStaffNames: ['أحمد الحصني', 'عمر درويش'],
      customerNotes: 'مكتب محاماة، هدوء واحترام المستندات والملفات',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };

    this.bookings.set(sampleBooking1.id, sampleBooking1);
    this.bookings.set(sampleBooking2.id, sampleBooking2);
    this.bookings.set(sampleBooking3.id, sampleBooking3);

    // Seed realistic commercial quote
    const sampleQuote: CommercialQuote = {
      id: 'qt-comm-01',
      reference: 'CQ-TRP-2026-001',
      companyName: 'عيادات الفيحاء التخصصية',
      contactPerson: 'د. زياد شعراني',
      phone: '+961 71 443 322',
      email: 'dr.ziad@fayhaa-clinics.com',
      businessType: 'clinic_medical',
      estimatedSqm: 280,
      frequency: 'twice_weekly',
      serviceNeeds: ['تعقيم الأرضيات الطبية', 'تنظيف غرف الانتظار', 'تفريغ وتطهير سلات المهملات'],
      preferredTiming: 'مساءً بعد الساعة 7 (بعد انتهاء دوام المرضى)',
      address: 'طرابلس، شارع المصارف، بناية النور الطبي',
      areaId: 'tripoli_central',
      notes: 'نحتاج فريق عمل بزي موحد ومعقمات معتمدة',
      status: 'survey_scheduled',
      quotedAmountUsd: 320,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    };
    this.quotes.set(sampleQuote.id, sampleQuote);
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

// Database helper functions that transparently query Supabase when configured,
// or fallback to the in-memory store for instant preview & development.

export async function fetchAllBookings(): Promise<Booking[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapDbToBooking);
      }
    } catch (err) {
      console.warn('Supabase fetch bookings error, using store:', err);
    }
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
        .single();
      if (!error && data) {
        return mapDbToBooking(data);
      }
    } catch (err) {
      console.warn('Supabase fetch booking error:', err);
    }
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
        .single();
      if (!error && data) {
        return mapDbToBooking(data);
      }
    } catch (err) {
      console.warn('Supabase fetch booking by token error:', err);
    }
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
      if (!error && data) {
        const mapped = mapDbToBooking(data);
        globalStore.createBooking(booking); // keep in sync
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase insert error, falling back to store:', err);
    }
  }
  return globalStore.createBooking(booking);
}

export async function updateBookingStatusOrDetails(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: updates.status,
          assigned_staff_ids: updates.assignedStaffIds,
          payment_status: updates.paymentStatus,
          reclean_requested_at: updates.recleanRequestedAt,
          reclean_reason: updates.recleanReason,
          reclean_scheduled_date: updates.recleanScheduledDate,
          internal_notes: updates.internalNotes,
          service_date: updates.serviceDate,
          time_slot: updates.timeSlot,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return mapDbToBooking(data);
      }
    } catch (err) {
      console.warn('Supabase update error:', err);
    }
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
  return globalStore.getAllAreas();
}

export async function fetchPricingSettings(): Promise<PricingSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pricing_settings')
        .select('*')
        .limit(1)
        .single();
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
  return globalStore.getPricing();
}

export async function updatePricingSettingsInDb(updates: Partial<PricingSettings>): Promise<PricingSettings> {
  return globalStore.updatePricing(updates);
}

export async function fetchAllStaff(): Promise<StaffMember[]> {
  return globalStore.getAllStaff();
}

export async function fetchAllCommercialQuotes(): Promise<CommercialQuote[]> {
  return globalStore.getAllQuotes();
}

export async function insertCommercialQuote(quote: Omit<CommercialQuote, 'id' | 'createdAt'>): Promise<CommercialQuote> {
  return globalStore.createQuote(quote);
}

export async function updateCommercialQuote(id: string, updates: Partial<CommercialQuote>): Promise<CommercialQuote | null> {
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
