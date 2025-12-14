"use client"

import { useState, useEffect } from "react"
import { X, User, Mail, Building, Phone, CreditCard, Crown, AlertCircle, ExternalLink, Check, Loader2, Download, Trash2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type AccountSettingsProps = {
  onClose: () => void
}

type UserData = {
  id: string
  name: string | null
  email: string
  company: string | null
  phone: string | null
  subscription: {
    planName: string
    status: string
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
    trialEnd: string | null
    documentsUsed: number
    documentsLimit: number | null
    groupsUsed: number
    groupsLimit: number
    usersLimit: number
  } | null
}

export function AccountSettings({ onClose }: AccountSettingsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  // Fetch user data on mount
  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    fetchUserData()
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me")

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
      setFormData({
        name: data.name || "",
        email: data.email || "",
        company: data.company || "",
        phone: data.phone || "",
      })
      setIsLoadingData(false)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to load account data")
      setIsLoadingData(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Refresh user data
      await fetchUserData()
      setIsSaving(false)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Failed to save changes")
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        company: userData.company || "",
        phone: userData.phone || "",
      })
    }
    setIsEditing(false)
    setError("")
  }

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true)

    try {
      // Call your API to create a Stripe Customer Portal session
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const { url } = await response.json()
        // Redirect to Stripe Customer Portal
        window.location.href = url
      } else {
        // Fallback: redirect to your website's billing page
        window.open('https://safetydatas.com/billing', '_blank')
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error)
      // Fallback: redirect to your website's billing page
      window.open('https://safetydatas.com/billing', '_blank')
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)

    try {
      const response = await fetch('/api/user/export')

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `safetydatas-export-${new Date().toISOString().split('T')[0]}.json`

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting data:', error)
      setError('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch('/api/user/me', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Sign out and redirect to landing page
      await signOut({ redirect: false })
      router.push('/landing')
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account')
      setIsDeleting(false)
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "Professional":
        return "text-purple-600 bg-purple-100 border-purple-200"
      case "Enterprise":
        return "text-amber-600 bg-amber-100 border-amber-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "$15/month"
      case "Professional":
        return "$45/month"
      case "Enterprise":
        return "Custom"
      default:
        return "N/A"
    }
  }

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading account data...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-900 font-semibold text-center">Failed to load account data</p>
          <p className="mt-2 text-gray-600 text-center">{error}</p>
          <Button onClick={onClose} className="w-full mt-6">
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl mx-4 my-8 bg-white rounded-3xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-3xl">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>
          <p className="text-blue-100">Manage your profile, subscription, and billing</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Profile Information */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    Company Name
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Current Plan */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Crown className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">{userData.subscription?.planName || "Free"}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPlanColor(userData.subscription?.planName || "Free")}`}>
                        {(userData.subscription?.planName || "FREE").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {getPlanPrice(userData.subscription?.planName || "Free")} • {userData.subscription?.status === "trialing" ? "Free Trial" : "Monthly"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Documents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userData.subscription?.documentsUsed || 0}
                    {userData.subscription?.documentsLimit && (
                      <span className="text-sm text-gray-500"> / {userData.subscription.documentsLimit}</span>
                    )}
                  </p>
                  {!userData.subscription?.documentsLimit && (
                    <p className="text-xs text-green-600 mt-1">Unlimited</p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Groups</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userData.subscription?.groupsUsed || 0}
                    <span className="text-sm text-gray-500"> / {userData.subscription?.groupsLimit || 0}</span>
                  </p>
                  {userData.subscription && userData.subscription.groupsUsed >= userData.subscription.groupsLimit && (
                    <p className="text-xs text-amber-600 mt-1">Limit reached</p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Next Billing</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(userData.subscription?.currentPeriodEnd || null)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoadingPortal}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-1"
                >
                  {isLoadingPortal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Subscription Management</p>
                    <p>
                      Click "Manage Subscription" to upgrade, downgrade, update payment method,
                      view billing history, or cancel your subscription. You'll be redirected to
                      our secure billing portal powered by Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Plan Comparison */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upgrade Your Plan</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  $15<span className="text-sm text-gray-500">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Up to 100 documents
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    5 groups
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Print indexes with QR codes
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Email support
                  </li>
                </ul>
                {userData.subscription?.planName === "Starter" ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button onClick={handleManageSubscription} className="w-full" variant="outline">
                    Downgrade
                  </Button>
                )}
              </div>

              {/* Professional */}
              <div className="border-2 border-purple-500 rounded-xl p-6 relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  $45<span className="text-sm text-gray-500">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Unlimited documents
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    10 groups
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Team collaboration (10 users)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Priority support
                  </li>
                </ul>
                {userData.subscription?.planName === "Professional" ? (
                  <Button disabled className="w-full bg-purple-600">
                    Current Plan
                  </Button>
                ) : userData.subscription?.planName === "Starter" ? (
                  <Button onClick={handleManageSubscription} className="w-full bg-purple-600 hover:bg-purple-700">
                    Upgrade
                  </Button>
                ) : (
                  <Button onClick={handleManageSubscription} className="w-full" variant="outline">
                    Downgrade
                  </Button>
                )}
              </div>

              {/* Enterprise */}
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-amber-300 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  Custom
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Everything in Professional
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Unlimited users
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Dedicated support
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Training & onboarding
                  </li>
                </ul>
                <Button
                  onClick={() => window.open('https://safetydatas.com/contact', '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </section>

          {/* Data & Privacy (GDPR Compliance) */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data & Privacy</h2>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Data Rights</h3>
                <p className="text-sm text-gray-600">
                  Under GDPR, you have the right to access, export, and delete your personal data.
                  Use the options below to manage your data.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Export Data */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Export My Data</h4>
                      <p className="text-sm text-gray-600">
                        Download all your personal data in JSON format
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleExportData}
                    disabled={isExporting}
                    variant="outline"
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Data
                      </>
                    )}
                  </Button>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-lg p-6 border border-red-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Delete Account</h4>
                      <p className="text-sm text-gray-600">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">GDPR Compliance</p>
                    <p>
                      We comply with EU General Data Protection Regulation (GDPR). Your data is stored
                      securely on EU-based servers and is never shared with third parties without your consent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-3xl border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Questions about billing or need to cancel? Visit the billing portal or contact support.
            </p>
            <p className="text-xs text-gray-500">
              All payments are processed securely through Stripe. Your card information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Delete Account</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 mb-2">This action cannot be undone!</p>
                    <p className="text-sm text-red-800">
                      Deleting your account will permanently remove:
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 ml-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  Your profile and account information
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  All uploaded documents and files
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  All groups and organization data
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  Your active subscription (will be canceled)
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  All account history and activity logs
                </li>
              </ul>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> If you have an active subscription, it will be automatically canceled
                  and you will not be charged again. However, you will not receive a refund for the current billing period.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Before deleting, you can export your data using the "Export My Data" button
                  in the Data & Privacy section.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 rounded-b-2xl border-t flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Yes, Delete My Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
