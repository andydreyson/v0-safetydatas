"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, X, Download, Folders } from "lucide-react"
import { useState } from "react"
import type { DocumentData, Group } from "@/lib/db"

type GroupViewClientProps = {
  group: Group
  documents: DocumentData[]
}

export function GroupViewClient({ group, documents }: GroupViewClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null)

  // Sort alphabetically
  const sortedDocs = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

  // Filter based on search
  const filteredDocs = sortedDocs.filter((doc) =>
    doc.compoundName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
    {} as Record<string, DocumentData[]>
  )

  const letters = Object.keys(groupedDocs).sort()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-6 sticky top-0 z-10 backdrop-blur-sm bg-background/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Folders className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>{filteredDocs.length} dokument(er)</span>
            {filteredDocs.length !== documents.length && (
              <>
                <span>•</span>
                <span>Viser {filteredDocs.length} av {documents.length}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="sticky top-24 bg-background/95 backdrop-blur-sm z-10 pb-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter kjemikalie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Document List */}
        {documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Folders className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Ingen dokumenter i denne gruppen</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Ingen treff</p>
            <p className="text-sm mt-2">Prøv et annet søkeord</p>
          </div>
        ) : (
          <div className="space-y-8">
            {letters.map((letter) => (
              <div key={letter}>
                <div className="flex items-center gap-3 mb-4 sticky top-36 bg-background/95 backdrop-blur-sm py-2 z-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{letter}</span>
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedDocs[letter].map((doc) => (
                    <Card
                      key={doc.id}
                      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {doc.compoundName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {doc.originalName}
                          </p>
                          {doc.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {doc.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{doc.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PDF Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">{selectedDoc.compoundName}</h2>
                <p className="text-sm text-muted-foreground">{selectedDoc.originalName}</p>
              </div>
              <div className="flex items-center gap-2">
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
                  Last ned
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

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`/api/files/${selectedDoc.filePath}`}
                className="w-full h-full border-0"
                title={selectedDoc.compoundName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
