import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addDocument, incrementDocumentUsage } from "@/lib/prisma-db"
import { checkDocumentLimit, formatSubscriptionError } from "@/lib/subscription-gate"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { getChemicalNameFromPDF } from "@/lib/simple-pdf-renamer"

export const runtime = "nodejs"

// Helper function to sanitize chemical names for use as filenames
function sanitizeFilename(name: string): string {
  return (
    name
      .trim()
      .replace(/[^0-9A-Za-zÆØÅæøå\-\_ ]+/g, "") // Allow letters, numbers, spaces, and Norwegian chars
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .slice(0, 100) || "unknown"
  ) // Limit length
}

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

    // Get files from request
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    // Check subscription limit BEFORE uploading
    const limitCheck = await checkDocumentLimit(userId)

    if (!limitCheck.canUpload) {
      return NextResponse.json(
        {
          error: limitCheck.errorMessage,
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      )
    }

    // Check if uploading this many files would exceed limit
    if (
      limitCheck.remaining !== null &&
      files.length > limitCheck.remaining
    ) {
      return NextResponse.json(
        {
          error: `Can only upload ${limitCheck.remaining} more document(s). You're trying to upload ${files.length}.`,
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      )
    }

    const uploadedDocuments = []

    for (const file of files) {
      // Step 1: Save file temporarily first
      const tempId = uuidv4()
      const extension = path.extname(file.name)
      const tempFilename = `temp_${tempId}${extension}`
      const uploadsDir = path.join(process.cwd(), "uploads")
      const tempFilePath = path.join(uploadsDir, tempFilename)

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file temporarily
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fs.writeFileSync(tempFilePath, buffer)

      // Step 2: Extract chemical name from saved PDF
      let compoundName = file.name.replace(path.extname(file.name), "")

      if (file.type === "application/pdf") {
        console.log(`[Upload] Analyzing PDF: ${file.name}`)
        try {
          const extractedName = await getChemicalNameFromPDF(tempFilePath)
          if (extractedName) {
            compoundName = extractedName
            console.log(`[Upload] ✓ Extracted name: "${compoundName}"`)
          } else {
            console.log(`[Upload] ✗ Could not extract, using filename`)
          }
        } catch (error) {
          console.error(`[Upload] Error:`, error)
          console.log(`[Upload] ✗ Using filename as fallback`)
        }
      }

      // Step 3: Rename file with chemical name
      const fileId = uuidv4()
      const sanitizedName = sanitizeFilename(compoundName)
      const filename = `${sanitizedName}_${fileId.substring(0, 8)}${extension}`
      const finalFilePath = path.join(uploadsDir, filename)

      // Rename from temp to final name
      fs.renameSync(tempFilePath, finalFilePath)

      console.log(`[Upload] ✓ Saved as: ${filename}`)

      // Create document metadata and save to database (with userId)
      const document = await addDocument(userId, {
        name: compoundName,
        originalName: file.name,
        compoundName: compoundName,
        fileType: file.type || "unknown",
        size: `${(file.size / 1024).toFixed(2)} KB`,
        filePath: `uploads/${filename}`,
        tags: [],
      })

      uploadedDocuments.push(document)

      // Increment usage counter
      await incrementDocumentUsage(userId, 1)
    }

    return NextResponse.json({
      success: true,
      documents: uploadedDocuments,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    )
  }
}
