import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle Google OAuth callback
  if (request.nextUrl.pathname === '/auth/google/callback') {
    // This will be handled by the route handler
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/google/callback',
  ],
}
