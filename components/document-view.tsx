"use client"

import { TableView } from "@/components/table-view"
import { GalleryView } from "@/components/gallery-view"
import { AccordionView } from "@/components/accordion-view"
import type { Document, ViewMode } from "@/app/page"

type DocumentViewProps = {
  documents: Document[]
  viewMode: ViewMode
  selectedDocuments: string[]
  onSelectionChange: (ids: string[]) => void
  onTagAdd: (docId: string, tag: string) => void
  onTagRemove: (docId: string, tag: string) => void
  onDelete: (docIds: string[]) => void
}

export function DocumentView({
  documents,
  viewMode,
  selectedDocuments,
  onSelectionChange,
  onTagAdd,
  onTagRemove,
  onDelete,
}: DocumentViewProps) {
  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No documents found. Upload some files to get started.</p>
      </div>
    )
  }

  const props = {
    documents,
    selectedDocuments,
    onSelectionChange,
    onTagAdd,
    onTagRemove,
    onDelete,
  }

  switch (viewMode) {
    case "table":
      return <TableView {...props} />
    case "gallery":
      return <GalleryView {...props} />
    case "accordion":
      return <AccordionView {...props} />
  }
}
