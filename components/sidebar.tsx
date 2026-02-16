"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, Table, List, Download, Tag, Trash2, FileText, BookOpen, Printer, Copy, ArrowUpAZ, Sparkles, RefreshCw, FolderPlus, Folders, Home, HelpCircle, User, LogOut } from "lucide-react"
import Image from "next/image"
import { signOut } from "next-auth/react"
import type { ViewMode, Document } from "@/app/page"
import type { Group } from "@/lib/db"
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
  onCheckDuplicates: () => void
  onOrganizeAlphabetically: () => void
  onSyncNames: () => void // Added sync names function
  onRenameWithAI: () => void // Added AI rename function
  groups: Group[] // Added groups prop
  onOpenGroupManager: () => void // Added group manager handler
  onAssignToGroup: () => void // Added assign to group handler
  currentView?: "dashboard" | "documents" | "groups"
  onViewChange?: (view: "dashboard" | "documents" | "groups") => void
  onOpenHelp?: () => void // Added help handler
  onOpenAccount?: () => void // Added account handler
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
  onCheckDuplicates,
  onOrganizeAlphabetically,
  onSyncNames,
  onRenameWithAI,
  groups,
  onOpenGroupManager,
  onAssignToGroup,
  currentView = "dashboard",
  onViewChange,
  onOpenHelp,
  onOpenAccount,
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
    <aside className="w-72 bg-transparent flex flex-col p-4 pr-2">
      {/* Logo Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="SafetyDatas" width={48} height={48} className="w-12 h-12" />
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              SafetyDatas
            </span>
            <p className="text-xs text-gray-500 font-medium">Chemical Safety Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 overflow-y-auto">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl transition-all text-lg h-14 ${
              currentView === "dashboard"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onViewChange?.("dashboard")}
          >
            <Home className="mr-3 h-6 w-6" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl transition-all text-lg h-14 ${
              currentView === "documents"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onViewChange?.("documents")}
          >
            <FileText className="mr-3 h-6 w-6" />
            My Documents
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl transition-all text-lg h-14 ${
              currentView === "groups"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            }`}
            onClick={() => onViewChange?.("groups")}
          >
            <Folders className="mr-3 h-6 w-6" />
            My Groups
          </Button>

          {/* Help & Account Buttons - Always visible */}
          <div className="border-t mt-4 pt-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl transition-all text-lg h-14 hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              onClick={onOpenHelp}
            >
              <HelpCircle className="mr-3 h-6 w-6" />
              Help & Guide
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl transition-all text-lg h-14 hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              onClick={onOpenAccount}
            >
              <User className="mr-3 h-6 w-6" />
              Account
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl transition-all text-lg h-14 hover:bg-red-50 text-gray-700 hover:text-red-600"
              onClick={() => signOut({ callbackUrl: '/landing' })}
            >
              <LogOut className="mr-3 h-6 w-6" />
              Logout
            </Button>
          </div>

          {/* Simple Actions */}
          {currentView === "documents" && documents.length > 0 && (
            <div className="border-t mt-4 pt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl hover:bg-gray-50 text-gray-700 h-12"
                onClick={() => exportToPDF(documents)}
              >
                <Printer className="mr-3 h-5 w-5" />
                Print Index
              </Button>

              {selectedCount > 0 && (
                <>
                  <div className="text-xs font-semibold text-gray-500 px-3 mt-4 mb-2">
                    {selectedCount} selected
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl bg-yellow-50 text-primary hover:bg-yellow-100 font-medium h-12"
                    onClick={onAssignToGroup}
                  >
                    <FolderPlus className="mr-3 h-5 w-5" />
                    Add to Group
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium h-12"
                    onClick={onBatchDelete}
                  >
                    <Trash2 className="mr-3 h-5 w-5" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Card at bottom */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            <p className="text-xs text-gray-500 font-medium">Documents Indexed</p>
          </div>
          <div className="rounded-xl bg-orange-100 p-3">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </aside>
  )
}
