"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Check, Loader2, AlertCircle } from "lucide-react"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSelectPlan = async (priceId: string, planName: string) => {
    if (!session) {
      router.push("/login")
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

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      setError("An error occurred. Please try again.")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SafetyDatas</span>
            </Link>

            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Pricing</span>
          <h1 className="text-5xl font-bold text-gray-900 mt-3 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple pricing. Cancel anytime.
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-all">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900">$15</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Up to 100 data sheets</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">5 groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Automatic A-Z indexing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Print-ready exports</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">QR code sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan(
                process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "price_starter",
                "Starter"
              )}
              disabled={loadingPlan !== null}
              className="w-full h-12 text-base font-semibold"
              variant="outline"
            >
              {loadingPlan === "Starter" ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
              MOST POPULAR
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900">$45</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-semibold">Unlimited data sheets</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">10 groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Team collaboration (10 users)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">All Starter features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Custom branding on exports</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan(
                process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
                "Professional"
              )}
              disabled={loadingPlan !== null}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {loadingPlan === "Professional" ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="max-w-5xl mx-auto mt-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-700">
                Unlimited users, dedicated support, training & onboarding, and custom solutions
              </p>
            </div>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-12 px-8">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Secure payments
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            GDPR compliant
          </div>
        </div>
      </div>
    </div>
  )
}
