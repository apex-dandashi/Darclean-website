import { NextRequest, NextResponse } from 'next/server';
import { fetchBookingByIdOrReference, updateBookingStatusOrDetails, fetchAllStaff } from '@/lib/db';
import { getAuthenticatedUser, logAuditAction } from '@/lib/supabase/server';

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

    // 1. Customer accessing via valid management token
    if (token && booking.managementToken === token) {
      return NextResponse.json({ booking });
    }

    // 2. Authenticated Admin or Staff
    const { auth } = await getAuthenticatedUser(req);
    if (auth) {
      if (auth.profile.role === 'admin') {
        return NextResponse.json({ booking });
      }

      if (auth.profile.role === 'staff') {
        const staffList = await fetchAllStaff();
        const staffMember = staffList.find(
          (s) => s.id === auth.user.id || s.phone === auth.profile.phone
        );
        const staffId = staffMember?.id || auth.user.id;

        const isAssigned = booking.assignedStaffIds?.some(
          (sid) => sid === staffId || sid === auth.user.id
        );

        if (isAssigned) {
          return NextResponse.json({ booking });
        }

        return NextResponse.json(
          { error: 'Forbidden. You are not assigned to this booking.' },
          { status: 403 }
        );
      }
    }

    // Unauthorized for public visitors without token
    return NextResponse.json(
      { error: 'Unauthorized. Access token or login required.' },
      { status: 401 }
    );
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
    const booking = await fetchBookingByIdOrReference(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const token = body.managementToken || searchParams.get('token');
    const { auth } = await getAuthenticatedUser(req);

    const isCustomerWithToken = Boolean(token && booking.managementToken === token);
    const isAdmin = auth?.profile.role === 'admin';
    let isAssignedStaff = false;

    if (auth?.profile.role === 'staff') {
      const staffList = await fetchAllStaff();
      const staffMember = staffList.find(
        (s) => s.id === auth.user.id || s.phone === auth.profile.phone
      );
      const staffId = staffMember?.id || auth.user.id;
      isAssignedStaff = Boolean(
        booking.assignedStaffIds?.some((sid) => sid === staffId || sid === auth.user.id)
      );
    }

    if (!isCustomerWithToken && !isAdmin && !isAssignedStaff) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden to update this booking' },
        { status: 403 }
      );
    }

    const updates: any = {};

    // Customer self-management actions
    if (isCustomerWithToken && !isAdmin && !isAssignedStaff) {
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
          return NextResponse.json(
            { error: 'Please provide reason for the re-clean request' },
            { status: 400 }
          );
        }
        updates.status = 'reclean_requested';
        updates.recleanRequestedAt = new Date().toISOString();
        updates.recleanReason = body.recleanReason;
      } else {
        return NextResponse.json({ error: 'Invalid client action' }, { status: 400 });
      }
    }

    // Staff permissions: only update status, checklist, or staff notes
    if (isAssignedStaff && !isAdmin) {
      const allowedStaffStatuses = ['on_the_way', 'in_progress', 'completed'];
      if (body.status) {
        if (!allowedStaffStatuses.includes(body.status)) {
          return NextResponse.json(
            { error: 'Staff can only set status to on_the_way, in_progress, or completed' },
            { status: 403 }
          );
        }
        updates.status = body.status;
        if (body.status === 'in_progress' && !booking.startedAt) {
          updates.startedAt = new Date().toISOString();
        }
        if (body.status === 'completed' && !booking.completedAt) {
          updates.completedAt = new Date().toISOString();
        }
      }
      if (body.internalNotes) {
        updates.internalNotes = `${booking.internalNotes ? booking.internalNotes + '\n' : ''}[Staff Note ${new Date().toLocaleTimeString()}]: ${body.internalNotes}`;
      }
    }

    // Admin permissions: full access
    if (isAdmin) {
      if (body.status) updates.status = body.status;
      if (body.assignedStaffIds) updates.assignedStaffIds = body.assignedStaffIds;
      if (body.paymentStatus) updates.paymentStatus = body.paymentStatus;
      if (body.internalNotes) updates.internalNotes = body.internalNotes;
      if (body.recleanScheduledDate) updates.recleanScheduledDate = body.recleanScheduledDate;
      if (body.serviceDate) updates.serviceDate = body.serviceDate;
      if (body.timeSlot) updates.timeSlot = body.timeSlot;
    }

    const updated = await updateBookingStatusOrDetails(booking.id, updates);

    // Audit log if admin or staff action
    if (auth) {
      await logAuditAction({
        actorId: auth.user.id,
        actorEmail: auth.user.email,
        action: 'booking_updated',
        targetType: 'booking',
        targetId: booking.id,
        details: { updates, reference: booking.reference },
        ipAddress: req.headers.get('x-forwarded-for') || undefined,
      });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
