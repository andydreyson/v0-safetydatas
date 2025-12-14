import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDocumentById, updateDocument, deleteDocument, decrementDocumentUsage } from "@/lib/prisma-db"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/documents/[id] - Get a single document (user-scoped)
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

    // Fetch document with user scoping
    const document = await getDocumentById(userId, id)

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/[id] - Update a document (user-scoped)
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

    // Update document with user scoping
    const updatedDocument = await updateDocument(userId, id, updates)

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document: updatedDocument,
    })
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Delete a single document (user-scoped)
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

    // Delete document with user scoping
    const success = await deleteDocument(userId, id)

    if (!success) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      )
    }

    // Decrement usage counter
    await decrementDocumentUsage(userId, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}
