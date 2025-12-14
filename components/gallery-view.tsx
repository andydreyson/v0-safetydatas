"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Download, QrCode, Edit2, Check, X, Eye } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type GalleryViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
  onNameUpdate: (docId: string, newName: string) => void
  onDocumentClick?: (doc: Document) => void
}

export function GalleryView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
  onNameUpdate,
  onDocumentClick,
}: GalleryViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const toggleSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      onSelectionChange(selectedDocuments.filter((docId) => docId !== id))
    } else {
      onSelectionChange([...selectedDocuments, id])
    }
  }

  const toggleAll = () => {
    if (selectedDocuments.length === documents.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(documents.map((doc) => doc.id))
    }
  }

  const startEditing = (doc: Document) => {
    setEditingId(doc.id)
    setEditValue(doc.name)
  }

  const saveEdit = (docId: string) => {
    if (editValue.trim()) {
      onNameUpdate(docId, editValue.trim())
    }
    setEditingId(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      {/* Select All Header */}
      <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
        <Checkbox
          checked={selectedDocuments.length === documents.length && documents.length > 0}
          onCheckedChange={toggleAll}
        />
        <span className="text-sm font-medium text-gray-900">
          {selectedDocuments.length > 0
            ? `${selectedDocuments.length} of ${documents.length} selected`
            : `Select all ${documents.length} documents`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className={`group relative p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${
            selectedDocuments.includes(doc.id)
              ? 'border-l-primary bg-primary/5 shadow-lg'
              : 'border-l-transparent hover:border-l-primary'
          }`}
        >
          {/* Selection Indicator */}
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={selectedDocuments.includes(doc.id)}
              onCheckedChange={() => toggleSelection(doc.id)}
              className="shadow-sm"
            />
          </div>

          {/* Action Buttons - Appear on hover */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-green-100"
              onClick={() => onDocumentClick?.(doc)}
              title="View Document"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-yellow-100"
              onClick={() => window.open(doc.qrCode, "_blank")}
              title="View QR Code"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-blue-100"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-red-100"
              onClick={() => onDelete([doc.id])}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Document Icon & Info */}
          <div className="flex items-center gap-3 mb-4 mt-8">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(var(--safety-yellow))]/20 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {editingId === doc.id ? (
                <div className="flex flex-col gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(doc.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-6 flex-1 bg-[oklch(var(--safety-green))] hover:bg-[oklch(var(--safety-green))]/90"
                      onClick={() => saveEdit(doc.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 flex-1"
                      onClick={cancelEdit}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-semibold text-base truncate flex-1 text-gray-900 cursor-pointer hover:text-primary hover:underline"
                      title={doc.name}
                      onClick={() => onDocumentClick?.(doc)}
                    >
                      {doc.name}
                    </h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => startEditing(doc)}
                      title="Edit name"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{doc.size}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Type:</span>
              <span className="font-medium text-xs text-gray-900">{doc.fileType.split('/')[1]?.toUpperCase() || 'PDF'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Uploaded:</span>
              <span className="font-medium text-xs text-gray-900">{new Date(doc.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 pt-3 border-t">
            <TagInput
              tags={doc.tags}
              onAdd={(tag) => onTagAdd(doc.id, tag)}
              onRemove={(tag) => onTagRemove(doc.id, tag)}
            />
          </div>
        </Card>
      ))}
      </div>
    </div>
  )
}
