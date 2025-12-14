import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

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
    ]

    // Check if path starts with any public route
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Allow public shared collections and groups
    const isPublicShare = path.startsWith('/view/') || path.startsWith('/groups/')

    // Allow NextAuth API routes
    const isAuthRoute = path.startsWith('/api/auth')

    // Allow Stripe webhook
    const isWebhookRoute = path.startsWith('/api/stripe/webhook')

    // Allow share API
    const isShareRoute = path.startsWith('/api/share/')

    // Allow PDF analysis for signup flow
    const isPdfAnalysis = path.startsWith('/api/analyze-pdf')

    // Allow static files
    const isStaticFile = path.startsWith('/_next') || path.startsWith('/images')

    if (isPublicRoute || isPublicShare || isAuthRoute || isWebhookRoute || isShareRoute || isPdfAnalysis || isStaticFile) {
      return NextResponse.next()
    }

    // Require authentication for everything else
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
