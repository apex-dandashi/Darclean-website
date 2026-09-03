import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /staff routes on server
  if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
    let token =
      request.cookies.get('darclean-auth-token')?.value ||
      request.cookies.get('sb-access-token')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer /i, '');

    if (!token) {
      // Also check standard Supabase auth cookie patterns: sb-<project>-auth-token
      const allCookies = request.cookies.getAll();
      const sbAuthCookie = allCookies.find(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
      );
      if (sbAuthCookie?.value) {
        token = sbAuthCookie.value;
      }
    }

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*'],
};
