"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Trash2, Download, QrCode, Edit2, Check, X, Eye } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"
import { useState } from "react"

type AccordionViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
  onNameUpdate: (docId: string, newName: string) => void
  onDocumentClick?: (doc: Document) => void
}

export function AccordionView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
  onNameUpdate,
  onDocumentClick,
}: AccordionViewProps) {
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

      <Accordion type="multiple" className="space-y-2">
      {documents.map((doc) => (
        <AccordionItem key={doc.id} value={doc.id} className="group border rounded-lg px-4 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={selectedDocuments.includes(doc.id)}
                onCheckedChange={() => toggleSelection(doc.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <FileText className="h-5 w-5 text-primary" />
              {editingId === doc.id ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => saveEdit(doc.id)}>
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit}>
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold text-gray-900 cursor-pointer hover:text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDocumentClick?.(doc)
                    }}
                  >
                    {doc.name}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(doc)
                    }}
                    title="Edit name"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <span className="text-sm text-gray-500 ml-auto mr-4">
                {new Date(doc.uploadDate).toLocaleDateString()}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">File Type:</span>
                  <p className="font-medium text-gray-900">{doc.fileType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <p className="font-medium text-gray-900">{doc.size}</p>
                </div>
                <div>
                  <span className="text-gray-500">Upload Date:</span>
                  <p className="font-medium text-gray-900">{new Date(doc.uploadDate).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500 mb-2 block">Tags:</span>
                <TagInput
                  tags={doc.tags}
                  onAdd={(tag) => onTagAdd(doc.id, tag)}
                  onRemove={(tag) => onTagRemove(doc.id, tag)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => onDocumentClick?.(doc)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Document
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(doc.qrCode, "_blank")}>
                  <QrCode className="mr-2 h-4 w-4" />
                  View QR Code
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete([doc.id])}
                  className="ml-auto text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      </Accordion>
    </div>
  )
}
