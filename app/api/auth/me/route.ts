import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { auth, error, statusCode } = await getAuthenticatedUser(req);

  if (!auth) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: statusCode || 401 });
  }

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
    },
    profile: auth.profile,
  });
}
