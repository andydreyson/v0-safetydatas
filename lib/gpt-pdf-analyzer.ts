/**
 * GPT-3.5 Turbo PDF Chemical Name Extraction
 *
 * This module uses OpenAI's GPT-3.5 Turbo to intelligently extract and clean
 * chemical names from SDS/MSDS PDFs with high accuracy and context understanding.
 *
 * Cost: ~$0.0018-0.006 per PDF (depending on size)
 */

import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Dynamic import for PDF.js to avoid server-side issues
let pdfjsLib: typeof import('pdfjs-dist') | null = null

async function getPdfLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }
  return pdfjsLib
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(file: File, maxPages: number = 1): Promise<string> {
  const pdfjs = await getPdfLib()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  const pagesToRead = Math.min(maxPages, pdf.numPages)
  let fullText = ''

  for (let pageNum = 1; pageNum <= pagesToRead; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText
}

/**
 * Use GPT-3.5 Turbo to extract and clean chemical name from PDF text
 */
async function extractChemicalNameWithGPT(pdfText: string): Promise<string | null> {
  try {
    const prompt = `You are an expert at reading Safety Data Sheets (SDS/MSDS).

Your task is to extract and clean the primary chemical or product name from the following SDS text.

Instructions:
1. Find the main chemical/product name (usually in Section 1)
2. Remove any extra information like:
   - CAS numbers
   - EC numbers
   - Purity percentages
   - Version numbers
   - Dates
   - "MSDS" or "SDS" text
   - Company names
3. Return ONLY the clean chemical name, properly capitalized
4. If you cannot find a clear chemical name, return "Unknown"

Examples:
- Input: "Product name: Propane CAS NO: 74-98-6" → Output: "Propane"
- Input: "1.1 Product identifier: Sulfuric Acid ≥95% purity" → Output: "Sulfuric Acid"
- Input: "RHODIUM CAS NO 7440-16-6 MSDS" → Output: "Rhodium"

SDS Text:
${pdfText.substring(0, 3000)}

Chemical Name:`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at extracting chemical names from Safety Data Sheets. Always return clean, properly formatted chemical names.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 50,
    })

    const extractedName = response.choices[0]?.message?.content?.trim()

    if (!extractedName || extractedName === 'Unknown' || extractedName.length < 2) {
      return null
    }

    return extractedName
  } catch (error) {
    console.error('[GPT PDF Analyzer] Error calling OpenAI API:', error)
    throw error
  }
}

/**
 * Main function: Extract compound name from PDF using GPT-3.5 Turbo
 */
export async function extractCompoundNameFromPDFWithGPT(file: File): Promise<string | null> {
  try {
    if (file.type !== 'application/pdf') {
      console.error('[GPT PDF Analyzer] Not a PDF file')
      return null
    }

    console.log(`\n${'='.repeat(80)}`)
    console.log(`[GPT PDF ANALYZER] Starting analysis for: ${file.name}`)
    console.log(`${'='.repeat(80)}`)

    // Step 1: Extract text from PDF (first page only)
    console.log('[GPT PDF Analyzer] Step 1: Extracting text from PDF...')
    const pdfText = await extractTextFromPDF(file, 1)
    console.log(`[GPT PDF Analyzer] Extracted ${pdfText.length} characters`)

    // Step 2: Use GPT-3.5 to extract and clean the chemical name
    console.log('[GPT PDF Analyzer] Step 2: Analyzing with GPT-3.5 Turbo...')
    const chemicalName = await extractChemicalNameWithGPT(pdfText)

    if (chemicalName) {
      console.log(`[GPT PDF Analyzer] ✓ Extracted chemical name: "${chemicalName}"`)
      console.log(`${'='.repeat(80)}\n`)
      return chemicalName
    } else {
      console.log('[GPT PDF Analyzer] ✗ Could not extract chemical name')
      console.log(`${'='.repeat(80)}\n`)
      return null
    }
  } catch (error) {
    console.error('[GPT PDF Analyzer] Error:', error)
    return null
  }
}

/**
 * Batch processing function for multiple PDFs
 */
export async function batchExtractCompoundNames(files: File[]): Promise<Map<string, string | null>> {
  console.log(`\n[GPT PDF Analyzer] Starting batch processing for ${files.length} files`)

  const results = new Map<string, string | null>()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    console.log(`\n[${i + 1}/${files.length}] Processing: ${file.name}`)

    try {
      const chemicalName = await extractCompoundNameFromPDFWithGPT(file)
      results.set(file.name, chemicalName)

      // Small delay to avoid rate limits (optional)
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`[GPT PDF Analyzer] Error processing ${file.name}:`, error)
      results.set(file.name, null)
    }
  }

  console.log(`\n[GPT PDF Analyzer] Batch processing complete!`)
  console.log(`Successfully extracted: ${Array.from(results.values()).filter(v => v !== null).length}/${files.length}`)

  return results
}

/**
 * Estimate cost for processing PDFs
 */
export function estimateProcessingCost(
  numPDFs: number,
  avgPagesPerPDF: number = 1
): { totalCost: number; costPerPDF: number } {
  // GPT-3.5 Turbo pricing (as of 2025)
  const inputCostPer1M = 0.50  // $0.50 per 1M tokens
  const outputCostPer1M = 1.50 // $1.50 per 1M tokens

  // Estimates (reading only first page)
  const tokensPerPage = 500
  const inputTokensPerPDF = Math.min(avgPagesPerPDF * tokensPerPage, 1500) // Max 1 page (~1500 tokens)
  const outputTokensPerPDF = 50

  const inputCostPerPDF = (inputTokensPerPDF / 1000000) * inputCostPer1M
  const outputCostPerPDF = (outputTokensPerPDF / 1000000) * outputCostPer1M
  const costPerPDF = inputCostPerPDF + outputCostPerPDF

  return {
    costPerPDF: Number(costPerPDF.toFixed(6)),
    totalCost: Number((costPerPDF * numPDFs).toFixed(2))
  }
}
