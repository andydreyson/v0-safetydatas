import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { join } from "path"

// GET /api/share/[publicId]/documents/[documentId] - Serve document file
export async function GET(
  req: Request,
  { params }: { params: Promise<{ publicId: string; documentId: string }> }
) {
  try {
    const { publicId, documentId } = await params

    // Verify share link exists and is valid
    const shareLink = await prisma.shareLink.findUnique({
      where: { publicId },
      include: {
        group: {
          include: {
            documents: {
              where: { id: documentId },
            },
          },
        },
      },
    })

    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found" },
        { status: 404 }
      )
    }

    if (!shareLink.isActive) {
      return NextResponse.json(
        { error: "Share link deactivated" },
        { status: 403 }
      )
    }

    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return NextResponse.json(
        { error: "Share link expired" },
        { status: 403 }
      )
    }

    const document = shareLink.group.documents[0]
    if (!document) {
      return NextResponse.json(
        { error: "Document not found in this group" },
        { status: 404 }
      )
    }

    if (!document.filePath) {
      return NextResponse.json(
        { error: "Document file not available" },
        { status: 404 }
      )
    }

    // Read and serve the file
    try {
      const filePath = join(process.cwd(), "uploads", document.filePath)
      const fileBuffer = await readFile(filePath)

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": document.fileType || "application/pdf",
          "Content-Disposition": `inline; filename="${encodeURIComponent(
            document.originalName || document.name
          )}"`,
        },
      })
    } catch (fileError) {
      console.error("Error reading file:", fileError)
      return NextResponse.json(
        { error: "Document file not found on server" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error serving document:", error)
    return NextResponse.json(
      { error: "Failed to serve document" },
      { status: 500 }
    )
  }
}
