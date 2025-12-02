"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { useState } from "react"
import type { Group } from "@/lib/db"

type GroupAssignDialogProps = {
  isOpen: boolean
  onClose: () => void
  groups: Group[]
  selectedDocumentIds: string[]
  selectedDocumentNames: string[]
  onAssignToGroups: (groupIds: string[]) => void
  onCreateNewGroup: () => void
}

export function GroupAssignDialog({
  isOpen,
  onClose,
  groups,
  selectedDocumentIds,
  selectedDocumentNames,
  onAssignToGroups,
  onCreateNewGroup
}: GroupAssignDialogProps) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  if (!isOpen) return null

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleAssign = () => {
    if (selectedGroupIds.length === 0) {
      alert("Velg minst én gruppe")
      return
    }

    onAssignToGroups(selectedGroupIds)

    // Reset selection
    setSelectedGroupIds([])
    onClose()
  }

  const handleCreateNew = () => {
    // Reset selection
    setSelectedGroupIds([])
    onClose()
    onCreateNewGroup()
  }

  const handleCancel = () => {
    // Reset selection
    setSelectedGroupIds([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Tildel til gruppe</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDocumentIds.length} dokument(er) valgt
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Documents Preview */}
        <div className="bg-muted/20 p-3 rounded-md mb-4 max-h-32 overflow-y-auto">
          <p className="text-sm font-medium mb-2">Valgte dokumenter:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {selectedDocumentNames.slice(0, 5).map((name, idx) => (
              <li key={idx} className="truncate">• {name}</li>
            ))}
            {selectedDocumentNames.length > 5 && (
              <li className="text-xs italic">+ {selectedDocumentNames.length - 5} flere...</li>
            )}
          </ul>
        </div>

        {/* Create New Group Button */}
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Opprett ny gruppe
        </Button>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Ingen grupper funnet</p>
              <p className="text-xs mt-1">Opprett en ny gruppe for å komme i gang</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Velg eksisterende grupper:</p>
              {groups.map((group) => {
                const isSelected = selectedGroupIds.includes(group.id)
                const documentsInGroup = group.documentIds.filter(id =>
                  selectedDocumentIds.includes(id)
                ).length

                return (
                  <label
                    key={group.id}
                    className="flex items-start gap-3 p-3 rounded-md border cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleGroup(group.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{group.name}</p>
                      {group.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {group.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.documentIds.length} dokument(er) i gruppen
                        {documentsInGroup > 0 && (
                          <span className="text-orange-500">
                            {" "}• {documentsInGroup} allerede i denne gruppen
                          </span>
                        )}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            Avbryt
          </Button>
          <Button
            className="flex-1"
            onClick={handleAssign}
            disabled={selectedGroupIds.length === 0}
          >
            Tildel til {selectedGroupIds.length} gruppe(r)
          </Button>
        </div>
      </Card>
    </div>
  )
}
