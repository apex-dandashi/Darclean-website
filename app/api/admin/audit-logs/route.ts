import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { auth, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        return NextResponse.json({ logs: data });
      }
    }

    // Default empty if not yet populated
    return NextResponse.json({ logs: [] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
