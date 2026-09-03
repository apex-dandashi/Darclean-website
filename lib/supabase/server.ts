import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { UserProfile, UserRole } from '@/lib/types';

let adminClient: SupabaseClient | null = null;

/**
 * Returns the Supabase Admin client with service_role privileges.
 * This client is strictly server-only and must never be leaked to the client.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

/**
 * Extracts Bearer token from request Authorization header or cookies
 */
export function extractAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check cookies as fallback
  const tokenCookie = req.cookies.get('darclean-auth-token')?.value;
  if (tokenCookie) {
    try {
      const parsed = JSON.parse(tokenCookie);
      if (parsed?.access_token) return parsed.access_token;
    } catch {
      return tokenCookie;
    }
  }

  const sbToken = req.cookies.get('sb-access-token')?.value;
  if (sbToken) return sbToken;

  return null;
}

export interface AuthContext {
  user: User;
  profile: UserProfile;
}

/**
 * Authenticates request using Supabase Auth JWT and loads profile
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<{
  auth: AuthContext | null;
  error?: string;
  statusCode?: number;
}> {
  const token = extractAuthToken(req);
  if (!token) {
    return { auth: null, error: 'Authentication required. No Bearer token provided.', statusCode: 401 };
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use admin client if available, or client with token
  if (!supabaseUrl) {
    return { auth: null, error: 'Database service is not configured.', statusCode: 500 };
  }

  try {
    const client = supabaseAdmin || createClient(supabaseUrl, anonKey || '');
    const { data: { user }, error: userError } = await client.auth.getUser(token);

    if (userError || !user) {
      return { auth: null, error: userError?.message || 'Invalid or expired session.', statusCode: 401 };
    }

    // Fetch user profile
    let profile: UserProfile | null = null;
    if (supabaseAdmin) {
      const { data: profileData, error: profileErr } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileErr && profileData) {
        profile = {
          id: profileData.id,
          email: profileData.email || user.email || '',
          role: profileData.role as UserRole,
          fullName: profileData.full_name || user.user_metadata?.full_name || 'Staff Member',
          phone: profileData.phone,
          isActive: profileData.is_active !== false,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };
      }
    }

    // Fallback: If profile table doesn't have it yet, derive from user metadata safely
    if (!profile) {
      const role = (user.user_metadata?.role === 'admin' ? 'admin' : 'staff') as UserRole;
      profile = {
        id: user.id,
        email: user.email || '',
        role,
        fullName: user.user_metadata?.full_name || (user.email?.split('@')[0] ?? 'User'),
        isActive: true,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      };
    }

    if (!profile.isActive) {
      return { auth: null, error: 'Your account has been deactivated. Please contact an administrator.', statusCode: 403 };
    }

    return { auth: { user, profile } };
  } catch (err: any) {
    return { auth: null, error: err?.message || 'Authentication error', statusCode: 500 };
  }
}

/**
 * Route guard requiring Administrator role
 */
export async function requireAdmin(req: NextRequest): Promise<{
  auth: AuthContext | null;
  response?: NextResponse;
}> {
  const result = await getAuthenticatedUser(req);
  if (!result.auth) {
    return {
      auth: null,
      response: NextResponse.json(
        { error: result.error || 'Unauthorized' },
        { status: result.statusCode || 401 }
      ),
    };
  }

  if (result.auth.profile.role !== 'admin') {
    return {
      auth: null,
      response: NextResponse.json(
        { error: 'Forbidden. Administrator permissions required.' },
        { status: 403 }
      ),
    };
  }

  return { auth: result.auth };
}

/**
 * Route guard requiring Staff or Administrator role
 */
export async function requireStaffOrAdmin(req: NextRequest): Promise<{
  auth: AuthContext | null;
  response?: NextResponse;
}> {
  const result = await getAuthenticatedUser(req);
  if (!result.auth) {
    return {
      auth: null,
      response: NextResponse.json(
        { error: result.error || 'Unauthorized' },
        { status: result.statusCode || 401 }
      ),
    };
  }

  return { auth: result.auth };
}

/**
 * Logs sensitive administrative and operational actions into public.audit_logs
 */
export async function logAuditAction(params: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  try {
    await supabase.from('audit_logs').insert({
      actor_id: params.actorId || null,
      actor_email: params.actorEmail || null,
      action: params.action,
      target_type: params.targetType || null,
      target_id: params.targetId || null,
      details: params.details || {},
      ip_address: params.ipAddress || null,
    });
  } catch (err) {
    console.warn('Failed to insert audit log:', err);
  }
}
