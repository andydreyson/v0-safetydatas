import { NextRequest, NextResponse } from 'next/server'
import { getAllGroups, addGroup, deleteGroups } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

// GET /api/groups - Get all groups
export async function GET() {
  try {
    const groups = await getAllGroups()
    return NextResponse.json({ groups })
  } catch (error) {
    console.error('[Groups API] Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

// POST /api/groups - Create new group
export async function POST(request: NextRequest) {
  try {
    const { name, description, documentIds } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const newGroup = {
      id: uuidv4(),
      name: name.trim(),
      description: description || '',
      createdDate: new Date().toISOString(),
      documentIds: documentIds || []
    }

    const group = await addGroup(newGroup)

    console.log(`[Groups API] ✓ Created group: "${group.name}" (${group.id})`)

    return NextResponse.json({
      success: true,
      group
    })
  } catch (error) {
    console.error('[Groups API] Error creating group:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups - Delete multiple groups
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: ids array required' },
        { status: 400 }
      )
    }

    const deletedCount = await deleteGroups(ids)

    console.log(`[Groups API] ✓ Deleted ${deletedCount} group(s)`)

    return NextResponse.json({
      success: true,
      deletedCount
    })
  } catch (error) {
    console.error('[Groups API] Error deleting groups:', error)
    return NextResponse.json(
      { error: 'Failed to delete groups' },
      { status: 500 }
    )
  }
}
