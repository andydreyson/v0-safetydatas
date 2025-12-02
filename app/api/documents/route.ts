import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments, deleteDocuments } from '@/lib/db'

export const runtime = 'nodejs'

// GET /api/documents - Get all documents
export async function GET() {
  try {
    const documents = await getAllDocuments()
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete multiple documents
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: ids array required' },
        { status: 400 }
      )
    }

    const deletedCount = await deleteDocuments(ids)

    return NextResponse.json({
      success: true,
      deletedCount
    })
  } catch (error) {
    console.error('Error deleting documents:', error)
    return NextResponse.json(
      { error: 'Failed to delete documents' },
      { status: 500 }
    )
  }
}
