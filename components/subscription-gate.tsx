"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

type SubscriptionGateProps = {
  isOpen: boolean
  onClose: () => void
  limitType: "documents" | "groups"
  currentUsage: number
  limit: number
  currentPlan: string
}

export function SubscriptionGate({
  isOpen,
  onClose,
  limitType,
  currentUsage,
  limit,
  currentPlan,
}: SubscriptionGateProps) {
  const isDocumentLimit = limitType === "documents"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isDocumentLimit ? "Document Limit Reached" : "Group Limit Reached"}
              </DialogTitle>
              <DialogDescription>
                You've reached your plan limit
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Usage */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Plan</span>
              <span className="font-semibold text-blue-600">{currentPlan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isDocumentLimit ? "Documents" : "Groups"}
              </span>
              <span className="font-bold text-lg">
                {currentUsage} / {limit}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all"
                style={{ width: `${Math.min((currentUsage / limit) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Upgrade Message */}
          <div className="text-center py-2">
            <p className="text-gray-700 mb-4">
              {isDocumentLimit
                ? "Upgrade to Professional for unlimited documents"
                : `Upgrade to increase your group limit to 10 groups`}
            </p>
          </div>

          {/* Professional Plan Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">
              Professional Plan - $45/month
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Unlimited documents</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>10 groups (vs 5 in Starter)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Team collaboration (10 users)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Link href="/pricing" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg">
                View Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
