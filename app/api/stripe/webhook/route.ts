import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const stripeClient = getStripe()
  if (!stripeClient) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`Webhook signature verification failed:`, error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        // Optional: Handle successful payment
        console.log('Payment succeeded:', event.data.object)
        break

      case 'invoice.payment_failed':
        // Optional: Handle failed payment
        console.log('Payment failed:', event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planName = session.metadata?.planName

  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  // Update subscription status after successful checkout
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await updateSubscriptionInDatabase(userId, subscription, planName)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    // Try to find user by customer ID
    const existingSubscription = await prisma.subscription.findUnique({
      where: { stripeCustomerId: subscription.customer as string }
    })

    if (existingSubscription) {
      await updateSubscriptionInDatabase(existingSubscription.userId, subscription)
    } else {
      console.error('No userId found for subscription update')
    }
    return
  }

  await updateSubscriptionInDatabase(userId, subscription)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { stripeCustomerId: subscription.customer as string }
    })

    if (existingSubscription) {
      await cancelSubscriptionInDatabase(existingSubscription.userId)
    }
    return
  }

  await cancelSubscriptionInDatabase(userId)
}

async function updateSubscriptionInDatabase(
  userId: string,
  subscription: Stripe.Subscription,
  planName?: string
) {
  // Determine plan details
  const priceId = subscription.items.data[0]?.price.id
  const productId = subscription.items.data[0]?.price.product as string

  // Map price ID to plan name and limits
  let plan = planName || 'Professional'
  let documentsLimit: number | null = null
  let groupsLimit = 10
  let usersLimit = 10

  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    plan = 'Starter'
    documentsLimit = 100
    groupsLimit = 5
    usersLimit = 1
  } else if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
    plan = 'Professional'
    documentsLimit = null // unlimited
    groupsLimit = 10
    usersLimit = 10
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: productId,
      planName: plan,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      documentsLimit,
      groupsLimit,
      usersLimit,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: productId,
      planName: plan,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      documentsLimit,
      groupsLimit,
      usersLimit,
    },
  })
}

async function cancelSubscriptionInDatabase(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
      stripeSubscriptionId: null,
    },
  })
}
