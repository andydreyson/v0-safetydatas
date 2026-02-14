import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

// Lazy initialization of Stripe
let stripe: Stripe | null = null
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  }
  return stripe
}

// Lazy initialization of Prisma
let prisma: any = null
async function getPrisma() {
  if (!prisma) {
    const { prisma: p } = await import('@/lib/prisma')
    prisma = p
  }
  return prisma
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

    const { priceId, planName } = await request.json()

    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Price ID and plan name required' },
        { status: 400 }
      )
    }

    const stripeClient = getStripe()
    if (!stripeClient) {
      return NextResponse.json(
        { error: 'Stripe not configured - check STRIPE_SECRET_KEY' },
        { status: 500 }
      )
    }

    // Log for debugging
    console.log('Creating checkout with priceId:', priceId)

    let customerId: string

    try {
      // Try to get existing customer from database
      const db = await getPrisma()
      const existingSub = await db.subscription.findUnique({
        where: { userId: session.user.id }
      })

      if (existingSub?.stripeCustomerId) {
        customerId = existingSub.stripeCustomerId
        console.log('Using existing customer:', customerId)
      } else {
        // Create new Stripe customer
        const customer = await stripeClient.customers.create({
          email: session.user.email || undefined,
          metadata: {
            userId: session.user.id
          }
        })
        customerId = customer.id
        console.log('Created new customer:', customerId)

        // Save to database
        await db.subscription.upsert({
          where: { userId: session.user.id },
          create: {
            userId: session.user.id,
            stripeCustomerId: customerId,
            planName: planName,
            status: 'incomplete',
          },
          update: {
            stripeCustomerId: customerId
          }
        })
      }
    } catch (dbError) {
      // If DB fails, still create checkout without saving
      console.warn('DB error, creating customer without saving:', dbError)
      const customer = await stripeClient.customers.create({
        email: session.user.email || undefined,
        metadata: { userId: session.user.id }
      })
      customerId = customer.id
    }

    // Create checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://safetydatas.com'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://safetydatas.com'}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        planName: planName,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planName: planName,
        }
      }
    })

    console.log('Checkout session created:', checkoutSession.id)
    return NextResponse.json({ url: checkoutSession.url })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
