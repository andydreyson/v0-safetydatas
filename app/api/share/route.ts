import { kv } from "@vercel/kv"
import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export const runtime = "edge"

// POST /api/share - Save collection and return unique ID
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate data
    if (!data.documents || !Array.isArray(data.documents)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Generate unique ID (short, URL-friendly)
    const id = nanoid(10) // e.g., "V1StGXR8_Z"

    // Store in KV with 90 days expiration (7776000 seconds)
    await kv.set(`collection:${id}`, {
      documents: data.documents,
      createdAt: new Date().toISOString(),
      totalCompounds: data.documents.length,
    }, {
      ex: 7776000, // 90 days
    })

    // Return the ID
    return NextResponse.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/view/${id}`,
    })
  } catch (error) {
    console.error("Error saving collection:", error)
    return NextResponse.json({ error: "Failed to save collection" }, { status: 500 })
  }
}
