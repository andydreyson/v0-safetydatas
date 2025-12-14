"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Download, QrCode, Edit, Eye } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"

type TableViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
  onNameUpdate: (docId: string, newName: string) => void
  onDocumentClick?: (doc: Document) => void
}

export function TableView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
  onNameUpdate,
  onDocumentClick,
}: TableViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

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
    setEditingName(doc.name)
  }

  const saveEditing = () => {
    if (editingId && editingName.trim()) {
      onNameUpdate(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName("")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="w-12 p-4">
              <Checkbox
                checked={selectedDocuments.length === documents.length && documents.length > 0}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="text-left p-4 font-semibold text-sm text-gray-900">Name</th>
            <th className="text-left p-4 font-semibold text-sm text-gray-900">Upload Date</th>
            <th className="text-left p-4 font-semibold text-sm text-gray-900">Type</th>
            <th className="text-left p-4 font-semibold text-sm text-gray-900">Size</th>
            <th className="text-left p-4 font-semibold text-sm text-gray-900">Tags</th>
            <th className="text-right p-4 font-semibold text-sm text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="p-4">
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => toggleSelection(doc.id)}
                />
              </td>
              <td className="p-4 font-medium text-gray-900">
                {editingId === doc.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEditing}
                      autoFocus
                      className="h-8"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <span
                      className="cursor-pointer hover:text-primary hover:underline"
                      onClick={() => onDocumentClick?.(doc)}
                    >
                      {doc.name}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => startEditing(doc)}
                      title="Edit name"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </td>
              <td className="p-4 text-sm text-gray-600">{new Date(doc.uploadDate).toLocaleDateString()}</td>
              <td className="p-4 text-sm text-gray-900">{doc.fileType}</td>
              <td className="p-4 text-sm text-gray-900">{doc.size}</td>
              <td className="p-4">
                <TagInput
                  tags={doc.tags}
                  onAdd={(tag) => onTagAdd(doc.id, tag)}
                  onRemove={(tag) => onTagRemove(doc.id, tag)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDocumentClick?.(doc)}
                    title="View Document"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => window.open(doc.qrCode, "_blank")}
                    title="View QR Code"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete([doc.id])} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
