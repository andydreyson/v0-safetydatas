"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IndexScrollView } from "@/components/index-scroll-view"

interface Document {
  id: string
  name: string
  compoundName: string
  originalName: string
  uploadDate: string
  fileType: string
  size: string
  tags: string[]
}

interface CollectionData {
  documents: Document[]
  createdAt: string
  totalCompounds: number
}

export default function ViewSharedCollection() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<CollectionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await fetch(`/api/share/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Collection not found")
          }
          throw new Error("Failed to load collection")
        }

        const collectionData = await response.json()
        setData(collectionData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "This collection does not exist or has expired."}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to SafetyDatas.com
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Shared Safety Data Sheets</h1>
              <p className="text-sm text-gray-600 mt-1">
                {data.totalCompounds} compounds • Shared on {new Date(data.createdAt).toLocaleDateString('no-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Visit SafetyDatas.com
            </a>
          </div>
        </div>
      </div>

      {/* Collection View */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Alphabetical Index</h2>
          <IndexScrollView documents={data.documents} />
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a shared view of a safety data sheet collection.
            This link will expire 90 days after creation.
          </p>
        </div>
      </div>
    </div>
  )
}
