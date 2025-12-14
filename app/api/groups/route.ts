import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getAllGroups,
  addGroup,
  deleteGroup,
  incrementGroupUsage,
  decrementGroupUsage,
} from "@/lib/prisma-db"
import { checkGroupLimit } from "@/lib/subscription-gate"

export const runtime = "nodejs"

// GET /api/groups - Get all groups for authenticated user
export async function GET() {
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

    // Fetch only user's groups
    const groups = await getAllGroups(userId)

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("[Groups API] Error fetching groups:", error)
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    )
  }
}

// POST /api/groups - Create new group (user-scoped)
export async function POST(request: NextRequest) {
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
    const { name, description, color, qrCode } = await request.json()

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      )
    }

    // Check subscription limit BEFORE creating
    const limitCheck = await checkGroupLimit(userId)

    if (!limitCheck.canCreate) {
      return NextResponse.json(
        {
          error: limitCheck.errorMessage,
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      )
    }

    // Create group with user scoping
    const group = await addGroup(userId, {
      name: name.trim(),
      description: description || null,
      color: color || "#3B82F6",
      qrCode: qrCode || null,
    })

    // Increment usage counter
    await incrementGroupUsage(userId)

    console.log(`[Groups API] ✓ Created group: "${group.name}" (${group.id})`)

    return NextResponse.json({
      success: true,
      group,
    })
  } catch (error) {
    console.error("[Groups API] Error creating group:", error)
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    )
  }
}

// DELETE /api/groups - Delete multiple groups (user-scoped)
export async function DELETE(request: NextRequest) {
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
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid request: ids array required" },
        { status: 400 }
      )
    }

    // Delete groups (one by one to ensure proper scoping and counting)
    let deletedCount = 0
    for (const id of ids) {
      const success = await deleteGroup(userId, id)
      if (success) {
        deletedCount++
        // Decrement usage counter
        await decrementGroupUsage(userId)
      }
    }

    console.log(`[Groups API] ✓ Deleted ${deletedCount} group(s)`)

    return NextResponse.json({
      success: true,
      deletedCount,
    })
  } catch (error) {
    console.error("[Groups API] Error deleting groups:", error)
    return NextResponse.json(
      { error: "Failed to delete groups" },
      { status: 500 }
    )
  }
}
