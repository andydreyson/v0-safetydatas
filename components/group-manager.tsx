"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, QrCode, Download, Trash2, Edit2, FolderPlus } from "lucide-react"
import { useState } from "react"
import type { Group } from "@/lib/db"
import { QRCodeSVG } from 'qrcode.react'

type GroupManagerProps = {
  isOpen: boolean
  onClose: () => void
  groups: Group[]
  onCreateGroup: () => void
  onDeleteGroup: (groupId: string) => void
  onEditGroup: (groupId: string, name: string, description?: string) => void
}

export function GroupManager({
  isOpen,
  onClose,
  groups,
  onCreateGroup,
  onDeleteGroup,
  onEditGroup
}: GroupManagerProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  if (!isOpen) return null

  const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null

  const handleStartEdit = (group: Group) => {
    setEditingGroupId(group.id)
    setEditName(group.name)
    setEditDescription(group.description || "")
  }

  const handleSaveEdit = () => {
    if (!editingGroupId || !editName.trim()) return

    onEditGroup(editingGroupId, editName.trim(), editDescription.trim() || undefined)
    setEditingGroupId(null)
    setEditName("")
    setEditDescription("")
  }

  const handleCancelEdit = () => {
    setEditingGroupId(null)
    setEditName("")
    setEditDescription("")
  }

  const handleDelete = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const confirmed = confirm(
      `Er du sikker på at du vil slette gruppen "${group.name}"?\n\n` +
      `Gruppen har ${group.documentIds.length} dokument(er).\n` +
      `Dokumentene vil ikke bli slettet, bare fjernet fra gruppen.`
    )

    if (confirmed) {
      onDeleteGroup(groupId)
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null)
      }
    }
  }

  const handleDownloadQR = (group: Group) => {
    const svg = document.getElementById(`qr-${group.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `QR_${group.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const getGroupUrl = (groupId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/groups/${groupId}`
    }
    return `/groups/${groupId}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Gruppeadministrasjon</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {groups.length} gruppe(r) totalt
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={onCreateGroup}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Opprett ny gruppe
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Groups List */}
          <div className="w-2/3 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3">
              {groups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderPlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Ingen grupper ennå</p>
                  <p className="text-sm mt-2">Opprett en gruppe for å organisere databladene dine</p>
                </div>
              ) : (
                groups.map((group) => {
                  const isEditing = editingGroupId === group.id
                  const isSelected = selectedGroupId === group.id

                  return (
                    <Card
                      key={group.id}
                      className={`p-4 transition-all ${
                        isSelected ? 'border-primary bg-accent/50' : 'hover:bg-accent/20'
                      }`}
                    >
                      {isEditing ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Gruppenavn"
                            autoFocus
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Beskrivelse (valgfritt)"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Avbryt
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              Lagre
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start justify-between">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedGroupId(group.id)}
                          >
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            {group.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {group.description}
                              </p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{group.documentIds.length} dokument(er)</span>
                              <span>•</span>
                              <span>Opprettet {new Date(group.createdDate).toLocaleDateString('no-NO')}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedGroupId(group.id)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(group)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(group.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          {/* QR Code Panel */}
          <div className="w-1/3 border-l pl-6">
            {selectedGroup ? (
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-4">QR-kode for gruppen</h3>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                    <QRCodeSVG
                      id={`qr-${selectedGroup.id}`}
                      value={getGroupUrl(selectedGroup.id)}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <div className="text-center mb-4">
                    <p className="font-medium text-lg mb-2">{selectedGroup.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedGroup.documentIds.length} dokument(er)
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleDownloadQR(selectedGroup)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Last ned QR-kode
                  </Button>

                  <div className="mt-4 p-3 bg-muted/20 rounded-md w-full">
                    <p className="text-xs text-muted-foreground text-center break-all">
                      {getGroupUrl(selectedGroup.id)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-sm">Velg en gruppe for å se QR-koden</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
