"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentView } from "@/components/document-view"
import { DocumentViewer } from "@/components/document-viewer"
import { FilterPanel } from "@/components/filter-panel"
import { IndexScrollView } from "@/components/index-scroll-view"
import { ActivityStatus, type Activity } from "@/components/activity-status"
import { GroupCreateDialog } from "@/components/group-create-dialog"
import { GroupAssignDialog } from "@/components/group-assign-dialog"
import { GroupManager } from "@/components/group-manager"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { UploadProgress, type UploadStage } from "@/components/upload-progress"
import { OnboardingGuide } from "@/components/onboarding-guide"
import { HelpDocumentation } from "@/components/help-documentation"
import { AccountSettings } from "@/components/account-settings"
import type { Group } from "@/lib/db"
import { Home, FileText, Folders, X, Loader2 } from "lucide-react"

export type Document = {
  id: string
  name: string
  originalName: string // Original filename
  compoundName: string // Added compound name for auto-indexing
  uploadDate: string
  fileType: string
  size: string
  filePath?: string // Path to file on server
  tags: string[]
  category?: string
  description?: string
  qrCode?: string
  pageNumber?: number // Added page number for index generation
  file?: File // Store file for PDF generation (client-side only)
}

export type ViewMode = "table" | "gallery" | "accordion"

export default function Page() {
  // Authentication check
  const { data: session, status } = useSession()
  const router = useRouter()

  const [documents, setDocuments] = useState<Document[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isIndexView, setIsIndexView] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"dashboard" | "documents" | "groups">("dashboard")

  // Refs for scrolling
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const searchSectionRef = useRef<HTMLInputElement>(null)

  // Group-related state
  const [groups, setGroups] = useState<Group[]>([])
  const [showGroupCreateDialog, setShowGroupCreateDialog] = useState(false)
  const [showGroupAssignDialog, setShowGroupAssignDialog] = useState(false)
  const [showGroupManager, setShowGroupManager] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [groupSelectedDocs, setGroupSelectedDocs] = useState<string[]>([])

  // Document viewer state
  const [viewerDocument, setViewerDocument] = useState<Document | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Upload progress state
  const [showUploadProgress, setShowUploadProgress] = useState(false)
  const [uploadStage, setUploadStage] = useState<UploadStage>("analyzing")
  const [uploadingFileCount, setUploadingFileCount] = useState(0)

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Help documentation state
  const [showHelpDocumentation, setShowHelpDocumentation] = useState(false)

  // Account settings state
  const [showAccountSettings, setShowAccountSettings] = useState(false)

  const addActivity = (message: string, type: Activity["type"] = "info") => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date(),
    }
    setActivities((prev) => [...prev, newActivity])
  }

  // Onboarding handlers
  const handleOnboardingComplete = () => {
    localStorage.setItem('safetydatas-onboarding-completed', 'true')
    setShowOnboarding(false)
    addActivity('Welcome to SafetyDatas! 🎉', 'success')
  }

  const handleOnboardingSkip = () => {
    localStorage.setItem('safetydatas-onboarding-completed', 'true')
    setShowOnboarding(false)
  }

  const handleOpenHelp = () => {
    setShowHelpDocumentation(true)
  }

  const handleOpenAccount = () => {
    setShowAccountSettings(true)
  }

  // Load documents from server on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch('/api/documents')
        if (response.ok) {
          const data = await response.json()
          setDocuments(data.documents || [])
          if (data.documents?.length > 0) {
            addActivity(`Loaded ${data.documents.length} document${data.documents.length > 1 ? 's' : ''}`, 'success')
          }
        }
      } catch (error) {
        console.error('Failed to load documents:', error)
        addActivity('Failed to load documents', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    loadDocuments()
  }, [])

  // Load groups from server on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await fetch('/api/groups')
        if (response.ok) {
          const data = await response.json()
          setGroups(data.groups || [])
        }
      } catch (error) {
        console.error('Failed to load groups:', error)
      }
    }
    loadGroups()
  }, [])

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('safetydatas-onboarding-completed')
    if (!hasCompletedOnboarding) {
      // Small delay so the app loads first
      setTimeout(() => setShowOnboarding(true), 500)
    }
  }, [])

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If no session, redirect to landing page
  if (!session) {
    router.push("/landing")
    return null
  }

  // Check for duplicates based on compound name and file size
  const checkForDuplicates = (docs: Document[]): number => {
    const seen = new Set<string>()
    let duplicateCount = 0

    docs.forEach((doc) => {
      const key = `${doc.compoundName.toLowerCase()}-${doc.size}`
      if (seen.has(key)) {
        duplicateCount++
      } else {
        seen.add(key)
      }
    })

    return duplicateCount
  }

  // Remove duplicates, keeping the first occurrence
  const removeDuplicates = (docs: Document[]): Document[] => {
    const seen = new Set<string>()
    return docs.filter((doc) => {
      const key = `${doc.compoundName.toLowerCase()}-${doc.size}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // Manual function to check and remove duplicates
  const handleCheckDuplicates = async () => {
    // Find duplicates with details
    const seen = new Map<string, Document>()
    const duplicates: Document[] = []

    documents.forEach((doc) => {
      const key = `${doc.compoundName.toLowerCase()}-${doc.size}`
      if (seen.has(key)) {
        duplicates.push(doc)
      } else {
        seen.set(key, doc)
      }
    })

    if (duplicates.length === 0) {
      addActivity("No duplicates found", "info")
      return
    }

    // Show details and ask for confirmation
    const duplicateNames = duplicates.map(d => `- ${d.compoundName} (${d.size})`).join('\n')
    const confirmed = window.confirm(
      `Found ${duplicates.length} duplicate${duplicates.length > 1 ? "s" : ""}:\n\n${duplicateNames}\n\nDo you want to delete these duplicates?`
    )

    if (!confirmed) {
      addActivity("Duplicate check cancelled", "info")
      return
    }

    // Delete duplicates from database
    try {
      addActivity(`Deleting ${duplicates.length} duplicate${duplicates.length > 1 ? "s" : ""}...`, "processing")

      const duplicateIds = duplicates.map(d => d.id)
      await handleDelete(duplicateIds)

      // Update local state
      const cleaned = removeDuplicates(documents)
      const cleanedWithPages = cleaned.map((doc, index) => ({
        ...doc,
        pageNumber: index + 2,
      }))
      setDocuments(cleanedWithPages)

      addActivity(`Removed ${duplicates.length} duplicate${duplicates.length > 1 ? "s" : ""}`, "success")
    } catch (error) {
      console.error('Duplicate removal error:', error)
      addActivity('Failed to remove duplicates', 'error')
    }
  }

  // Manual function to sort alphabetically
  const handleOrganizeAlphabetically = async () => {
    addActivity("Sorting alphabetically...", "processing")

    try {
      // Sort documents alphabetically
      const sorted = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))
      const sortedWithPages = sorted.map((doc, index) => ({
        ...doc,
        pageNumber: index + 2,
      }))

      // Update pageNumber in database for each document
      for (const doc of sortedWithPages) {
        await fetch(`/api/documents/${doc.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageNumber: doc.pageNumber
          })
        })
      }

      // Update local state
      setDocuments(sortedWithPages)
      addActivity(`${sortedWithPages.length} documents sorted alphabetically`, "success")
    } catch (error) {
      console.error('Alphabetical sorting error:', error)
      addActivity('Failed to sort alphabetically', 'error')
    }
  }

  // Sync compoundName with name for all documents
  const handleSyncNames = async () => {
    addActivity("Synchronizing names...", "processing")

    try {
      let updatedCount = 0

      for (const doc of documents) {
        // Only update if compoundName differs from name
        if (doc.compoundName !== doc.name) {
          const response = await fetch(`/api/documents/${doc.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              compoundName: doc.name
            })
          })

          if (response.ok) {
            updatedCount++
          }
        }
      }

      // Update local state
      const syncedDocs = documents.map(doc => ({
        ...doc,
        compoundName: doc.name
      }))
      setDocuments(syncedDocs)

      if (updatedCount > 0) {
        addActivity(`Synchronized ${updatedCount} document${updatedCount > 1 ? 's' : ''}`, "success")
      } else {
        addActivity("All names are already synchronized", "info")
      }
    } catch (error) {
      console.error('Sync error:', error)
      addActivity('Synchronization failed', 'error')
    }
  }

  // AI-powered renaming function
  const handleRenameWithAI = async () => {
    // Filter selected PDF documents only
    const pdfDocuments = documents.filter(doc =>
      selectedDocuments.includes(doc.id) && doc.fileType === 'application/pdf'
    )

    if (pdfDocuments.length === 0) {
      addActivity("No PDF files selected to edit. Please select PDF files first.", "warning")
      return
    }

    addActivity(`Analyzing ${pdfDocuments.length} document${pdfDocuments.length > 1 ? 's' : ''} with GPT-3.5...`, "processing")

    try {
      // Send document IDs to server for batch processing
      const response = await fetch('/api/rename-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: pdfDocuments.map(doc => doc.id)
        })
      })

      if (!response.ok) {
        throw new Error('AI renaming failed')
      }

      const data = await response.json()

      // Update documents with new names
      if (data.results) {
        let successCount = 0
        let failedCount = 0

        data.results.forEach((result: any) => {
          if (result.success && result.newName) {
            setDocuments(prevDocs =>
              prevDocs.map(d =>
                d.id === result.documentId
                  ? { ...d, compoundName: result.newName, name: result.newName }
                  : d
              )
            )
            successCount++
            addActivity(`✓ "${result.originalName}" → "${result.newName}"`, "success")
          } else {
            failedCount++
            addActivity(`✗ Failed to edit "${result.originalName}"`, "error")
          }
        })

        // Re-sort after renaming
        handleOrganizeAlphabetically()

        addActivity(
          `AI editing completed: ${successCount} success, ${failedCount} failed`,
          successCount > 0 ? "success" : "warning"
        )
      }
    } catch (error) {
      console.error('AI renaming error:', error)
      addActivity('AI editing failed', 'error')
    }
  }

  const handleUpload = async (files: File[]) => {
    // Show progress modal
    setUploadingFileCount(files.length)
    setShowUploadProgress(true)
    setUploadStage("analyzing")
    addActivity(`Analyzing ${files.length} file${files.length > 1 ? "s" : ""}...`, "processing")

    try {
      // Extract compound names for all files
      const filesWithCompoundNames = await Promise.all(
        files.map(async (file) => ({
          file,
          compoundName: await extractCompoundName(file)
        }))
      )

      // Move to checking stage
      setUploadStage("checking")

      // Check for duplicates BEFORE uploading
      const potentialDuplicates: Array<{file: File, compoundName: string, existingDoc?: Document}> = []
      const newFiles: Array<{file: File, compoundName: string}> = []

      filesWithCompoundNames.forEach(({ file, compoundName }) => {
        const key = `${compoundName.toLowerCase()}-${(file.size / 1024).toFixed(2)} KB`
        const existingDoc = documents.find(doc => {
          const existingKey = `${doc.compoundName.toLowerCase()}-${doc.size}`
          return existingKey === key
        })

        if (existingDoc) {
          potentialDuplicates.push({ file, compoundName, existingDoc })
        } else {
          newFiles.push({ file, compoundName })
        }
      })

      // If all files are duplicates, show specific message
      if (potentialDuplicates.length === files.length) {
        setShowUploadProgress(false)

        const duplicateList = potentialDuplicates
          .map(d => `• ${d.compoundName} (${(d.file.size / 1024).toFixed(2)} KB)`)
          .join('\n')

        addActivity(
          `All ${files.length} file${files.length > 1 ? 's' : ''} are duplicates and were not uploaded`,
          'warning'
        )

        window.alert(
          `❌ Upload cancelled - Duplicates found!\n\n` +
          `All ${files.length} file${files.length > 1 ? 's' : ''} you tried to upload already exist in the system:\n\n` +
          duplicateList +
          `\n\nThese documents are already in the database and do not need to be uploaded again.`
        )
        return
      }

      // If some files are duplicates, ask user what to do
      if (potentialDuplicates.length > 0) {
        setShowUploadProgress(false)

        const duplicateList = potentialDuplicates
          .map(d => `• ${d.compoundName} (${(d.file.size / 1024).toFixed(2)} KB)`)
          .join('\n')

        const proceed = window.confirm(
          `⚠️ Duplicates found!\n\n` +
          `${potentialDuplicates.length} of ${files.length} file${files.length > 1 ? 's' : ''} are duplicates:\n\n` +
          duplicateList +
          `\n\nDo you want to upload the ${newFiles.length} new file${newFiles.length > 1 ? 's' : ''} and skip the duplicates?`
        )

        if (!proceed) {
          addActivity('Upload cancelled by user', 'info')
          return
        }

        // Resume progress
        setShowUploadProgress(true)
        setUploadStage("checking")
        addActivity(`Skipping ${potentialDuplicates.length} duplicate${potentialDuplicates.length > 1 ? 's' : ''}`, 'warning')
      }

      // If no new files to upload, return
      if (newFiles.length === 0) {
        setShowUploadProgress(false)
        addActivity('No new files to upload', 'info')
        return
      }

      // Create FormData for upload (only new files)
      setUploadStage("uploading")
      addActivity(`Uploading ${newFiles.length} new file${newFiles.length > 1 ? 's' : ''}...`, "processing")

      const formData = new FormData()
      newFiles.forEach(({ file, compoundName }) => {
        formData.append('files', file)
        formData.append(`compoundName_${file.name}`, compoundName)
      })

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      const uploadedDocs = data.documents.map((doc: Document) => ({
        ...doc,
        qrCode: generateQRCode(doc.compoundName),
        file: newFiles.find(f => f.file.name === doc.originalName)?.file
      }))

      // Sync to database
      setUploadStage("syncing")
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay to show the syncing stage

      // Combine with existing documents
      let allDocuments = [...documents, ...uploadedDocs]

      // Sort all documents alphabetically by compound name
      allDocuments.sort((a, b) => a.compoundName.localeCompare(b.compoundName))
      addActivity("Documents sorted alphabetically", "success")

      // Assign page numbers
      const documentsWithPages = allDocuments.map((doc, index) => ({
        ...doc,
        pageNumber: index + 2, // Start at page 2 (page 1 is index)
      }))

      setDocuments(documentsWithPages)

      // Show completed stage
      setUploadStage("completed")
      await new Promise(resolve => setTimeout(resolve, 1500)) // Show completed for 1.5 seconds

      setShowUploadProgress(false)
      addActivity(
        `✓ ${uploadedDocs.length} document${uploadedDocs.length > 1 ? "s" : ""} uploaded${potentialDuplicates.length > 0 ? `, ${potentialDuplicates.length} duplicate${potentialDuplicates.length > 1 ? 's' : ''} skipped` : ''}`,
        "success"
      )
    } catch (error) {
      console.error('Upload error:', error)
      setShowUploadProgress(false)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      addActivity(`Upload failed: ${errorMessage}`, 'error')
    }
  }

  const extractCompoundName = async (file: File): Promise<string> => {
    const filename = file.name
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")

    console.log(`\n${"=".repeat(80)}`)
    console.log(`[EXTRACTION START] File: ${filename}`)
    console.log(`${"=".repeat(80)}`)

    // Always try to extract from PDF first for PDF files
    if (file.type === "application/pdf") {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/analyze-pdf', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          if (data.compoundName && !data.usedFallback) {
            console.log(`[EXTRACTION SUCCESS] ✓ Extracted from PDF: "${data.compoundName}"`)
            console.log(`${"=".repeat(80)}\n`)
            return data.compoundName
          }
        }
      } catch (error) {
        console.error('[EXTRACTION] PDF API error:', error)
      }
      console.log(`[EXTRACTION] PDF extraction failed, falling back to filename parsing`)
    }

    // Fallback to filename parsing - only used if PDF extraction fails
    console.log(`[Filename] Parsing filename: ${filename}`)

    // Helper to clean and validate a candidate name
    const cleanAndValidate = (candidate: string): string | null => {
      const cleaned = candidate
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/[_-]+/g, " ") // Convert underscores/dashes to spaces
        .replace(/\s+/g, " ") // Normalize again
        .trim()

      // Must have at least 3 letters and not be all numbers
      if (cleaned.length >= 3 && /[a-zA-Z]{3,}/.test(cleaned) && !/^\d+$/.test(cleaned)) {
        return cleaned
      }
      return null
    }

    // Strategy 1: If filename has underscore, try the last meaningful part
    if (nameWithoutExt.includes("_")) {
      const parts = nameWithoutExt.split("_")
      // Try from the end, looking for a part that looks like a chemical name
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i]
        // Skip parts that are clearly codes or dates
        if (/^\d+$/.test(part)) continue // All numbers
        if (/^\d{4}-\d{2}-\d{2}$/.test(part)) continue // Date format
        if (part.length < 3) continue // Too short
        if (/^(SDB|SDS|MSDS|EN|IE|US|UK)$/i.test(part)) continue // Common codes

        const cleaned = cleanAndValidate(part)
        if (cleaned) {
          console.log(`[Filename] ✓ Extracted from underscore part: "${cleaned}"`)
          console.log(`${"=".repeat(80)}\n`)
          return cleaned
        }
      }
    }

    // Strategy 2: Clean filename by removing known patterns
    let cleaned = nameWithoutExt
      // Remove common document type prefixes
      .replace(/^(SDB|MSDS|SDS)[-_\s]*/i, "")
      // Remove leading numbers and separators
      .replace(/^[\d\-_\s]+/, "")
      // Remove specific patterns
      .replace(/\bCAS\s*NO?\s*[\d\-]+/gi, "") // CAS numbers
      .replace(/\b\d{4}[-_]\d{2}[-_]\d{2}\b/g, "") // Dates (2021-09-17)
      .replace(/\b\d{4}\s+\d{2}\s+\d{2}\b/g, "") // Dates with spaces
      .replace(/\b(EN|IE|US|UK|FR|DE)[-_\s]*(EN|US)?\b/gi, "") // Language codes
      .replace(/[-_]+(GHS|SDS|MSDS)\b/gi, "") // Document standards
      // Remove trailing codes
      .replace(/[-_]\d+$/g, "") // Trailing numbers like -5025

    const validatedClean = cleanAndValidate(cleaned)
    if (validatedClean) {
      console.log(`[Filename] ✓ Cleaned filename: "${validatedClean}"`)
      console.log(`${"=".repeat(80)}\n`)
      return validatedClean
    }

    // Strategy 3: Try to find the first substantial word in the filename
    const words = nameWithoutExt.split(/[-_\s]+/)
    for (const word of words) {
      // Skip common prefixes and short words
      if (word.length < 3) continue
      if (/^(SDB|SDS|MSDS|\d+)$/i.test(word)) continue

      const cleaned = cleanAndValidate(word)
      if (cleaned) {
        console.log(`[Filename] ⚠ Using first valid word: "${cleaned}"`)
        console.log(`${"=".repeat(80)}\n`)
        return cleaned
      }
    }

    // Last resort: return cleaned original (remove separators only)
    const lastResort = nameWithoutExt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    console.log(`[Filename] ⚠ Using sanitized original: "${lastResort}"`)
    console.log(`${"=".repeat(80)}\n`)
    return lastResort
  }


  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  }

  const handleTagAdd = (docId: string, tag: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, tags: [...doc.tags, tag] } : doc)))
  }

  const handleTagRemove = (docId: string, tag: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, tags: doc.tags.filter((t) => t !== tag) } : doc)))
  }

  const handleNameUpdate = async (docId: string, newName: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          compoundName: newName // Update both name and compoundName for datasheet index
        })
      })

      if (!response.ok) {
        throw new Error('Update failed')
      }

      const data = await response.json()
      setDocuments(documents.map((doc) =>
        doc.id === docId ? {
          ...doc,
          name: data.document.name,
          compoundName: data.document.compoundName // Update compoundName in state too
        } : doc
      ))
      addActivity('Document name updated', 'success')
    } catch (error) {
      console.error('Update error:', error)
      addActivity('Update failed', 'error')
    }
  }

  const handleDocumentClick = (doc: Document) => {
    setViewerDocument(doc)
    setIsViewerOpen(true)
  }

  const handleDelete = async (docIds: string[]) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: docIds })
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setDocuments(documents.filter((doc) => !docIds.includes(doc.id)))
      setSelectedDocuments([])
      addActivity(`${docIds.length} document${docIds.length > 1 ? 's' : ''} deleted`, 'success')
    } catch (error) {
      console.error('Delete error:', error)
      addActivity('Deletion failed', 'error')
    }
  }

  const handleBatchTag = (tag: string) => {
    setDocuments(
      documents.map((doc) =>
        selectedDocuments.includes(doc.id) ? { ...doc, tags: [...new Set([...doc.tags, tag])] } : doc,
      ),
    )
  }

  // Group handlers
  const handleCreateGroup = async (name: string, description?: string) => {
    try {
      addActivity(`Creating group "${name}"...`, 'processing')

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          documentIds: selectedDocuments
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create group')
      }

      const data = await response.json()
      setGroups([...groups, data.group])
      setSelectedDocuments([])
      setShowGroupCreateDialog(false)
      addActivity(`Group "${name}" created with ${selectedDocuments.length} document(s)`, 'success')
    } catch (error) {
      console.error('Error creating group:', error)
      addActivity('Failed to create group', 'error')
    }
  }

  const handleAssignToGroups = async (groupIds: string[]) => {
    try {
      addActivity(`Assigning ${selectedDocuments.length} document(s) to ${groupIds.length} group(s)...`, 'processing')

      for (const groupId of groupIds) {
        const response = await fetch(`/api/groups/${groupId}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentIds: selectedDocuments
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to assign to group ${groupId}`)
        }
      }

      // Reload groups to get updated documentIds
      const groupsResponse = await fetch('/api/groups')
      if (groupsResponse.ok) {
        const data = await groupsResponse.json()
        setGroups(data.groups || [])
      }

      setSelectedDocuments([])
      addActivity(`${selectedDocuments.length} document(s) assigned to ${groupIds.length} group(s)`, 'success')
    } catch (error) {
      console.error('Error assigning to groups:', error)
      addActivity('Failed to assign to groups', 'error')
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete group')
      }

      setGroups(groups.filter(g => g.id !== groupId))
      addActivity('Group deleted', 'success')
    } catch (error) {
      console.error('Error deleting group:', error)
      addActivity('Failed to delete group', 'error')
    }
  }

  const handleEditGroup = async (groupId: string, name: string, description?: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update group')
      }

      const data = await response.json()
      setGroups(groups.map(g => g.id === groupId ? data.group : g))
      addActivity(`Group "${name}" updated`, 'success')
    } catch (error) {
      console.error('Error updating group:', error)
      addActivity('Failed to update group', 'error')
    }
  }

  const handleRemoveDocumentFromGroup = async (groupId: string, documentId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/documents`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: [documentId]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove document from group')
      }

      // Reload groups to get updated documentIds
      const groupsResponse = await fetch('/api/groups')
      if (groupsResponse.ok) {
        const data = await groupsResponse.json()
        setGroups(data.groups || [])
      }

      addActivity('Document removed from group', 'success')
    } catch (error) {
      console.error('Error removing document from group:', error)
      addActivity('Failed to remove document from group', 'error')
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.compoundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => doc.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags)))

  // Calculate stats
  const recentUploads = documents.filter((doc) => {
    const uploadDate = new Date(doc.uploadDate)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return uploadDate >= sevenDaysAgo
  }).length

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
      <Sidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedDocuments.length}
        onBatchTag={handleBatchTag}
        onBatchDelete={() => handleDelete(selectedDocuments)}
        documents={documents}
        onIndexViewToggle={() => setIsIndexView(!isIndexView)}
        isIndexView={isIndexView}
        onCheckDuplicates={handleCheckDuplicates}
        onOrganizeAlphabetically={handleOrganizeAlphabetically}
        onSyncNames={handleSyncNames}
        onRenameWithAI={handleRenameWithAI}
        groups={groups}
        onOpenGroupManager={() => setCurrentView("groups")}
        onAssignToGroup={() => setShowGroupAssignDialog(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenHelp={handleOpenHelp}
        onOpenAccount={handleOpenAccount}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Modern floating header */}
        <div className="p-6 pb-0">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                    currentView === "dashboard"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView("documents")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                    currentView === "documents"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </button>
                <button
                  onClick={() => setCurrentView("groups")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                    currentView === "groups"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Folders className="h-4 w-4" />
                  <span>Groups</span>
                </button>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentView === "dashboard"
                  ? "Dashboard"
                  : currentView === "groups"
                  ? "Group Manager"
                  : isIndexView ? "Alphabetical Index" : "Document Manager"}
              </h1>
              <p className="text-gray-500 mt-2">
                {currentView === "dashboard"
                  ? "Overview of your chemical safety data"
                  : currentView === "groups"
                  ? "Manage and organize document groups"
                  : isIndexView
                  ? "Alphabetical compound index"
                  : "Manage and organize your safety data sheets"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {currentView === "groups" ? (
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {selectedGroupId ? (
                // Detailed Group View
                (() => {
                  const group = groups.find(g => g.id === selectedGroupId)
                  if (!group) return null

                  const groupDocuments = documents.filter(doc => group.documentIds.includes(doc.id))

                  const toggleGroupDocSelection = (docId: string) => {
                    if (groupSelectedDocs.includes(docId)) {
                      setGroupSelectedDocs(groupSelectedDocs.filter(id => id !== docId))
                    } else {
                      setGroupSelectedDocs([...groupSelectedDocs, docId])
                    }
                  }

                  const toggleAllGroupDocs = () => {
                    if (groupSelectedDocs.length === groupDocuments.length) {
                      setGroupSelectedDocs([])
                    } else {
                      setGroupSelectedDocs(groupDocuments.map(doc => doc.id))
                    }
                  }

                  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
                  const [shareLinkUrl, setShareLinkUrl] = useState<string | null>(null)

                  const generateGroupQRCode = async () => {
                    setIsGeneratingQR(true)
                    try {
                      // Create a share link for this group
                      const response = await fetch('/api/share-links', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          groupId: group.id,
                        }),
                      })

                      if (!response.ok) {
                        throw new Error('Failed to create share link')
                      }

                      const data = await response.json()
                      const shareUrl = data.shareLink.url
                      setShareLinkUrl(shareUrl)

                      // Generate QR code for the share link
                      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`
                      window.open(qrCodeUrl, '_blank')

                      addActivity(`Public share link created for "${group.name}"`, 'success')
                    } catch (error) {
                      console.error('Error creating share link:', error)
                      addActivity('Failed to create share link', 'error')
                    } finally {
                      setIsGeneratingQR(false)
                    }
                  }

                  return (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="mb-6">
                        <button
                          onClick={() => {
                            setSelectedGroupId(null)
                            setGroupSelectedDocs([])
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
                        >
                          ← Back to Groups
                        </button>
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
                            {group.description && (
                              <p className="text-gray-500 mt-1">{group.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={generateGroupQRCode}
                              disabled={isGeneratingQR}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isGeneratingQR ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Creating Link...
                                </>
                              ) : (
                                'Generate QR Code'
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const confirmed = window.confirm(`Are you sure you want to delete "${group.name}"?`)
                                if (confirmed) {
                                  handleDeleteGroup(group.id)
                                  setSelectedGroupId(null)
                                }
                              }}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all"
                            >
                              Delete Group
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Documents ({groupDocuments.length})
                          </h3>
                          {groupDocuments.length > 0 && (
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={groupSelectedDocs.length === groupDocuments.length}
                                  onChange={toggleAllGroupDocs}
                                  className="rounded"
                                />
                                Select All
                              </label>
                              {groupSelectedDocs.length > 0 && (
                                <button
                                  onClick={() => {
                                    setShowGroupAssignDialog(true)
                                    setSelectedDocuments(groupSelectedDocs)
                                  }}
                                  className="px-3 py-1.5 bg-yellow-50 text-primary rounded-lg hover:bg-yellow-100 text-sm font-medium"
                                >
                                  Move to Group ({groupSelectedDocs.length})
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {groupDocuments.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No documents in this group</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {groupDocuments.map((doc) => (
                              <div
                                key={doc.id}
                                className={`flex items-center gap-3 p-4 border rounded-xl hover:shadow-sm transition-all ${
                                  groupSelectedDocs.includes(doc.id) ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={groupSelectedDocs.includes(doc.id)}
                                  onChange={() => toggleGroupDocSelection(doc.id)}
                                  className="rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{doc.compoundName}</h4>
                                  <p className="text-sm text-gray-500">{doc.originalName}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveDocumentFromGroup(group.id, doc.id)}
                                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()
              ) : (
                // Groups List View
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
                    <button
                      onClick={() => setShowGroupCreateDialog(true)}
                      className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:shadow-md transition-all"
                    >
                      + Create New Group
                    </button>
                  </div>

                  {showGroupCreateDialog && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Create New Group</h3>
                        <button onClick={() => setShowGroupCreateDialog(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                          <input
                            type="text"
                            id="group-name-input"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter group name..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                          <textarea
                            id="group-desc-input"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={3}
                            placeholder="Enter description..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const nameInput = document.getElementById('group-name-input') as HTMLInputElement
                              const descInput = document.getElementById('group-desc-input') as HTMLTextAreaElement
                              if (nameInput.value.trim()) {
                                handleCreateGroup(nameInput.value.trim(), descInput.value.trim() || undefined)
                                nameInput.value = ''
                                descInput.value = ''
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all"
                          >
                            Create Group
                          </button>
                          <button
                            onClick={() => setShowGroupCreateDialog(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedGroupId(group.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{group.name}</h3>
                            {group.description && (
                              <p className="text-sm text-gray-500">{group.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">
                            {group.documentIds.length} document{group.documentIds.length !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const confirmed = window.confirm(`Are you sure you want to delete "${group.name}"?`)
                              if (confirmed) {
                                handleDeleteGroup(group.id)
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {groups.length === 0 && !showGroupCreateDialog && (
                    <div className="text-center py-12">
                      <Folders className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
                      <p className="text-gray-500 mb-4">Create your first group to organize documents</p>
                      <button
                        onClick={() => setShowGroupCreateDialog(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:shadow-md transition-all"
                      >
                        Create Your First Group
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : currentView === "dashboard" ? (
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Stats Cards */}
              <DashboardStats
                totalDocuments={documents.length}
                totalGroups={groups.length}
                recentUploads={recentUploads}
                warningCount={0}
              />

              {/* Upload Section - Always on Dashboard */}
              <DocumentUpload onUpload={handleUpload} />

              {/* Recent Activity */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <ActivityStatus activities={activities.slice(-5)} />
              </div>

              {/* Welcome message if no documents */}
              {documents.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                  <div className="mx-auto max-w-md space-y-4">
                    <div className="rounded-full bg-primary/10 p-4 inline-block">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Welcome to SafetyData</h3>
                    <p className="text-muted-foreground">
                      Get started by uploading your first chemical safety data sheet. Our AI will automatically extract
                      the compound name and organize everything for you.
                    </p>
                    <button
                      onClick={() => setCurrentView("documents")}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105"
                    >
                      <FileText className="h-4 w-4" />
                      Upload Your First Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : currentView === "documents" ? (
            <div className="flex-1 overflow-auto p-6">
              {/* Simple Table View - No filters, just documents */}
              <div className="bg-white rounded-2xl shadow-sm">
                <DocumentView
                  documents={documents}
                  viewMode="table"
                  selectedDocuments={selectedDocuments}
                  onSelectionChange={setSelectedDocuments}
                  onTagAdd={handleTagAdd}
                  onTagRemove={handleTagRemove}
                  onDelete={handleDelete}
                  onNameUpdate={handleNameUpdate}
                  onDocumentClick={handleDocumentClick}
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Group Dialogs */}
      <GroupCreateDialog
        isOpen={showGroupCreateDialog}
        onClose={() => setShowGroupCreateDialog(false)}
        onCreateGroup={handleCreateGroup}
        selectedDocumentIds={selectedDocuments}
      />

      <GroupAssignDialog
        isOpen={showGroupAssignDialog}
        onClose={() => setShowGroupAssignDialog(false)}
        groups={groups}
        selectedDocumentIds={selectedDocuments}
        selectedDocumentNames={documents
          .filter(d => selectedDocuments.includes(d.id))
          .map(d => d.compoundName)
        }
        onAssignToGroups={handleAssignToGroups}
        onCreateNewGroup={() => {
          setShowGroupAssignDialog(false)
          setShowGroupCreateDialog(true)
        }}
      />

      <GroupManager
        isOpen={showGroupManager}
        onClose={() => setShowGroupManager(false)}
        groups={groups}
        onCreateGroup={() => {
          setShowGroupManager(false)
          setShowGroupCreateDialog(true)
        }}
        onDeleteGroup={handleDeleteGroup}
        onEditGroup={handleEditGroup}
      />

      {/* Document Viewer */}
      <DocumentViewer
        document={viewerDocument}
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />

      {/* Upload Progress Modal */}
      {showUploadProgress && (
        <UploadProgress stage={uploadStage} fileCount={uploadingFileCount} />
      )}

      {/* Onboarding Guide - For first-time users */}
      {showOnboarding && (
        <OnboardingGuide
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Help Documentation - Detailed guide */}
      {showHelpDocumentation && (
        <HelpDocumentation
          onClose={() => setShowHelpDocumentation(false)}
        />
      )}
    </div>
  )
}
