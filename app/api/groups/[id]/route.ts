import { NextRequest, NextResponse } from 'next/server'
import { getGroupById, updateGroup, deleteGroup } from '@/lib/db'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/groups/[id] - Get a single group
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const group = await getGroupById(id)

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error('[Groups API] Error fetching group:', error)
    return NextResponse.json(
      { error: 'Failed to fetch group' },
      { status: 500 }
    )
  }
}

// PATCH /api/groups/[id] - Update a group
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const updates = await request.json()

    const updatedGroup = await updateGroup(id, updates)

    if (!updatedGroup) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    console.log(`[Groups API] ✓ Updated group: "${updatedGroup.name}" (${id})`)

    return NextResponse.json({
      success: true,
      group: updatedGroup
    })
  } catch (error) {
    console.error('[Groups API] Error updating group:', error)
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id] - Delete a single group
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const success = await deleteGroup(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    console.log(`[Groups API] ✓ Deleted group: ${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Groups API] Error deleting group:', error)
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    )
  }
}
