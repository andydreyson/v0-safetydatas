import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllDocuments, deleteDocuments, decrementDocumentUsage } from "@/lib/prisma-db"

export const runtime = "nodejs"

// GET /api/documents - Get all documents for authenticated user
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

    // Fetch only user's documents
    const documents = await getAllDocuments(userId)

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete multiple documents (user-scoped)
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

    // Delete only user's own documents
    const deletedCount = await deleteDocuments(userId, ids)

    // Decrement document usage counter
    if (deletedCount > 0) {
      await decrementDocumentUsage(userId, deletedCount)
    }

    return NextResponse.json({
      success: true,
      deletedCount,
    })
  } catch (error) {
    console.error("Error deleting documents:", error)
    return NextResponse.json(
      { error: "Failed to delete documents" },
      { status: 500 }
    )
  }
}
