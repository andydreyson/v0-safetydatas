/**
 * API Route: /api/analyze-pdf
 *
 * Analyzes PDF files and extracts chemical names using GPT-3.5 Turbo
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractCompoundNameFromPDFWithGPT, batchExtractCompoundNames } from '@/lib/gpt-pdf-analyzer'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const file = formData.get('file') as File

    // Support both single file and multiple files
    const filesToProcess = files.length > 0 ? files : (file ? [file] : [])

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
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

    console.log(`[API] Received ${filesToProcess.length} file(s) for analysis`)

    // Single file processing (backward compatible)
    if (filesToProcess.length === 1) {
      const singleFile = filesToProcess[0]

      if (singleFile.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'File must be a PDF' },
          { status: 400 }
        )
      }

      const chemicalName = await extractCompoundNameFromPDFWithGPT(singleFile)

      return NextResponse.json({
        success: true,
        compoundName: chemicalName || singleFile.name.replace(/\.pdf$/i, ''),
        usedFallback: !chemicalName,
        fileName: singleFile.name,
        message: chemicalName
          ? `Successfully extracted: ${chemicalName}`
          : 'Could not extract chemical name, using filename'
      })
    }

    // Batch processing for multiple files
    const results = await batchExtractCompoundNames(filesToProcess)

    // Convert Map to array of results
    const resultsArray = Array.from(results.entries()).map(([fileName, chemicalName]) => ({
      fileName,
      compoundName: chemicalName || fileName.replace(/\.pdf$/i, ''),
      usedFallback: !chemicalName,
      success: chemicalName !== null
    }))

    const successCount = resultsArray.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      totalFiles: filesToProcess.length,
      successCount,
      failedCount: filesToProcess.length - successCount,
      results: resultsArray,
      message: `Successfully processed ${successCount}/${filesToProcess.length} files`
    })

  } catch (error) {
    console.error('[API] Error processing PDFs:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check API status
export async function GET() {
  const isConfigured = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'

  return NextResponse.json({
    status: 'ready',
    gptAnalyzer: isConfigured ? 'configured' : 'not configured',
    message: isConfigured
      ? 'GPT PDF Analyzer is ready to use'
      : 'Please configure OPENAI_API_KEY in .env file'
  })
}
