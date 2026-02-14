import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Allow API routes (including health check)
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
    ]

    // Check if path starts with any public route
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Allow public shared collections and groups
    const isPublicShare = path.startsWith('/view/') || path.startsWith('/groups/')

    // Allow static files
    const isStaticFile = path.startsWith('/_next') || path.startsWith('/images')

    if (isPublicRoute || isPublicShare || isStaticFile) {
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
      authorized: ({ token, req }) => {
        // Allow API routes without token check in authorized callback
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true
        }
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
