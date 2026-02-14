import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'checking',
    services: {
      database: { status: 'unknown', error: null },
      stripe: { status: 'unknown', error: null },
      openai: { status: 'unknown', error: null },
      nextauth: { status: 'unknown', error: null },
    },
    missingEnvVars: [] as string[],
  }

  // Check environment variables
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_BASE_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID',
    'OPENAI_API_KEY',
  ]

  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      checks.missingEnvVars.push(envVar)
    }
  }

  // Simple env var checks for services
  checks.services.database.status = process.env.DATABASE_URL ? 'configured' : 'not_configured'
  checks.services.stripe.status = process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured'
  checks.services.openai.status = process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
  checks.services.nextauth.status = process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured'

  // Overall status
  const allConfigured = checks.missingEnvVars.length === 0
  
  if (allConfigured) {
    checks.status = 'healthy'
  } else {
    checks.status = 'degraded'
  }

  return NextResponse.json(checks, { 
    status: checks.status === 'healthy' ? 200 : 200 
  })
}