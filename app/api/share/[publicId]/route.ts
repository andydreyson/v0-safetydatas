import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET /api/share/[publicId] - Get public share link data
export async function GET(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const { searchParams } = new URL(req.url)
    const password = searchParams.get("password")

    const shareLink = await prisma.shareLink.findUnique({
      where: { publicId },
      include: {
        group: {
          include: {
            documents: {
              select: {
                id: true,
                name: true,
                compoundName: true,
                fileType: true,
                size: true,
                filePath: true,
                pageNumber: true,
                tags: true,
                category: true,
                description: true,
              },
              orderBy: {
                compoundName: "asc",
              },
            },
            user: {
              select: {
                company: true,
              },
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

    // Check if link is active
    if (!shareLink.isActive) {
      return NextResponse.json(
        { error: "This share link has been deactivated" },
        { status: 403 }
      )
    }

    // Check if link has expired
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return NextResponse.json(
        { error: "This share link has expired" },
        { status: 403 }
      )
    }

    // Check password if set
    if (shareLink.password) {
      if (!password) {
        return NextResponse.json(
          { error: "Password required", requiresPassword: true },
          { status: 401 }
        )
      }

      const isValidPassword = await bcrypt.compare(password, shareLink.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        )
      }
    }

    // Update view count and last accessed
    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: {
        viewCount: { increment: 1 },
        lastAccessed: new Date(),
      },
    })

    // Return public-safe data
    return NextResponse.json({
      shareLink: {
        id: shareLink.id,
        publicId: shareLink.publicId,
        createdAt: shareLink.createdAt,
        group: {
          id: shareLink.group.id,
          name: shareLink.group.name,
          description: shareLink.group.description,
          company: shareLink.group.user.company,
          documents: shareLink.group.documents.map((doc) => ({
            ...doc,
            // Generate a temporary access URL for the document
            viewUrl: doc.filePath
              ? `/api/share/${publicId}/documents/${doc.id}`
              : null,
          })),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching share link:", error)
    return NextResponse.json(
      { error: "Failed to fetch share link" },
      { status: 500 }
    )
  }
}
