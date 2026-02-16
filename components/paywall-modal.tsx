"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaywallModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  description?: string
}

export function PaywallModal({
  isOpen,
  onClose,
  title = "Unlock Full Access",
  description = "Subscribe to access all features and manage your safety data sheets.",
}: PaywallModalProps) {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSelectPlan = async (priceId: string, planName: string) => {
    if (priceId === "price_starter" || priceId === "price_professional") {
      setError("Stripe is not configured yet. Please contact support.")
      return
    }

    setLoadingPlan(planName)
    setError("")

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to start checkout")
        setLoadingPlan(null)
        return
      }

      window.location.href = data.url
    } catch (error) {
      setError("An error occurred. Please try again.")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 max-w-md mx-auto">{description}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Starter Plan */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$15</span>
                <span className="text-gray-600">/month</span>
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 100 data sheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">5 groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Automatic A-Z indexing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">QR code sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>

              <Button
                onClick={() =>
                  handleSelectPlan(
                    process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "price_starter",
                    "Starter"
                  )
                }
                disabled={loadingPlan !== null}
                className="w-full"
                variant="outline"
              >
                {loadingPlan === "Starter" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$45</span>
                <span className="text-gray-600">/month</span>
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Unlimited data sheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10 groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Team collaboration (10 users)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom branding</span>
                </li>
              </ul>

              <Button
                onClick={() =>
                  handleSelectPlan(
                    process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
                    "Professional"
                  )
                }
                disabled={loadingPlan !== null}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {loadingPlan === "Professional" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Secure payment
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                30-day money back
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
