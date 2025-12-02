"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

type DocumentUploadProps = {
  onUpload: (files: File[]) => void
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      onUpload(files)
    },
    [onUpload],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onUpload(files)
    }
  }

  return (
    <Card
      className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="font-semibold text-lg mb-2 text-gray-900">Upload Documents</h3>
        <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
        <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX, XLS, XLSX, and more</p>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
      </div>
    </Card>
  )
}
