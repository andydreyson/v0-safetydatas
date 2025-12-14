"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Check, Upload, FolderOpen, Printer, QrCode, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

type OnboardingStep = {
  title: string
  description: string
  icon: React.ElementType
  imageUrl?: string
  details: string[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to SafetyDatas",
    description: "Organize chemical data sheets in minutes, not hours",
    icon: Shield,
    details: [
      "Upload PDF files of safety data sheets",
      "Automatic alphabetical organization",
      "Create print-ready indexes",
      "Share with team via QR codes",
    ],
  },
  {
    title: "Upload Documents",
    description: "Drag and drop PDF files or click to select",
    icon: Upload,
    details: [
      "Supports multiple files at once",
      "Automatic extraction of chemical names from filenames",
      "Metadata saved automatically (date, size, type)",
      "View all uploaded documents in Document Manager",
    ],
  },
  {
    title: "Organize in Groups",
    description: "Create groups for better organization",
    icon: FolderOpen,
    details: [
      "Select documents and create groups",
      "Give groups descriptive names",
      "Assign documents to multiple groups",
      "View all groups in Group Manager",
    ],
  },
  {
    title: "Export and Print",
    description: "Create professional print-ready indexes",
    icon: Printer,
    details: [
      "Alphabetical index with all compounds A-Z",
      "A4-optimized for ring binders",
      "Extra margin for hole punching (25mm left)",
      "Export as HTML → PDF",
    ],
  },
  {
    title: "Share with Team",
    description: "Generate QR codes for easy sharing",
    icon: QrCode,
    details: [
      "QR code included in print export",
      "Scan code to view collection online",
      "90-day expiration on shared collections",
      "Perfect for quick access on mobile/tablet",
    ],
  },
]

type OnboardingGuideProps = {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingGuide({ onComplete, onSkip }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete()
  }

  const handleSkipGuide = () => {
    setIsVisible(false)
    onSkip()
  }

  if (!isVisible) return null

  const step = onboardingSteps[currentStep]
  const Icon = step.icon
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkipGuide}
          className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg">
              <Icon className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {step.title}
            </h2>
            <p className="text-lg text-gray-600">
              {step.description}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-8">
            {step.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-100 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-gray-700">{detail}</p>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-gradient-to-r from-blue-600 to-blue-700"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>

            <button
              onClick={handleSkipGuide}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip
            </button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  Complete
                  <Check className="h-5 w-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
