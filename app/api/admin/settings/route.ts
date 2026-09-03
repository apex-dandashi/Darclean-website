import { NextRequest, NextResponse } from 'next/server';
import { fetchPricingSettings, updatePricingSettingsInDb, fetchAllStaff } from '@/lib/db';

export async function GET() {
  try {
    const pricing = await fetchPricingSettings();
    const staff = await fetchAllStaff();
    return NextResponse.json({ pricing, staff });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ success: true, pricing: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
