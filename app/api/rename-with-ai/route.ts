/**
 * API Route: /api/rename-with-ai
 *
 * Batch renames documents using GPT-3.5 Turbo by analyzing PDFs from disk
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDocumentById, updateDocument } from '@/lib/db'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { getChemicalNameFromPDF } from '@/lib/simple-pdf-renamer'

export const runtime = 'nodejs'

// Helper function to sanitize chemical names for use as filenames
function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[^0-9A-Za-zÆØÅæøå\-\_ ]+/g, '') // Allow letters, numbers, spaces, and Norwegian chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .slice(0, 100) || 'unknown' // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const { documentIds } = await request.json()

    if (!documentIds || documentIds.length === 0) {
      return NextResponse.json(
        { error: 'No document IDs provided' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          message: 'Please add your OPENAI_API_KEY to the .env file'
        },
        { status: 500 }
      )
    }

    console.log(`[Rename API] Processing ${documentIds.length} documents`)

    const results = []

    for (const docId of documentIds) {
      try {
        // Get document from database
        const document = await getDocumentById(docId)

        if (!document) {
          results.push({
            documentId: docId,
            success: false,
            error: 'Document not found'
          })
          continue
        }

        // Check if it's a PDF
        if (document.fileType !== 'application/pdf') {
          results.push({
            documentId: docId,
            originalName: document.originalName,
            success: false,
            error: 'Not a PDF file'
          })
          continue
        }

        // Load PDF from disk
        const filePath = path.join(process.cwd(), document.filePath)

        if (!fs.existsSync(filePath)) {
          results.push({
            documentId: docId,
            originalName: document.originalName,
            success: false,
            error: 'File not found on disk'
          })
          continue
        }

        console.log(`[Rename API] Processing: ${document.originalName}`)

        // Extract chemical name using SIMPLE method
        const chemicalName = await getChemicalNameFromPDF(filePath)

        if (chemicalName) {
          // Generate new filename based on chemical name
          const extension = path.extname(filePath)
          const sanitizedName = sanitizeFilename(chemicalName)
          const uniqueId = uuidv4().substring(0, 8)
          const newFilename = `${sanitizedName}_${uniqueId}${extension}`
          const uploadsDir = path.join(process.cwd(), 'uploads')
          const newFilePath = path.join(uploadsDir, newFilename)

          // Physically rename the file on disk
          try {
            fs.renameSync(filePath, newFilePath)
            console.log(`[Rename API] ✓ File renamed: ${path.basename(filePath)} → ${newFilename}`)
          } catch (renameError) {
            console.error(`[Rename API] ✗ Error renaming file:`, renameError)
            results.push({
              documentId: docId,
              originalName: document.originalName,
              success: false,
              error: 'Failed to rename physical file'
            })
            continue
          }

          // Update document in database with new name AND new file path
          await updateDocument(docId, {
            compoundName: chemicalName,
            name: chemicalName,
            filePath: `uploads/${newFilename}`
          })

          console.log(`[Rename API] ✓ "${document.originalName}" → "${chemicalName}"`)

          results.push({
            documentId: docId,
            originalName: document.originalName,
            newName: chemicalName,
            newFilename: newFilename,
            success: true
          })
        } else {
          console.log(`[Rename API] ✗ Could not extract name from "${document.originalName}"`)

          results.push({
            documentId: docId,
            originalName: document.originalName,
            success: false,
            error: 'Could not extract chemical name'
          })
        }

        // Small delay to avoid overwhelming OpenAI API
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`[Rename API] Error processing document ${docId}:`, error)
        results.push({
          documentId: docId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    console.log(`[Rename API] Complete: ${successCount}/${documentIds.length} successful`)

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: documentIds.length,
        successful: successCount,
        failed: documentIds.length - successCount
      }
    })

  } catch (error) {
    console.error('[Rename API] Fatal error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process documents',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
