"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, Table, List, Download, Tag, Trash2, FileText, BookOpen, Printer } from "lucide-react"
import type { ViewMode, Document } from "@/app/page"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { exportToCSV, exportToPDF, exportToZip } from "@/lib/export-utils"

type SidebarProps = {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedCount: number
  onBatchTag: (tag: string) => void
  onBatchDelete: () => void
  documents: Document[]
  onIndexViewToggle?: () => void // Added toggle for index view
  isIndexView?: boolean // Track if index view is active
}

export function Sidebar({
  viewMode,
  onViewModeChange,
  selectedCount,
  onBatchTag,
  onBatchDelete,
  documents,
  onIndexViewToggle,
  isIndexView = false,
}: SidebarProps) {
  const [newTag, setNewTag] = useState("")
  const [showTagInput, setShowTagInput] = useState(false)

  const handleBatchTag = () => {
    if (newTag.trim()) {
      onBatchTag(newTag.trim())
      setNewTag("")
      setShowTagInput(false)
    }
  }

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">DocIndex</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Index View</h3>
          <Button
            variant={isIndexView ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={onIndexViewToggle}
            disabled={documents.length === 0}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Alphabetical Index
          </Button>
        </div>

        {!isIndexView && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">View Mode</h3>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewModeChange("table")}
            >
              <Table className="mr-2 h-4 w-4" />
              Table View
            </Button>
            <Button
              variant={viewMode === "gallery" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewModeChange("gallery")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Gallery View
            </Button>
            <Button
              variant={viewMode === "accordion" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewModeChange("accordion")}
            >
              <List className="mr-2 h-4 w-4" />
              List View
            </Button>
          </div>
        )}

        {selectedCount > 0 && !isIndexView && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Batch Actions ({selectedCount})
            </h3>

            {!showTagInput ? (
              <Button variant="ghost" className="w-full justify-start" onClick={() => setShowTagInput(true)}>
                <Tag className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            ) : (
              <div className="px-2 space-y-2">
                <Input
                  placeholder="Enter tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBatchTag()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleBatchTag} className="flex-1">
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowTagInput(false)
                      setNewTag("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onBatchDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Export</h3>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => exportToPDF(documents)}
            disabled={documents.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generate Print Index
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => exportToCSV(documents)}
            disabled={documents.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => exportToZip(documents)}
            disabled={documents.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Manifest
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t text-xs text-muted-foreground">
        {documents.length} document{documents.length !== 1 ? "s" : ""} indexed
      </div>
    </aside>
  )
}
