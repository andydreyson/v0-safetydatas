import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getGroupById, updateGroup, deleteGroup, decrementGroupUsage } from "@/lib/prisma-db"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/groups/[id] - Get a single group (user-scoped)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { id } = await context.params

    // Fetch group with user scoping
    const group = await getGroupById(userId, id)

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error("[Groups API] Error fetching group:", error)
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    )
  }
}

// PATCH /api/groups/[id] - Update a group (user-scoped)
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { id } = await context.params
    const updates = await request.json()

    // Update group with user scoping
    const updatedGroup = await updateGroup(userId, id, updates)

    if (!updatedGroup) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      )
    }

    console.log(`[Groups API] ✓ Updated group: "${updatedGroup.name}" (${id})`)

    return NextResponse.json({
      success: true,
      group: updatedGroup,
    })
  } catch (error) {
    console.error("[Groups API] Error updating group:", error)
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id] - Delete a single group (user-scoped)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { id } = await context.params

    // Delete group with user scoping
    const success = await deleteGroup(userId, id)

    if (!success) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      )
    }

    // Decrement usage counter
    await decrementGroupUsage(userId)

    console.log(`[Groups API] ✓ Deleted group: ${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Groups API] Error deleting group:", error)
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    )
  }
}
