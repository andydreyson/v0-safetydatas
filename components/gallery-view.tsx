"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Download, QrCode } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"

type GalleryViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
}

export function GalleryView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
}: GalleryViewProps) {
  const toggleSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      onSelectionChange(selectedDocuments.filter((docId) => docId !== id))
    } else {
      onSelectionChange([...selectedDocuments, id])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <Checkbox checked={selectedDocuments.includes(doc.id)} onCheckedChange={() => toggleSelection(doc.id)} />
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => window.open(doc.qrCode, "_blank")}
                title="View QR Code"
              >
                <QrCode className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete([doc.id])} title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate" title={doc.name}>
                {doc.name}
              </h3>
              <p className="text-xs text-muted-foreground">{doc.size}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{doc.fileType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uploaded:</span>
              <span className="font-medium">{new Date(doc.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <TagInput
              tags={doc.tags}
              onAdd={(tag) => onTagAdd(doc.id, tag)}
              onRemove={(tag) => onTagRemove(doc.id, tag)}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
