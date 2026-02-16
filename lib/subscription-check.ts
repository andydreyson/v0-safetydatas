import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function checkSubscription(req?: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      allowed: false,
      error: "Unauthorized",
      status: 401,
      user: null,
      subscription: null,
    }
  }

  // Get user with subscription
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  if (!user) {
    return {
      allowed: false,
      error: "User not found",
      status: 404,
      user: null,
      subscription: null,
    }
  }

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    if (!user.subscription) return false
    const activeStatuses = ["active", "trialing"]
    return activeStatuses.includes(user.subscription.status)
  }

  if (!hasActiveSubscription()) {
    return {
      allowed: false,
      error: "Subscription required. Please subscribe to access this feature.",
      status: 403,
      user,
      subscription: user.subscription,
    }
  }

  return {
    allowed: true,
    error: null,
    status: 200,
    user,
    subscription: user.subscription,
  }
}

// Helper to get subscription-aware limits
export function getSubscriptionLimits(subscription: {
  planName: string
  documentsLimit: number | null
  groupsLimit: number
} | null) {
  if (!subscription) {
    return {
      documentsLimit: 0,
      groupsLimit: 0,
      canUpload: false,
      canCreateGroup: false,
    }
  }

  const { planName, documentsLimit, groupsLimit } = subscription

  // Starter: 100 docs, 5 groups
  // Professional: unlimited docs, 10 groups
  // Enterprise: unlimited everything

  return {
    documentsLimit,
    groupsLimit,
    canUpload: true,
    canCreateGroup: true,
    planName,
  }
}
