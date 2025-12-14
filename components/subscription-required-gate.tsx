"use client"

import { Button } from "@/components/ui/button"
import { Shield, Check, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"

type SubscriptionRequiredGateProps = {
  userName?: string
}

export function SubscriptionRequiredGate({ userName }: SubscriptionRequiredGateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose a Plan to Continue
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {userName ? `Welcome, ${userName}!` : "Welcome!"} Select a subscription plan to start organizing your safety data sheets.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:border-blue-500 transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-blue-600">$15</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 100 documents</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">5 groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Automatic A-Z indexing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Print-ready exports</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">QR code sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>

            <Link href="/pricing">
              <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$45</span>
                <span className="text-blue-100">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Unlimited documents</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">10 groups</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Team collaboration (10 users)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">All Starter features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Advanced features</span>
              </li>
            </ul>

            <Link href="/pricing">
              <Button className="w-full h-12 bg-white text-blue-600 hover:bg-blue-50 hover:shadow-xl transition-all font-semibold">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 text-center border shadow-sm">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">GDPR Compliant</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border shadow-sm">
            <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">No Hidden Fees</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border shadow-sm">
            <ArrowRight className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700">Cancel Anytime</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Simple pricing • Secure payments • Start immediately
          </p>
        </div>
      </div>
    </div>
  )
}
