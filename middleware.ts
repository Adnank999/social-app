import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token');

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*'],
};
