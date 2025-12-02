/**
 * API Route: /api/files/[...path]
 *
 * Serves files from the uploads directory
 * Example: /api/files/uploads/Acetone_e215c332.pdf
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params (Next.js 15+ requirement)
    const resolvedParams = await params

    // Join path segments
    const filePath = resolvedParams.path.join('/')
    const fullPath = path.join(process.cwd(), filePath)

    console.log(`[Files API] Request for: ${filePath}`)
    console.log(`[Files API] Full path: ${fullPath}`)

    // Security: Ensure the file is within the project directory
    const projectRoot = process.cwd()
    if (!fullPath.startsWith(projectRoot)) {
      console.error(`[Files API] Security: Path traversal attempt`)
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`[Files API] File not found: ${fullPath}`)
      return new NextResponse('File not found', { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)

    // Determine content type based on extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentType =
      ext === '.pdf' ? 'application/pdf' :
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      'application/octet-stream'

    console.log(`[Files API] ✓ Serving file: ${path.basename(fullPath)} (${contentType})`)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline', // Display in browser, not download
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })

  } catch (error) {
    console.error('[Files API] Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
