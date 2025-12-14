"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Lock, Loader2, Trash2, X } from "lucide-react"

type DeleteAccountDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  onSuccess,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Password is required")
      return
    }

    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm')
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to delete account")
        setIsLoading(false)
        return
      }

      // Success - account deleted
      onSuccess()
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPassword("")
    setConfirmText("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Delete Account Permanently</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Danger Warning */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              This will permanently delete:
            </h4>
            <ul className="space-y-1 text-sm text-red-800">
              <li>• Your user account and profile</li>
              <li>• All uploaded documents and files</li>
              <li>• All groups you've created</li>
              <li>• Your subscription and billing history</li>
              <li>• All data associated with your account</li>
            </ul>
          </div>

          {/* GDPR Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>GDPR Compliance:</strong> Before deleting, you can download your data using
            the "Download My Data" button in Account Settings.
          </div>

          {/* Confirmation Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <strong>DELETE</strong> to confirm
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              Confirm your password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading || !password.trim() || confirmText !== "DELETE"}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Forever
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
