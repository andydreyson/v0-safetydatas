import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow all API routes without authentication
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public routes
  const publicRoutes = [
    '/landing',
    '/login', 
    '/signup',
    '/pricing',
    '/about',
    '/contact',
    '/faq',
    '/documentation',
    '/privacy',
    '/terms',
    '/view/',
    '/groups/',
  ]

  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))
  const isStaticFile = path.startsWith('/_next') || path.startsWith('/images')

  if (isPublicRoute || isStaticFile) {
    return NextResponse.next()
  }

  // For all other routes, let NextAuth handle it in the page/component
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
