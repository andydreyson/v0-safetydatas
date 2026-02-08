"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  FileText,
  Shield,
  AlertCircle,
  Lock,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Building2,
  Calendar,
} from "lucide-react"

interface Document {
  id: string
  name: string
  compoundName: string
  fileType: string
  size: string
  filePath: string | null
  pageNumber: number | null
  tags: string[]
  category: string | null
  description: string | null
  viewUrl: string | null
}

interface ShareLinkData {
  id: string
  publicId: string
  createdAt: string
  group: {
    id: string
    name: string
    description: string | null
    company: string | null
    documents: Document[]
  }
}

export default function PublicSharePage() {
  const params = useParams()
  const shareId = params.shareId as string

  const [data, setData] = useState<ShareLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null)

  useEffect(() => {
    fetchShareData()
  }, [shareId])

  const fetchShareData = async (passwordParam?: string) => {
    try {
      setLoading(true)
      setError(null)

      let url = `/api/share/${shareId}`
      if (passwordParam) {
        url += `?password=${encodeURIComponent(passwordParam)}`
      }

      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        if (result.requiresPassword) {
          setRequiresPassword(true)
          setLoading(false)
          return
        }
        throw new Error(result.error || "Failed to load share link")
      }

      setData(result.shareLink)
      setRequiresPassword(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchShareData(password)
  }

  const filteredDocuments =
    data?.group.documents.filter(
      (doc) =>
        doc.compoundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || []

  // Group documents by first letter for alphabetical index
  const groupedByLetter = filteredDocuments.reduce((acc, doc) => {
    const firstLetter = doc.compoundName.charAt(0).toUpperCase()
    if (!acc[firstLetter]) acc[firstLetter] = []
    acc[firstLetter].push(doc)
    return acc
  }, {} as Record<string, Document[]>)

  const sortedLetters = Object.keys(groupedByLetter).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading safety data sheets...</p>
        </div>
      </div>
    )
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Password Protected
            </h1>
            <p className="text-gray-500 mt-2">
              This safety data sheet collection requires a password to view.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Access Safety Data Sheets
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Access
          </h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Safety Data Sheets
              </h1>
              {data.group.company && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Building2 className="h-3 w-3" />
                  {data.group.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Group Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {data.group.name}
          </h2>
          {data.group.description && (
            <p className="text-gray-600 mt-1">{data.group.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {data.group.documents.length} documents
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Shared {new Date(data.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Public access
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chemicals, compounds, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Alphabetical Index */}
        {sortedLetters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {sortedLetters.map((letter) => (
              <a
                key={letter}
                href={`#section-${letter}`}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-6">
          {sortedLetters.map((letter) => (
            <section key={letter} id={`section-${letter}`} className="scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-400 mb-3">{letter}</h3>
              <div className="space-y-3">
                {groupedByLetter[letter].map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div
                      className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                      }
                    >
                      <div className="bg-red-50 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {doc.compoundName}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {doc.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{doc.size}</span>
                        {expandedDoc === doc.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedDoc === doc.id && (
                      <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                        <div className="space-y-3">
                          {doc.description && (
                            <p className="text-sm text-gray-600">
                              {doc.description}
                            </p>
                          )}
                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {doc.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full border border-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {doc.category && (
                            <p className="text-sm text-gray-500">
                              Category: {doc.category}
                            </p>
                          )}
                          <div className="flex gap-2 pt-2">
                            {doc.viewUrl && (
                              <button
                                onClick={() => setViewingDoc(doc)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View SDS
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery
                ? "No documents match your search"
                : "No documents in this collection"}
            </p>
          </div>
        )}
      </main>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {viewingDoc.compoundName}
                </h3>
                <p className="text-sm text-gray-500">{viewingDoc.name}</p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {viewingDoc.viewUrl ? (
                <iframe
                  src={viewingDoc.viewUrl}
                  className="w-full h-full min-h-[60vh] rounded-lg border border-gray-200"
                  title={viewingDoc.compoundName}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Document preview not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
        <p>Safety data sheets provided for compliance purposes.</p>
        <p className="mt-1">
          Generated by{" "}
          <a
            href="https://safetydatas.com"
            className="text-blue-600 hover:underline"
          >
            SafetyDatas.com
          </a>
        </p>
      </footer>
    </div>
  )
}
