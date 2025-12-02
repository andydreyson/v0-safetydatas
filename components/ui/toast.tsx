"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Info, AlertCircle } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export type ToastMessage = {
  id: string
  message: string
  type: ToastType
}

type ToastProps = {
  message: ToastMessage
  onClose: (id: string) => void
}

function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [message.id, onClose])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
  }

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200",
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-top-5 ${bgColors[message.type]}`}
    >
      {icons[message.type]}
      <p className="text-sm font-medium flex-1">{message.message}</p>
      <button onClick={() => onClose(message.id)} className="text-gray-500 hover:text-gray-700">
        ×
      </button>
    </div>
  )
}

type ToastContainerProps = {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toasts, showToast, closeToast }
}
