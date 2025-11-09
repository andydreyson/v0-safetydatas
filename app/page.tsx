"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentView } from "@/components/document-view"
import { FilterPanel } from "@/components/filter-panel"
import { IndexScrollView } from "@/components/index-scroll-view" // Added index scroll view

export type Document = {
  id: string
  name: string
  compoundName: string // Added compound name for auto-indexing
  uploadDate: string
  fileType: string
  size: string
  tags: string[]
  category?: string
  description?: string
  qrCode?: string
  pageNumber?: number // Added page number for index generation
  file?: File // Store file for PDF generation
}

export type ViewMode = "table" | "gallery" | "accordion"

export default function Page() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isIndexView, setIsIndexView] = useState(false) // Added index view state

  const handleUpload = async (files: File[]) => {
    const newDocuments: Document[] = await Promise.all(
      files.map(async (file) => {
        const compoundName = await extractCompoundName(file)
        return {
          id: crypto.randomUUID(),
          name: file.name,
          compoundName,
          uploadDate: new Date().toISOString(),
          fileType: file.type || "unknown",
          size: `${(file.size / 1024).toFixed(2)} KB`,
          tags: [],
          qrCode: generateQRCode(file.name),
          file,
        }
      }),
    )

    // Sort all documents alphabetically by compound name
    const allDocuments = [...documents, ...newDocuments].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

    // Assign page numbers
    const documentsWithPages = allDocuments.map((doc, index) => ({
      ...doc,
      pageNumber: index + 2, // Start at page 2 (page 1 is index)
    }))

    setDocuments(documentsWithPages)
  }

  const extractCompoundName = async (file: File): Promise<string> => {
    const filename = file.name
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")

    // If filename has underscore, take the part after the last underscore
    if (nameWithoutExt.includes("_")) {
      const parts = nameWithoutExt.split("_")
      const lastPart = parts[parts.length - 1]
      // Clean the part after underscore
      const cleaned = lastPart.replace(/[^a-zA-Z0-9\s-]/g, "").trim()
      if (cleaned.length > 2) {
        // Valid chemical name found
        return cleaned
      }
    }

    // Remove numbers and special characters from start
    const cleaned = nameWithoutExt
      .replace(/^[0-9_\-\s]+/, "")
      .replace(/[_-]/g, " ")
      .trim()

    // If cleaned name is too short or looks like a code, try to extract from PDF
    if (cleaned.length < 3 || /^[0-9]+/.test(cleaned)) {
      const extractedFromPDF = await extractCompoundNameFromPDF(file)
      if (extractedFromPDF) {
        return extractedFromPDF
      }
    }

    return cleaned || nameWithoutExt
  }

  const extractCompoundNameFromPDF = async (file: File): Promise<string | null> => {
    try {
      if (file.type === "application/pdf") {
        // For MVP, we'll use a simple text extraction approach
        // In production, you'd use a proper PDF parsing library like pdf.js
        const text = await file.text().catch(() => null)
        if (text) {
          // Look for common patterns: "Product Name:", "Chemical:", "Compound:" etc.
          const patterns = [
            /Product Name:\s*([A-Z][a-zA-Z\s-]+)/i,
            /Chemical:\s*([A-Z][a-zA-Z\s-]+)/i,
            /Compound:\s*([A-Z][a-zA-Z\s-]+)/i,
            /Material:\s*([A-Z][a-zA-Z\s-]+)/i,
            /Substance:\s*([A-Z][a-zA-Z\s-]+)/i,
          ]

          for (const pattern of patterns) {
            const match = text.match(pattern)
            if (match && match[1]) {
              return match[1].trim()
            }
          }

          // Fallback: look for capitalized words in first 500 characters
          const firstPart = text.substring(0, 500)
          const capitalizedWords = firstPart.match(/\b[A-Z][a-z]{2,}\b/g)
          if (capitalizedWords && capitalizedWords.length > 0) {
            return capitalizedWords[0]
          }
        }
      }
    } catch (error) {
      console.log("[v0] Error extracting from PDF:", error)
    }
    return null
  }

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  }

  const handleTagAdd = (docId: string, tag: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, tags: [...doc.tags, tag] } : doc)))
  }

  const handleTagRemove = (docId: string, tag: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, tags: doc.tags.filter((t) => t !== tag) } : doc)))
  }

  const handleDelete = (docIds: string[]) => {
    setDocuments(documents.filter((doc) => !docIds.includes(doc.id)))
    setSelectedDocuments([])
  }

  const handleBatchTag = (tag: string) => {
    setDocuments(
      documents.map((doc) =>
        selectedDocuments.includes(doc.id) ? { ...doc, tags: [...new Set([...doc.tags, tag])] } : doc,
      ),
    )
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.compoundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags)))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedDocuments.length}
        onBatchTag={handleBatchTag}
        onBatchDelete={() => handleDelete(selectedDocuments)}
        documents={documents}
        onIndexViewToggle={() => setIsIndexView(!isIndexView)} // Added index view toggle
        isIndexView={isIndexView}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Data Sheet Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isIndexView ? "Alphabetical compound index" : "Auto-indexing document management system"}
          </p>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          {isIndexView ? (
            <div className="flex-1 overflow-hidden p-6">
              <IndexScrollView documents={documents} />
            </div>
          ) : (
            <>
              <div className="p-6 space-y-4">
                <DocumentUpload onUpload={handleUpload} />

                <FilterPanel
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  allTags={allTags}
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />
              </div>

              <div className="flex-1 overflow-auto px-6 pb-6">
                <DocumentView
                  documents={filteredDocuments}
                  viewMode={viewMode}
                  selectedDocuments={selectedDocuments}
                  onSelectionChange={setSelectedDocuments}
                  onTagAdd={handleTagAdd}
                  onTagRemove={handleTagRemove}
                  onDelete={handleDelete}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
