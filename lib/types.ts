export type Language = 'ar' | 'en';

export type ServiceCategory = 'home' | 'business';

export type ServiceType = 
  | 'standard_home'
  | 'deep_home'
  | 'move_in_out'
  | 'post_renovation'
  | 'office_commercial'
  | 'retail_store'
  | 'clinic_medical'
  | 'custom_commercial';

export type BookingStatus =
  | 'new'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'staff_assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'reclean_requested'
  | 'reclean_scheduled'
  | 'closed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'whish';
export type PaymentStatus = 'pending' | 'received' | 'refunded';

export interface ServiceArea {
  id: string;
  nameAr: string;
  nameEn: string;
  isInsideTripoli: boolean;
  travelChargeUsd: number;
  available: boolean;
  notesAr?: string;
  notesEn?: string;
}

export interface PricingSettings {
  standardHourlyRateUsd: number;
  minimumHoursPerCleaner: number;
  seasonalMultiplier: number;
  seasonalNameAr: string;
  seasonalNameEn: string;
  recleanGuaranteeHours: number; // e.g. 24 hours after completion
  productsAndTransportIncludedInTripoli: boolean;
}

export interface StaffMember {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  gender: 'female' | 'male';
  phone: string;
  idCardNumber: string;
  uniformIssued: boolean;
  active: boolean;
  role: 'cleaner' | 'team_lead' | 'supervisor';
  notes?: string;
}

export interface Booking {
  id: string;
  reference: string; // e.g. DC-TRP-849201
  managementToken: string;
  serviceCategory: ServiceCategory;
  serviceType: ServiceType;
  
  // Customer info
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  // Location
  areaId: string;
  areaNameAr: string;
  areaNameEn: string;
  addressDetails: string;
  building?: string;
  floor?: string;
  landmark?: string;
  
  // Date & Time
  serviceDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:30 - 10:30" or "Morning (09:00)"
  
  // Cleaners and Duration
  cleanersCount: number; // Min 1
  estimatedHours: number; // Min 2 per cleaner
  
  // Rates & Breakdown
  hourlyRate: number; // Base rate at time of booking
  seasonalMultiplier: number;
  cleanersHourlyTotal: number; // cleanersCount * estimatedHours * hourlyRate * seasonalMultiplier
  travelCharge: number;
  extrasCharge: number;
  selectedExtras: string[];
  totalPrice: number; // Final confirmed price
  currency: 'USD';
  
  // Preferences & Extras
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  sameCleanerPreferred: boolean;
  preferredCleanerId?: string;
  photoUrls?: string[];
  customerNotes?: string;
  internalNotes?: string;
  
  // Status & Assignment
  status: BookingStatus;
  assignedStaffIds: string[];
  assignedStaffNames?: string[];
  
  // Corrective re-clean support
  recleanRequestedAt?: string;
  recleanReason?: string;
  recleanScheduledDate?: string;
  recleanNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CommercialQuote {
  id: string;
  reference: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  businessType: string;
  estimatedSqm?: number;
  frequency: 'one_off' | 'daily' | 'twice_weekly' | 'weekly' | 'bi_weekly' | 'monthly';
  serviceNeeds: string[];
  preferredTiming: string;
  address: string;
  areaId: string;
  notes?: string;
  status: 'new' | 'contacted' | 'survey_scheduled' | 'quote_sent' | 'approved' | 'declined';
  quotedAmountUsd?: number;
  createdAt: string;
}

export interface ExtraServiceOption {
  id: string;
  nameAr: string;
  nameEn: string;
  priceUsd: number;
  descriptionAr: string;
  descriptionEn: string;
}
