"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type TagInputProps = {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}

export function TagInput({ tags, onAdd, onRemove }: TagInputProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState("")

  const handleAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAdd(newTag.trim())
      setNewTag("")
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button onClick={() => onRemove(tag)} className="hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {isAdding ? (
        <div className="flex gap-1 items-center">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
              if (e.key === "Escape") {
                setIsAdding(false)
                setNewTag("")
              }
            }}
            placeholder="Tag name"
            className="h-7 w-24 text-sm"
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleAdd}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-xs bg-transparent"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Tag
        </Button>
      )}
    </div>
  )
}
