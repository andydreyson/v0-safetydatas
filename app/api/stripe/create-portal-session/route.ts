import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Lazy initialization
let stripe: Stripe | null = null
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  }
  return stripe
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID from database
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const stripeClient = getStripe()
    if (!stripeClient) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found. Please subscribe first.' },
        { status: 400 }
      )
    }

    // Create Stripe Customer Portal session
    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?tab=account`,
    })

    return NextResponse.json({ url: portalSession.url })

  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
