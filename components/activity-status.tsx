"use client"

import { CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export type Activity = {
  id: string
  message: string
  type: "success" | "warning" | "info" | "processing"
  timestamp: Date
}

type ActivityStatusProps = {
  activities: Activity[]
}

export function ActivityStatus({ activities }: ActivityStatusProps) {
  if (activities.length === 0) return null

  const recentActivities = activities.slice(-3) // Show last 3 activities

  return (
    <Card className="p-4 bg-muted/30">
      <div className="space-y-2">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            {activity.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
            {activity.type === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />}
            {activity.type === "info" && <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />}
            {activity.type === "processing" && (
              <Loader2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
            )}
            <div className="flex-1">
              <p className="text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.timestamp.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
