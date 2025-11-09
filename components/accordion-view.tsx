"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Download, QrCode } from "lucide-react"
import type { Document } from "@/app/page"
import { TagInput } from "@/components/tag-input"

type AccordionViewProps = {
  documents: Document[]
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
}

export function AccordionView({
  documents,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
}: AccordionViewProps) {
  const toggleSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      onSelectionChange(selectedDocuments.filter((docId) => docId !== id))
    } else {
      onSelectionChange([...selectedDocuments, id])
    }
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {documents.map((doc) => (
        <AccordionItem key={doc.id} value={doc.id} className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={selectedDocuments.includes(doc.id)}
                onCheckedChange={() => toggleSelection(doc.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">{doc.name}</span>
              <span className="text-sm text-muted-foreground ml-auto mr-4">
                {new Date(doc.uploadDate).toLocaleDateString()}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File Type:</span>
                  <p className="font-medium">{doc.fileType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <p className="font-medium">{doc.size}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Upload Date:</span>
                  <p className="font-medium">{new Date(doc.uploadDate).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
                <TagInput
                  tags={doc.tags}
                  onAdd={(tag) => onTagAdd(doc.id, tag)}
                  onRemove={(tag) => onTagRemove(doc.id, tag)}
                />
              </div>

              <div className="flex gap-2 pt-2">
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
  )
}
