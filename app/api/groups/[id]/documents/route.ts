import { NextRequest, NextResponse } from 'next/server'
import { getDocumentsByGroupId, addDocumentsToGroup, removeDocumentsFromGroup } from '@/lib/db'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/groups/[id]/documents - Get all documents in a group
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const documents = await getDocumentsByGroupId(id)

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('[Groups API] Error fetching group documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch group documents' },
      { status: 500 }
    )
  }
}

// POST /api/groups/[id]/documents - Add documents to a group
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const { documentIds } = await request.json()

    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: 'Invalid request: documentIds array required' },
        { status: 400 }
      )
    }

    const success = await addDocumentsToGroup(id, documentIds)

    if (!success) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    console.log(`[Groups API] ✓ Added ${documentIds.length} document(s) to group ${id}`)

    return NextResponse.json({
      success: true,
      addedCount: documentIds.length
    })
  } catch (error) {
    console.error('[Groups API] Error adding documents to group:', error)
    return NextResponse.json(
      { error: 'Failed to add documents to group' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id]/documents - Remove documents from a group
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const { documentIds } = await request.json()

    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: 'Invalid request: documentIds array required' },
        { status: 400 }
      )
    }

    const success = await removeDocumentsFromGroup(id, documentIds)

    if (!success) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    console.log(`[Groups API] ✓ Removed ${documentIds.length} document(s) from group ${id}`)

    return NextResponse.json({
      success: true,
      removedCount: documentIds.length
    })
  } catch (error) {
    console.error('[Groups API] Error removing documents from group:', error)
    return NextResponse.json(
      { error: 'Failed to remove documents from group' },
      { status: 500 }
    )
  }
}
