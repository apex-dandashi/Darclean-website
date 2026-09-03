import { NextRequest, NextResponse } from 'next/server';
import { fetchAllCommercialQuotes, insertCommercialQuote, updateCommercialQuote } from '@/lib/db';

export async function GET() {
  try {
    const quotes = await fetchAllCommercialQuotes();
    return NextResponse.json({ quotes });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch commercial quotes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.contactPerson || !body.phone) {
      return NextResponse.json(
        { error: 'Missing company name, contact person, or phone' },
        { status: 400 }
      );
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reference = `CQ-TRP-${new Date().getFullYear()}-${randomDigits}`;

    const newQuote = await insertCommercialQuote({
      reference,
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      phone: body.phone,
      email: body.email,
      businessType: body.businessType || 'office',
      estimatedSqm: Number(body.estimatedSqm) || undefined,
      frequency: body.frequency || 'weekly',
      serviceNeeds: body.serviceNeeds || [],
      preferredTiming: body.preferredTiming || 'evening',
      address: body.address || 'طرابلس',
      areaId: body.areaId || 'tripoli_central',
      notes: body.notes,
      status: 'new',
    });

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating commercial quote:', err);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing quote id' }, { status: 400 });
    }

    const updated = await updateCommercialQuote(body.id, {
      status: body.status,
      quotedAmountUsd: body.quotedAmountUsd !== undefined ? Number(body.quotedAmountUsd) : undefined,
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
