"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Tag, FileType, HardDrive } from "lucide-react"
import type { Document } from "@/app/page"

interface DocumentViewerProps {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
  if (!document) return null

  const isPDF = document.fileType === "application/pdf" || document.originalName.toLowerCase().endsWith(".pdf")
  const fileUrl = document.filePath ? `/api/files/${document.filePath}` : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[95vh] bg-white">
        <DialogHeader className="bg-gray-50 border-b border-gray-200">
          <DialogTitle className="text-gray-900">{document.name || document.originalName}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <DialogBody className="h-full overflow-hidden bg-white p-0">
          {/* Full width document preview */}
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {isPDF && fileUrl ? (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0"
                title={document.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                <FileText className="h-24 w-24 mb-4 opacity-50 text-gray-400" />
                <p className="text-lg font-medium mb-2 text-gray-900">Preview not available</p>
                <p className="text-sm text-gray-600">
                  {document.fileType === "application/pdf"
                    ? "PDF preview could not be loaded"
                    : "This file type does not support preview"}
                </p>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download File
                  </a>
                )}
              </div>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
