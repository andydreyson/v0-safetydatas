import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
  : null

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

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.services.database.status = 'healthy'
  } catch (error) {
    checks.services.database.status = 'error'
    checks.services.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Check Stripe
  if (stripe) {
    try {
      await stripe.balance.retrieve()
      checks.services.stripe.status = 'healthy'
    } catch (error) {
      checks.services.stripe.status = 'error'
      checks.services.stripe.error = error instanceof Error ? error.message : 'Unknown error'
    }
  } else {
    checks.services.stripe.status = 'not_configured'
  }

  // Check OpenAI
  if (process.env.OPENAI_API_KEY) {
    checks.services.openai.status = 'configured'
  } else {
    checks.services.openai.status = 'not_configured'
  }

  // Check NextAuth
  if (process.env.NEXTAUTH_SECRET) {
    checks.services.nextauth.status = 'configured'
  } else {
    checks.services.nextauth.status = 'not_configured'
  }

  // Overall status
  const hasErrors = Object.values(checks.services).some(s => s.status === 'error')
  const allConfigured = checks.missingEnvVars.length === 0
  
  if (hasErrors) {
    checks.status = 'error'
  } else if (!allConfigured) {
    checks.status = 'degraded'
  } else {
    checks.status = 'healthy'
  }

  return NextResponse.json(checks, { 
    status: checks.status === 'healthy' ? 200 : checks.status === 'degraded' ? 200 : 503 
  })
}