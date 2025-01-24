import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware runs on every request
export function middleware(request: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const maintenancePath = '/maintenance';
  const url = request.nextUrl.clone();

  // List of paths to bypass maintenance mode
  const bypassPaths = [
    maintenancePath,
    '/_next',
    '/static',
    '/api',
    '/favicon.ico',
    '/robots.txt',
  ];

  // If the request is for a bypass path, allow it
  if (bypassPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If maintenance mode is active, redirect to the maintenance page
  if (maintenance) {
    url.pathname = maintenancePath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: '/((?!maintenance|_next/static|favicon.ico|robots.txt|api).*)',
};