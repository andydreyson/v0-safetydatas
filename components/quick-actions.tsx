"use client"

import { Upload, FolderPlus, Search, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type QuickActionsProps = {
  onUploadClick: () => void
  onCreateGroupClick: () => void
  onSearchClick: () => void
  onScanQRClick?: () => void
}

export function QuickActions({
  onUploadClick,
  onCreateGroupClick,
  onSearchClick,
  onScanQRClick,
}: QuickActionsProps) {
  const actions = [
    {
      title: "Upload Documents",
      description: "Add new safety data sheets",
      icon: Upload,
      onClick: onUploadClick,
      color: "bg-primary hover:bg-primary/90 text-white",
    },
    {
      title: "Create Group",
      description: "Organize your documents",
      icon: FolderPlus,
      onClick: onCreateGroupClick,
      color: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
    },
    {
      title: "Search Documents",
      description: "Find what you need fast",
      icon: Search,
      onClick: onSearchClick,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  ]

  if (onScanQRClick) {
    actions.push({
      title: "Scan QR Code",
      description: "Quick access to documents",
      icon: QrCode,
      onClick: onScanQRClick,
      color: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    })
  }

  return (
    <Card className="border-2 border-dashed border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
        <CardDescription className="text-gray-500">Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            onClick={action.onClick}
            className={`h-auto flex-col gap-2 p-6 ${action.color} transition-all hover:scale-105 rounded-xl`}
            variant="default"
          >
            <action.icon className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">{action.title}</div>
              <div className="text-xs opacity-90 mt-1">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
