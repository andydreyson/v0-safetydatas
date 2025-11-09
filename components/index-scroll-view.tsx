"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText } from "lucide-react"
import { useState } from "react"
import type { Document } from "@/app/page"

type IndexScrollViewProps = {
  documents: Document[]
}

export function IndexScrollView({ documents }: IndexScrollViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

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
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
        <p className="text-sm text-muted-foreground">Upload some data sheets to see the alphabetical index</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search compounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
          <span className="font-semibold">{filteredDocs.length} compounds</span>
          <span>•</span>
          <span>Sorted A-Z</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-6">
        {letters.map((letter) => (
          <div key={letter} className="mb-6">
            <div className="flex items-center gap-3 mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{letter}</span>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2 pl-2">
              {groupedDocs[letter].map((doc, index) => (
                <Card key={doc.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{doc.compoundName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.name}</p>
                      {doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-muted-foreground">
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
    </div>
  )
}
