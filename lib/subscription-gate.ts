/**
 * Subscription gating and usage limit enforcement
 *
 * This module provides functions to check subscription status
 * and enforce plan limits throughout the application.
 */

import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { getUserSubscription, getUserUsageStats } from "./prisma-db"

/**
 * Subscription status check result
 */
export type SubscriptionCheck = {
  userId: string
  subscription: {
    id: string
    planName: string
    status: string
    documentsUsed: number
    documentsLimit: number | null
    groupsUsed: number
    groupsLimit: number
    usersLimit: number
    currentPeriodEnd: Date | null
  } | null
  isActive: boolean
  canUpload: boolean
  canCreateGroup: boolean
  errorMessage?: string
}

/**
 * Require active subscription for API routes
 * Throws error if no valid session or subscription
 */
export async function requireActiveSubscription(): Promise<SubscriptionCheck> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized - No valid session")
  }

  const userId = session.user.id
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    throw new Error("No subscription found - Please subscribe to continue")
  }

  const isActive = ["active", "trialing"].includes(subscription.status)

  if (!isActive) {
    throw new Error(
      `Subscription is ${subscription.status} - Please update your subscription`
    )
  }

  // Check document limit
  const canUpload =
    subscription.documentsLimit === null || // Unlimited
    subscription.documentsUsed < subscription.documentsLimit

  // Check group limit
  const canCreateGroup = subscription.groupsUsed < subscription.groupsLimit

  return {
    userId,
    subscription,
    isActive,
    canUpload,
    canCreateGroup,
  }
}

/**
 * Check if user can upload more documents
 */
export async function checkDocumentLimit(userId: string): Promise<{
  canUpload: boolean
  remaining: number | null
  errorMessage?: string
}> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return {
      canUpload: false,
      remaining: 0,
      errorMessage: "No subscription found",
    }
  }

  const isActive = ["active", "trialing"].includes(subscription.status)

  if (!isActive) {
    return {
      canUpload: false,
      remaining: 0,
      errorMessage: `Subscription is ${subscription.status}`,
    }
  }

  // Unlimited plan
  if (subscription.documentsLimit === null) {
    return {
      canUpload: true,
      remaining: null, // Unlimited
    }
  }

  // Check limit
  const remaining = subscription.documentsLimit - subscription.documentsUsed

  if (remaining <= 0) {
    return {
      canUpload: false,
      remaining: 0,
      errorMessage: `Document limit reached (${subscription.documentsUsed}/${subscription.documentsLimit})`,
    }
  }

  return {
    canUpload: true,
    remaining,
  }
}

/**
 * Check if user can create more groups
 */
export async function checkGroupLimit(userId: string): Promise<{
  canCreate: boolean
  remaining: number
  errorMessage?: string
}> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return {
      canCreate: false,
      remaining: 0,
      errorMessage: "No subscription found",
    }
  }

  const isActive = ["active", "trialing"].includes(subscription.status)

  if (!isActive) {
    return {
      canCreate: false,
      remaining: 0,
      errorMessage: `Subscription is ${subscription.status}`,
    }
  }

  const remaining = subscription.groupsLimit - subscription.groupsUsed

  if (remaining <= 0) {
    return {
      canCreate: false,
      remaining: 0,
      errorMessage: `Group limit reached (${subscription.groupsUsed}/${subscription.groupsLimit})`,
    }
  }

  return {
    canCreate: true,
    remaining,
  }
}

/**
 * Get user subscription status and usage for client-side
 */
export async function getSubscriptionStatus(userId: string) {
  const stats = await getUserUsageStats(userId)
  const subscription = stats.subscription

  if (!subscription) {
    return {
      hasSubscription: false,
      isActive: false,
      planName: "None",
      documentsUsed: 0,
      documentsLimit: 0,
      documentsRemaining: 0,
      groupsUsed: 0,
      groupsLimit: 0,
      groupsRemaining: 0,
      canUpload: false,
      canCreateGroup: false,
      needsUpgrade: true,
    }
  }

  const isActive = ["active", "trialing"].includes(subscription.status)

  const documentsRemaining =
    subscription.documentsLimit === null
      ? null // Unlimited
      : subscription.documentsLimit - stats.documentsUsed

  const groupsRemaining = subscription.groupsLimit - stats.groupsUsed

  return {
    hasSubscription: true,
    isActive,
    planName: subscription.planName,
    status: subscription.status,
    documentsUsed: stats.documentsUsed,
    documentsLimit: subscription.documentsLimit,
    documentsRemaining,
    groupsUsed: stats.groupsUsed,
    groupsLimit: subscription.groupsLimit,
    groupsRemaining,
    canUpload:
      isActive &&
      (subscription.documentsLimit === null || documentsRemaining! > 0),
    canCreateGroup: isActive && groupsRemaining > 0,
    needsUpgrade: !isActive || documentsRemaining === 0 || groupsRemaining === 0,
    currentPeriodEnd: subscription.currentPeriodEnd,
  }
}

/**
 * Verify subscription and return formatted error for API
 */
export function formatSubscriptionError(check: SubscriptionCheck): {
  error: string
  upgradeUrl?: string
  status: number
} {
  if (!check.subscription) {
    return {
      error:
        "No active subscription. Please subscribe to use this feature.",
      upgradeUrl: "/pricing",
      status: 403,
    }
  }

  if (!check.isActive) {
    return {
      error: `Your subscription is ${check.subscription.status}. Please update your payment method.`,
      upgradeUrl: "/pricing",
      status: 403,
    }
  }

  if (!check.canUpload) {
    return {
      error: `Document limit reached (${check.subscription.documentsUsed}/${check.subscription.documentsLimit}). Upgrade to Professional for unlimited documents.`,
      upgradeUrl: "/pricing",
      status: 403,
    }
  }

  if (!check.canCreateGroup) {
    return {
      error: `Group limit reached (${check.subscription.groupsUsed}/${check.subscription.groupsLimit}). Upgrade to increase your limit.`,
      upgradeUrl: "/pricing",
      status: 403,
    }
  }

  return {
    error: "Subscription check failed",
    status: 403,
  }
}

/**
 * Simple check if user has any active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return false
  }

  return ["active", "trialing"].includes(subscription.status)
}

/**
 * Get plan limits for a specific plan
 */
export function getPlanLimits(planName: string) {
  const plans: Record<
    string,
    {
      documentsLimit: number | null
      groupsLimit: number
      usersLimit: number
      price: number
    }
  > = {
    Starter: {
      documentsLimit: 100,
      groupsLimit: 5,
      usersLimit: 1,
      price: 15,
    },
    Professional: {
      documentsLimit: null, // Unlimited
      groupsLimit: 10,
      usersLimit: 10,
      price: 45,
    },
    Enterprise: {
      documentsLimit: null, // Unlimited
      groupsLimit: null as any, // Unlimited
      usersLimit: null as any, // Unlimited
      price: 0, // Custom
    },
  }

  return plans[planName] || plans.Starter
}
