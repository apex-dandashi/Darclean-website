import { NextRequest, NextResponse } from 'next/server';
import { fetchPricingSettings, updatePricingSettingsInDb, fetchAllStaff } from '@/lib/db';
import { requireAdmin, logAuditAction } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  // Can provide pricing to all, but staff list only if admin
  try {
    const pricing = await fetchPricingSettings();
    const { auth } = await requireAdmin(req);
    const staff = auth ? await fetchAllStaff() : [];
    return NextResponse.json({ pricing, staff });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { auth, response } = await requireAdmin(req);
  if (response || !auth) return response!;

  try {
    const body = await req.json();
    const updated = await updatePricingSettingsInDb({
      standardHourlyRateUsd: body.standardHourlyRateUsd ? Number(body.standardHourlyRateUsd) : undefined,
      minimumHoursPerCleaner: body.minimumHoursPerCleaner ? Number(body.minimumHoursPerCleaner) : undefined,
      seasonalMultiplier: body.seasonalMultiplier ? Number(body.seasonalMultiplier) : undefined,
      seasonalNameAr: body.seasonalNameAr,
      seasonalNameEn: body.seasonalNameEn,
      recleanGuaranteeHours: body.recleanGuaranteeHours ? Number(body.recleanGuaranteeHours) : undefined,
    });

    await logAuditAction({
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      action: 'pricing_settings_updated',
      targetType: 'pricing_settings',
      details: body,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, pricing: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

