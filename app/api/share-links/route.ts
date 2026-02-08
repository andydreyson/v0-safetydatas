import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"

// POST /api/share-links - Create a new share link for a group
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { groupId, password, expiresAt } = await req.json()

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 })
    }

    // Verify the group belongs to the user
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        userId: user.id,
      },
    })

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    // Create share link with a short public ID
    const publicId = nanoid(12)
    
    const shareLink = await prisma.shareLink.create({
      data: {
        publicId,
        groupId,
        userId: user.id,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/safety/${publicId}`

    return NextResponse.json({
      shareLink: {
        ...shareLink,
        url: shareUrl,
      },
    })
  } catch (error) {
    console.error("Error creating share link:", error)
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    )
  }
}

// GET /api/share-links - List share links for user's groups
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: {
        userId: user.id,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const shareLinksWithUrl = shareLinks.map((link) => ({
      ...link,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/safety/${link.publicId}`,
    }))

    return NextResponse.json({ shareLinks: shareLinksWithUrl })
  } catch (error) {
    console.error("Error fetching share links:", error)
    return NextResponse.json(
      { error: "Failed to fetch share links" },
      { status: 500 }
    )
  }
}
