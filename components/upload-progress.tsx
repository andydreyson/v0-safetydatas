"use client"

import { CheckCircle2, Loader2 } from "lucide-react"

export type UploadStage = "analyzing" | "checking" | "uploading" | "syncing" | "completed"

type UploadProgressProps = {
  stage: UploadStage
  fileCount: number
}

const stages = [
  { id: "analyzing", label: "Analyserer dokumenter", icon: "📄" },
  { id: "checking", label: "Sjekker for duplikater", icon: "🔍" },
  { id: "uploading", label: "Laster opp dokumenter", icon: "⬆️" },
  { id: "syncing", label: "Synkroniserer med database", icon: "💾" },
  { id: "completed", label: "Fullført!", icon: "✅" },
]

export function UploadProgress({ stage, fileCount }: UploadProgressProps) {
  const currentStageIndex = stages.findIndex(s => s.id === stage)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Laster opp {fileCount} fil{fileCount !== 1 ? "er" : ""}
          </h3>
        </div>

        {/* Progress stages */}
        <div className="space-y-4">
          {stages.map((stageItem, index) => {
            const isCompleted = index < currentStageIndex
            const isCurrent = index === currentStageIndex
            const isUpcoming = index > currentStageIndex

            return (
              <div
                key={stageItem.id}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-500
                  ${isCurrent ? "bg-primary/10 scale-105 shadow-md" : ""}
                  ${isCompleted ? "bg-green-50" : ""}
                  ${isUpcoming ? "bg-gray-50 opacity-50" : ""}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full text-2xl
                    transition-all duration-500
                    ${isCurrent ? "animate-pulse bg-primary/20 scale-110" : ""}
                    ${isCompleted ? "bg-green-100" : ""}
                    ${isUpcoming ? "bg-gray-100" : ""}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <span>{stageItem.icon}</span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`
                      font-medium transition-all duration-300
                      ${isCurrent ? "text-primary text-lg" : ""}
                      ${isCompleted ? "text-green-700" : ""}
                      ${isUpcoming ? "text-gray-500" : ""}
                    `}
                  >
                    {stageItem.label}
                  </p>
                </div>

                {/* Status indicator */}
                {isCurrent && (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
                {isCompleted && (
                  <div className="text-green-600 text-sm font-medium">✓</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar at bottom */}
        <div className="mt-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Steg {currentStageIndex + 1} av {stages.length}
          </p>
        </div>
      </div>
    </div>
  )
}
