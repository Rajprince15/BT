import { NextRequest, NextResponse } from 'next/server';

/**
 * BHAVITA TEXTILES — Frontend route protection (Phase 2 stub).
 *
 * Phase 2 deliberately uses only the cookie set by the mock/real auth
 * service. We do NOT verify JWT here — that is the backend's job on the
 * actual API request. This guard only redirects unauthenticated visitors
 * away from gated UI shells (`/account/*`, `/admin/*`) to the login page
 * with a `?next=` round-trip target.
 *
 * Cookie contract (set by `services/auth.service.ts` once auth lands in
 * Phase 6):
 *   - `bt_session`  → presence-only flag, NOT a token
 *   - `bt_role`     → 'customer' | 'admin' | 'super_admin'
 */
const SESSION_COOKIE = 'bt_session';
const ROLE_COOKIE = 'bt_role';

const PROTECTED_PREFIXES = ['/account', '/admin'];
const ADMIN_PREFIXES = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only run on the protected shells
  if (!PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const role = req.cookies.get(ROLE_COOKIE)?.value;
  const isAdminArea = ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Not logged in → bounce to login with return URL
  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but not admin → bounce to /account
  if (isAdminArea && role !== 'admin' && role !== 'super_admin') {
    const accountUrl = req.nextUrl.clone();
    accountUrl.pathname = '/account';
    accountUrl.search = '';
    return NextResponse.redirect(accountUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
