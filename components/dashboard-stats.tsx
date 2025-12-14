"use client"

import { FileText, Folders, Upload, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardStatsProps = {
  totalDocuments: number
  totalGroups: number
  recentUploads: number
  warningCount?: number
}

export function DashboardStats({
  totalDocuments,
  totalGroups,
  recentUploads,
  warningCount = 0,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: FileText,
      description: "Safety data sheets",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Groups",
      value: totalGroups,
      icon: Folders,
      description: "Organized collections",
      color: "text-[oklch(var(--safety-green))]",
      bgColor: "bg-[oklch(var(--safety-green))]/10",
    },
    {
      title: "Recent Uploads",
      value: recentUploads,
      icon: Upload,
      description: "Last 7 days",
      color: "text-[oklch(var(--safety-yellow))]",
      bgColor: "bg-[oklch(var(--safety-yellow))]/10",
    },
    {
      title: "Warnings",
      value: warningCount,
      icon: AlertTriangle,
      description: "Attention needed",
      color: "text-[oklch(var(--hazard-red))]",
      bgColor: "bg-[oklch(var(--hazard-red))]/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-l-4 bg-white"
          style={{
            borderLeftColor: stat.color.includes("blue")
              ? "#2563eb"
              : `oklch(var(--${
                  stat.color.includes("green")
                    ? "safety-green"
                    : stat.color.includes("yellow")
                    ? "safety-yellow"
                    : "hazard-red"
                }))`,
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
