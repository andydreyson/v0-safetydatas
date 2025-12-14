import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with subscription and usage stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        _count: {
          select: {
            documents: true,
            groups: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format response
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      subscription: user.subscription ? {
        planName: user.subscription.planName,
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        trialEnd: user.subscription.trialEnd,
        documentsUsed: user._count.documents,
        documentsLimit: user.subscription.documentsLimit,
        groupsUsed: user._count.groups,
        groupsLimit: user.subscription.groupsLimit,
        usersLimit: user.subscription.usersLimit,
      } : null,
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, company, phone } = await request.json()

    // Sanitize inputs
    const sanitizedData = {
      name: name?.trim(),
      company: company?.trim(),
      phone: phone?.trim(),
    }

    // Validate input lengths
    if (sanitizedData.name && sanitizedData.name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (max 100 characters)' },
        { status: 400 }
      )
    }

    if (sanitizedData.company && sanitizedData.company.length > 200) {
      return NextResponse.json(
        { error: 'Company name is too long (max 200 characters)' },
        { status: 400 }
      )
    }

    if (sanitizedData.phone && sanitizedData.phone.length > 20) {
      return NextResponse.json(
        { error: 'Phone number is too long (max 20 characters)' },
        { status: 400 }
      )
    }

    // Update user profile with sanitized data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: sanitizedData.name || undefined,
        company: sanitizedData.company || undefined,
        phone: sanitizedData.phone || undefined,
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        phone: user.phone,
      }
    })

  } catch (error: any) {
    console.error('Error updating user:', error)

    // Generic error message in production
    const message = process.env.NODE_ENV === 'production'
      ? 'Failed to update profile. Please try again.'
      : error?.message || 'Failed to update user'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with subscription to cancel if needed
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Cancel Stripe subscription if active
    if (user.subscription?.stripeSubscriptionId) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId)
      } catch (error) {
        console.error('Error canceling Stripe subscription:', error)
        // Continue with deletion even if Stripe cancellation fails
      }
    }

    // Delete user (cascade deletes all related data: documents, groups, subscription, etc.)
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return NextResponse.json({
      message: 'Account deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}
