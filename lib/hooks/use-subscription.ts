"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export type SubscriptionStatus = {
  planName: string
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "unpaid"
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  trialEnd: string | null
  documentsUsed: number
  documentsLimit: number | null
  groupsUsed: number
  groupsLimit: number
  usersLimit: number
}

export type UserWithSubscription = {
  id: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  subscription: SubscriptionStatus | null
}

export function useSubscription() {
  const { data: session, status: sessionStatus } = useSession()
  const [user, setUser] = useState<UserWithSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for session to be loaded
    if (sessionStatus === "loading") {
      return
    }

    if (!session?.user) {
      setIsLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/me")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [session?.user, sessionStatus])

  const hasActiveSubscription = () => {
    if (!user?.subscription) return false
    const activeStatuses = ["active", "trialing"]
    return activeStatuses.includes(user.subscription.status)
  }

  const isInTrial = () => {
    return user?.subscription?.status === "trialing"
  }

  const isPastDue = () => {
    return user?.subscription?.status === "past_due"
  }

  const getTrialDaysLeft = () => {
    if (!user?.subscription?.trialEnd) return 0
    const trialEnd = new Date(user.subscription.trialEnd)
    const now = new Date()
    const diff = trialEnd.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return {
    user,
    subscription: user?.subscription,
    isLoading,
    error,
    hasActiveSubscription,
    isInTrial,
    isPastDue,
    getTrialDaysLeft,
  }
}
