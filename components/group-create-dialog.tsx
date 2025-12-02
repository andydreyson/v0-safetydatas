"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

type GroupCreateDialogProps = {
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (name: string, description?: string) => void
  selectedDocumentIds?: string[]
}

export function GroupCreateDialog({
  isOpen,
  onClose,
  onCreateGroup,
  selectedDocumentIds = []
}: GroupCreateDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")

  if (!isOpen) return null

  const handleCreate = () => {
    if (!groupName.trim()) {
      alert("Gruppenavn er påkrevd")
      return
    }

    onCreateGroup(groupName.trim(), description.trim() || undefined)

    // Reset form
    setGroupName("")
    setDescription("")
    onClose()
  }

  const handleCancel = () => {
    // Reset form
    setGroupName("")
    setDescription("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Opprett ny gruppe</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Group Name Input */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium mb-2">
              Gruppenavn <span className="text-red-500">*</span>
            </label>
            <Input
              id="groupName"
              placeholder="F.eks. 'Verksted Rom 1', 'Kontor Del 2'"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Beskrivelse (valgfritt)
            </label>
            <Input
              id="description"
              placeholder="Kort beskrivelse av gruppen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Selected Documents Info */}
          {selectedDocumentIds.length > 0 && (
            <div className="bg-muted/20 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                {selectedDocumentIds.length} dokument(er) vil bli lagt til gruppen
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Avbryt
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreate}
            >
              Opprett gruppe
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
