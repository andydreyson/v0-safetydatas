import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getGroupById,
  assignDocumentsToGroup,
  removeDocumentsFromGroup,
} from "@/lib/prisma-db"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/groups/[id]/documents - Get all documents in a group (user-scoped)
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

    // Fetch group with documents (user-scoped)
    const group = await getGroupById(userId, id)

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ documents: group.documents || [] })
  } catch (error) {
    console.error("[Groups API] Error fetching group documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch group documents" },
      { status: 500 }
    )
  }
}

// POST /api/groups/[id]/documents - Add documents to a group (user-scoped)
export async function POST(request: NextRequest, context: RouteContext) {
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
    const { documentIds } = await request.json()

    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: "Invalid request: documentIds array required" },
        { status: 400 }
      )
    }

    // Assign documents to group with user scoping
    const addedCount = await assignDocumentsToGroup(userId, documentIds, id)

    if (addedCount === 0) {
      return NextResponse.json(
        { error: "No documents were added - check permissions" },
        { status: 400 }
      )
    }

    console.log(`[Groups API] ✓ Added ${addedCount} document(s) to group ${id}`)

    return NextResponse.json({
      success: true,
      addedCount,
    })
  } catch (error: any) {
    console.error("[Groups API] Error adding documents to group:", error)

    if (error.message === "Group not found or access denied") {
      return NextResponse.json(
        { error: "Group not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Failed to add documents to group" },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id]/documents - Remove documents from a group (user-scoped)
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
    const { documentIds } = await request.json()

    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: "Invalid request: documentIds array required" },
        { status: 400 }
      )
    }

    // Remove documents from group with user scoping
    const removedCount = await removeDocumentsFromGroup(userId, documentIds)

    console.log(`[Groups API] ✓ Removed ${removedCount} document(s) from group ${id}`)

    return NextResponse.json({
      success: true,
      removedCount,
    })
  } catch (error) {
    console.error("[Groups API] Error removing documents from group:", error)
    return NextResponse.json(
      { error: "Failed to remove documents from group" },
      { status: 500 }
    )
  }
}
