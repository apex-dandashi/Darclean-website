import { NextRequest, NextResponse } from 'next/server';
import { fetchAllBookings, insertBooking, fetchAllStaff } from '@/lib/db';
import { BookingStatus } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/supabase/server';

// Rate limiting in-memory check (prevents spam submissions)
const submissionIps = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = submissionIps.get(ip);
  if (!entry || now > entry.resetTime) {
    submissionIps.set(ip, { count: 1, resetTime: now + 60000 }); // 1 min window
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  // Public users CANNOT read internal bookings
  const { auth, error, statusCode } = await getAuthenticatedUser(req);
  if (!auth) {
    return NextResponse.json(
      { error: error || 'Authentication required to view bookings.' },
      { status: statusCode || 401 }
    );
  }

  try {
    const allBookings = await fetchAllBookings();

    // Administrators get full access to all bookings
    if (auth.profile.role === 'admin') {
      return NextResponse.json({ bookings: allBookings });
    }

    // Staff members only receive bookings assigned to them
    if (auth.profile.role === 'staff') {
      const staffList = await fetchAllStaff();
      // Find staff record associated with this auth user (by user id or email or id)
      const staffMember = staffList.find(
        (s) => s.id === auth.user.id || s.phone === auth.profile.phone
      );
      const staffId = staffMember?.id || auth.user.id;

      const staffBookings = allBookings.filter((b) =>
        b.assignedStaffIds?.some((id) => id === staffId || id === auth.user.id)
      );

      return NextResponse.json({ bookings: staffBookings });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Validation
    if (!body.customerName || !body.customerPhone || !body.addressDetails) {
      return NextResponse.json(
        { error: 'Missing required customer contact or address fields' },
        { status: 400 }
      );
    }

    const cleanersCount = Math.max(1, Number(body.cleanersCount) || 1);
    // Enforce 2-hour minimum per cleaner
    const estimatedHours = Math.max(2, Number(body.estimatedHours) || 2);
    const hourlyRate = Number(body.hourlyRate) || 10.0;
    const seasonalMultiplier = Number(body.seasonalMultiplier) || 1.0;
    const travelCharge = Number(body.travelCharge) || 0.0;
    const extrasCharge = Number(body.extrasCharge) || 0.0;

    const cleanersHourlyTotal = cleanersCount * estimatedHours * hourlyRate * seasonalMultiplier;
    const totalPrice = cleanersHourlyTotal + travelCharge + extrasCharge;

    // Generate unique Tripoli reference code: DC-TRP-XXXXXX
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const reference = `DC-TRP-${randomDigits}`;

    // Generate secret management token for client self-service
    const managementToken = `dc_sec_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const newBooking = await insertBooking({
      reference,
      managementToken,
      serviceCategory: body.serviceCategory || 'home',
      serviceType: body.serviceType || 'standard_home',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      areaId: body.areaId || 'tripoli_central',
      areaNameAr: body.areaNameAr || 'طرابلس (وسط المدينة / التل / الزاهرية)',
      areaNameEn: body.areaNameEn || 'Tripoli Central',
      addressDetails: body.addressDetails,
      building: body.building,
      floor: body.floor,
      landmark: body.landmark,
      serviceDate: body.serviceDate || new Date().toISOString().split('T')[0],
      timeSlot: body.timeSlot || '09:00 - 12:00',
      cleanersCount,
      estimatedHours,
      hourlyRate,
      seasonalMultiplier,
      cleanersHourlyTotal,
      travelCharge,
      extrasCharge,
      selectedExtras: body.selectedExtras || [],
      totalPrice,
      currency: 'USD',
      paymentMethod: body.paymentMethod || 'cash',
      paymentStatus: 'pending',
      sameCleanerPreferred: Boolean(body.sameCleanerPreferred),
      status: 'new' as BookingStatus,
      assignedStaffIds: [],
      photoUrls: body.photoUrls || [],
      customerNotes: body.customerNotes,
    });

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating booking:', err);
    return NextResponse.json(
      { error: 'Internal server error creating booking' },
      { status: 500 }
    );
  }
}
