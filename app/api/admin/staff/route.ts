import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getSupabaseAdminClient, logAuditAction } from '@/lib/supabase/server';
import { fetchAllStaff, insertStaffMember, updateStaffMemberInDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { auth, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const supabase = getSupabaseAdminClient();
    let staffList = await fetchAllStaff();

    // If Supabase is active, enrich with auth profiles
    if (supabase) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

      if (profiles && profiles.length > 0) {
        // Merge profiles with staff list
        const profileMap = new Map(profiles.map(p => [p.id, p]));
        staffList = staffList.map(s => {
          const matchedProfile = s.id ? profileMap.get(s.id) : undefined;
          return {
            ...s,
            email: matchedProfile?.email,
            active: matchedProfile ? matchedProfile.is_active : s.active,
          };
        });
      }
    }

    return NextResponse.json({ staff: staffList });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch staff list' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { auth, response } = await requireAdmin(req);
  if (response || !auth) return response!;

  try {
    const body = await req.json();
    const { email, password, fullNameAr, fullNameEn, phone, gender, idCardNumber, role, notes } = body;

    if (!email || !password || !fullNameAr || !phone) {
      return NextResponse.json(
        { error: 'Email, password, Arabic full name, and phone are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    let authUserId: string | undefined;

    if (supabase) {
      // Create user securely in auth.users via Supabase Admin API
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullNameAr,
          role: 'staff',
        },
      });

      if (createError) {
        return NextResponse.json(
          { error: `Supabase user creation failed: ${createError.message}` },
          { status: 400 }
        );
      }

      authUserId = userData.user.id;

      // Upsert into profiles table
      await supabase.from('profiles').upsert({
        id: authUserId,
        email,
        full_name: fullNameAr,
        phone,
        role: 'staff',
        is_active: true,
      });
    }

    // Insert into staff operational database
    const finalStaffId = authUserId || `stf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newStaff = await insertStaffMember({
      id: finalStaffId,
      fullNameAr,
      fullNameEn: fullNameEn || fullNameAr,
      gender: gender || 'female',
      phone,
      idCardNumber: idCardNumber || `TRP-ID-${Math.floor(4000 + Math.random() * 1000)}`,
      uniformIssued: true,
      active: true,
      role: role || 'cleaner',
      notes,
    });

    // Audit log
    await logAuditAction({
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      action: 'staff_account_created',
      targetType: 'staff',
      targetId: newStaff.id,
      details: { email, fullNameAr, role: newStaff.role },
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, staff: newStaff }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating staff member:', err);
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { auth, response } = await requireAdmin(req);
  if (response || !auth) return response!;

  try {
    const body = await req.json();
    const { id, active, phone, notes, role } = body;

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (supabase && active !== undefined) {
      // Update is_active in profiles table
      await supabase
        .from('profiles')
        .update({ is_active: Boolean(active), updated_at: new Date().toISOString() })
        .eq('id', id);
    }

    const updated = await updateStaffMemberInDb(id, {
      active: active !== undefined ? Boolean(active) : undefined,
      phone,
      notes,
      role,
    });

    // Audit log
    await logAuditAction({
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      action: active === false ? 'staff_account_deactivated' : 'staff_account_updated',
      targetType: 'staff',
      targetId: id,
      details: { active, role },
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}
