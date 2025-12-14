import { kv } from "@vercel/kv"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// GET /api/share/[id] - Fetch collection by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Fetch from KV
    const data = await kv.get(`collection:${id}`)

    if (!data) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}
