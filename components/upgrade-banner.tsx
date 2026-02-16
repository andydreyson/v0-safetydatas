"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, Crown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface UpgradeBannerProps {
  variant?: "trial" | "expired" | "past_due" | "upgrade"
  daysLeft?: number
  onDismiss?: () => void
}

export function UpgradeBanner({
  variant = "expired",
  daysLeft = 0,
  onDismiss,
}: UpgradeBannerProps) {
  const router = useRouter()
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  if (variant === "trial") {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5" />
            <span className="font-medium">
              🎉 You have {daysLeft} day{daysLeft !== 1 ? "s" : ""} left in your free trial.
              Subscribe now to keep full access.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              size="sm"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
            >
              Upgrade Now
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "past_due") {
    return (
      <div className="bg-amber-500 text-white px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">
              ⚠️ Your subscription payment failed. Please update your payment method to restore access.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              size="sm"
              className="bg-white text-amber-600 hover:bg-gray-100 font-semibold"
            >
              Update Payment
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "upgrade") {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">
              💎 Upgrade to Professional for unlimited data sheets and team collaboration!
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold"
            >
              Upgrade
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default: expired
  return (
    <div className="bg-red-600 text-white px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">
            🔒 Your subscription has expired. Subscribe to regain full access to all features.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleUpgrade}
            size="sm"
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
          >
            Subscribe Now
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
