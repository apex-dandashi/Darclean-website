import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function syncAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `darclean-auth-token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = 'darclean-auth-token=; path=/; max-age=0; SameSite=Lax';
  }
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing in browser environment.');
    return null;
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'darclean-auth-token',
    },
  });

  browserClient.auth.onAuthStateChange((_event, session) => {
    syncAuthCookie(session?.access_token || null);
  });

  return browserClient;
}
