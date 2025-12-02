/**
 * SUPER SIMPLE PDF RENAMER
 * No complex pipelines, no OCR, no eval tricks
 * Just: Read PDF → Extract text → Ask GPT → Rename file
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Extract text from PDF - THE SIMPLE WAY
 */
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    console.log(`[Simple PDF] Reading: ${path.basename(filePath)}`)
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)

    const text = pdfData.text || ''
    console.log(`[Simple PDF] Extracted ${text.length} characters`)

    return text
  } catch (error) {
    console.error('[Simple PDF] Error:', error)
    return ''
  }
}

/**
 * Get chemical name from text using GPT - THE SIMPLE WAY
 */
async function getChemicalNameFromText(text: string): Promise<string | null> {
  try {
    // Take first 3000 characters (enough for most SDS headers)
    const excerpt = text.substring(0, 3000)

    if (excerpt.length < 50) {
      console.log('[Simple GPT] Not enough text to analyze')
      return null
    }

    console.log('[Simple GPT] Asking OpenAI for chemical name...')

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a chemical safety data sheet analyzer. Extract ONLY the main chemical/product name from the SDS. Return just the chemical name, nothing else. If you cannot find it, return "Unknown".'
        },
        {
          role: 'user',
          content: `Extract the chemical/product name from this safety data sheet:\n\n${excerpt}`
        }
      ],
      temperature: 0.1,
      max_tokens: 50,
    })

    const chemicalName = completion.choices[0]?.message?.content?.trim()

    if (!chemicalName || chemicalName === 'Unknown') {
      console.log('[Simple GPT] Could not extract chemical name')
      return null
    }

    console.log(`[Simple GPT] Found: "${chemicalName}"`)
    return chemicalName

  } catch (error) {
    console.error('[Simple GPT] Error:', error)
    return null
  }
}

/**
 * Sanitize chemical name for filename
 */
function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[^0-9A-Za-zÆØÅæøå\-\_ ]+/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .slice(0, 100) || 'Unknown'
}

/**
 * MAIN FUNCTION: Get chemical name from PDF
 */
export async function getChemicalNameFromPDF(filePath: string): Promise<string | null> {
  try {
    console.log(`\n========================================`)
    console.log(`[Simple Renamer] Processing: ${path.basename(filePath)}`)
    console.log(`========================================`)

    // Step 1: Extract text from PDF
    const text = await extractTextFromPDF(filePath)

    if (!text) {
      console.log('[Simple Renamer] ✗ No text extracted')
      return null
    }

    // Step 2: Get chemical name from GPT
    const chemicalName = await getChemicalNameFromText(text)

    if (!chemicalName) {
      console.log('[Simple Renamer] ✗ No chemical name found')
      return null
    }

    // Step 3: Sanitize for filename
    const sanitized = sanitizeFilename(chemicalName)

    console.log(`[Simple Renamer] ✓ Result: "${sanitized}"`)
    return sanitized

  } catch (error) {
    console.error('[Simple Renamer] Fatal error:', error)
    return null
  }
}
