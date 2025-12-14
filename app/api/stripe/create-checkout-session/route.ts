import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

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

    // Get or create Stripe customer
    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    let customerId: string

    if (subscription?.stripeCustomerId) {
      customerId = subscription.stripeCustomerId
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id
        }
      })
      customerId = customer.id

      // Save customer ID to database
      subscription = await prisma.subscription.upsert({
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

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
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

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
