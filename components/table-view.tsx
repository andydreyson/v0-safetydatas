"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Download, QrCode } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"

type TableViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
}

export function TableView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
}: TableViewProps) {
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

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="w-12 p-4">
              <Checkbox
                checked={selectedDocuments.length === documents.length && documents.length > 0}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="text-left p-4 font-semibold text-sm">Name</th>
            <th className="text-left p-4 font-semibold text-sm">Upload Date</th>
            <th className="text-left p-4 font-semibold text-sm">Type</th>
            <th className="text-left p-4 font-semibold text-sm">Size</th>
            <th className="text-left p-4 font-semibold text-sm">Tags</th>
            <th className="text-right p-4 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b last:border-b-0 hover:bg-muted/30">
              <td className="p-4">
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => toggleSelection(doc.id)}
                />
              </td>
              <td className="p-4 font-medium">{doc.name}</td>
              <td className="p-4 text-sm text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString()}</td>
              <td className="p-4 text-sm">{doc.fileType}</td>
              <td className="p-4 text-sm">{doc.size}</td>
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
