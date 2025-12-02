"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, X, Download, Share2, QrCode } from "lucide-react"
import { useState } from "react"
import type { Document } from "@/app/page"
import { QRCodeSVG } from 'qrcode.react'

type IndexScrollViewProps = {
  documents: Document[]
}

export function IndexScrollView({ documents }: IndexScrollViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [showQR, setShowQR] = useState(false)

  // Sort alphabetically
  const sortedDocs = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

  // Filter based on search
  const filteredDocs = sortedDocs.filter((doc) => doc.compoundName.toLowerCase().includes(searchQuery.toLowerCase()))

  // Group by first letter
  const groupedDocs = filteredDocs.reduce(
    (acc, doc) => {
      const firstLetter = doc.compoundName[0].toUpperCase()
      if (!acc[firstLetter]) {
        acc[firstLetter] = []
      }
      acc[firstLetter].push(doc)
      return acc
    },
    {} as Record<string, Document[]>,
  )

  const letters = Object.keys(groupedDocs).sort()

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-gray-900">No Documents Yet</h3>
        <p className="text-sm text-gray-600">Upload some data sheets to see the alphabetical index</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search compounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 mt-3 text-xs text-gray-600">
          <span className="font-semibold">{filteredDocs.length} compounds</span>
          <span>•</span>
          <span>Sorted A-Z</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-6 px-4">
        {letters.map((letter) => (
          <div key={letter} className="mb-6">
            <div className="flex items-center gap-3 mb-3 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-5">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{letter}</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-2 pl-2">
              {groupedDocs[letter].map((doc, index) => (
                <Card
                  key={doc.id}
                  className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer border"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{doc.compoundName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{doc.name}</p>
                      {doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-600">
                        Page {doc.pageNumber || sortedDocs.findIndex((d) => d.id === doc.id) + 2}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedDoc.compoundName}</h2>
                <p className="text-sm text-gray-600">{selectedDoc.originalName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQR(!showQR)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = `/api/files/${selectedDoc.filePath}`
                    link.download = `${selectedDoc.compoundName}.pdf`
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoc(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Viewer + QR Code */}
            <div className="flex-1 flex overflow-hidden">
              {/* PDF Viewer */}
              <div className={`${showQR ? 'w-2/3' : 'w-full'} h-full transition-all`}>
                <iframe
                  src={`/api/files/${selectedDoc.filePath}`}
                  className="w-full h-full border-0"
                  title={selectedDoc.compoundName}
                />
              </div>

              {/* QR Code Panel */}
              {showQR && (
                <div className="w-1/3 border-l p-6 flex flex-col items-center justify-center bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Share via QR Code</h3>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/files/${selectedDoc.filePath}`}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Scan this code to open the PDF on any device
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${typeof window !== 'undefined' ? window.location.origin : ''}/api/files/${selectedDoc.filePath}`
                      )
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
