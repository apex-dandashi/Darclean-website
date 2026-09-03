import { NextRequest, NextResponse } from 'next/server';
import { fetchBookingByIdOrReference, updateBookingStatusOrDetails } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  try {
    const booking = await fetchBookingByIdOrReference(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // If customer accessing via private link, ensure token matches (or allow read if no secrets leaked)
    return NextResponse.json({ booking });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve booking' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await fetchBookingByIdOrReference(id);

    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check action type:
    // 1. Reschedule
    // 2. Cancel
    // 3. Request Re-clean
    // 4. Admin update
    const updates: any = {};

    if (body.action === 'reschedule') {
      if (!body.serviceDate) {
        return NextResponse.json({ error: 'Missing new service date' }, { status: 400 });
      }
      updates.serviceDate = body.serviceDate;
      if (body.timeSlot) updates.timeSlot = body.timeSlot;
      updates.status = 'awaiting_confirmation';
    } else if (body.action === 'cancel') {
      updates.status = 'cancelled';
    } else if (body.action === 'request_reclean') {
      if (!body.recleanReason) {
        return NextResponse.json({ error: 'Please provide reason or notes for the re-clean request' }, { status: 400 });
      }
      updates.status = 'reclean_requested';
      updates.recleanRequestedAt = new Date().toISOString();
      updates.recleanReason = body.recleanReason;
    } else {
      // General field update
      if (body.status) updates.status = body.status;
      if (body.assignedStaffIds) updates.assignedStaffIds = body.assignedStaffIds;
      if (body.paymentStatus) updates.paymentStatus = body.paymentStatus;
      if (body.internalNotes) updates.internalNotes = body.internalNotes;
      if (body.recleanScheduledDate) updates.recleanScheduledDate = body.recleanScheduledDate;
    }

    const updated = await updateBookingStatusOrDetails(existing.id, updates);
    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
