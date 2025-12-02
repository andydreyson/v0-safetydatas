/**
 * Server-side GPT PDF Analyzer with OCR fallback
 * Pipeline: pdf-parse → OCR (tesseract) → regex patterns → GPT-3.5
 */

import OpenAI from 'openai'
import fs from 'fs'
import { createWorker } from 'tesseract.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Norwegian chemical regex patterns (checked first before GPT)
const CHEMICAL_PATTERNS: { re: RegExp; name: string }[] = [
  { re: /\bRhodium\b/i, name: 'Rhodium' },
  { re: /\bPropan\b/i, name: 'Propan' },
  { re: /\bAceton\b/i, name: 'Aceton' },
  { re: /\bNatriumhydroksid\b/i, name: 'Natriumhydroksid' },
  { re: /\bKaustisk\s+soda\b/i, name: 'Natriumhydroksid' },
  { re: /\bSvovelsyre\b/i, name: 'Svovelsyre' },
  { re: /\bSaltsyre\b/i, name: 'Saltsyre' },
  { re: /\bAmmoniakk\b/i, name: 'Ammoniakk' },
  { re: /\bEtanol\b/i, name: 'Etanol' },
  { re: /\bMetanol\b/i, name: 'Metanol' },
  { re: /\bBensen\b/i, name: 'Bensen' },
  { re: /\bToluen\b/i, name: 'Toluen' },
  { re: /\bXylen\b/i, name: 'Xylen' },
]

/**
 * Sanitize filename for safe file system usage
 */
function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/[^0-9A-Za-zÆØÅæøå\-\_ ]+/g, '') // Allow letters, numbers, spaces, and some chars
    .replace(/\s+/g, '_')
    .slice(0, 120) || 'Ukjent'
}

/**
 * Extract text from PDF file using pdf-parse
 */
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Dynamic require to avoid bundler issues
    const pdfParseModule = eval('require')('pdf-parse')
    const pdfParse = pdfParseModule.default || pdfParseModule

    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)

    return pdfData.text || ''
  } catch (error) {
    console.error('[PDF Parse] Error:', error)
    return ''
  }
}

/**
 * Fallback: OCR with Tesseract.js for scanned PDFs
 */
async function ocrPDF(filePath: string): Promise<string> {
  try {
    console.log('[OCR] Starting OCR fallback with Tesseract...')
    const worker = await createWorker('eng+nor') // English + Norwegian

    const { data } = await worker.recognize(filePath)
    await worker.terminate()

    console.log(`[OCR] Extracted ${data.text.length} characters via OCR`)
    return data.text || ''
  } catch (error) {
    console.error('[OCR] Error:', error)
    return ''
  }
}

/**
 * Check if text matches any known chemical patterns
 */
function matchChemicalPattern(text: string): string | null {
  for (const pattern of CHEMICAL_PATTERNS) {
    if (pattern.re.test(text)) {
      console.log(`[Pattern Match] Found: ${pattern.name}`)
      return pattern.name
    }
  }
  return null
}

/**
 * Ask GPT-3.5 for a canonical chemical name
 */
async function askGPTForName(extractedText: string): Promise<string | null> {
  try {
    const truncatedText = extractedText.length > 6000
      ? extractedText.slice(0, 6000) + '\n\n--TRUNCATED--'
      : extractedText

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Du er en kortnavn-ekspert. Gitt teksten fra et PDF-dokument, returner kun ett kort, kanonisk navn (1–3 ord) som beskriver hovedinnholdet. Ta bort versjonsnumre, filnavn, eller tekniske koder. Returner kun navnet uten noen ekstra tekst.'
        },
        {
          role: 'user',
          content: `Her er teksten hentet fra PDF-en:\n\n${truncatedText}`
        }
      ],
      max_tokens: 16,
      temperature: 0.0,
    })

    const reply = response.choices[0]?.message?.content?.trim() || ''
    return reply.replace(/^["']|["']$/g, '') // Remove quotes
  } catch (error) {
    console.error('[GPT] Error:', error)
    return null
  }
}

/**
 * Main pipeline: Extract chemical name using multi-stage approach
 * 1. pdf-parse for text extraction
 * 2. OCR fallback if no text found
 * 3. Regex pattern matching
 * 4. GPT-3.5 fallback
 */
export async function extractChemicalNameWithGPT(filePath: string): Promise<string | null> {
  try {
    console.log(`[Pipeline] Starting extraction for: ${filePath}`)

    // Stage 1: Extract text with pdf-parse
    let text = await extractTextFromPDF(filePath)
    console.log(`[Pipeline] pdf-parse extracted ${text.length} characters`)

    // Stage 2: OCR fallback if insufficient text
    if (!text || text.trim().length < 30) {
      console.log('[Pipeline] Insufficient text, trying OCR fallback...')
      text = await ocrPDF(filePath)
    }

    if (!text || text.trim().length < 10) {
      console.log('[Pipeline] ✗ Could not extract sufficient text')
      return null
    }

    // Stage 3: Try regex patterns first (fast, deterministic)
    const patternMatch = matchChemicalPattern(text)
    if (patternMatch) {
      const sanitized = sanitizeName(patternMatch)
      console.log(`[Pipeline] ✓ Pattern match: "${sanitized}"`)
      return sanitized
    }

    // Stage 4: GPT-3.5 fallback (slower, but handles edge cases)
    console.log('[Pipeline] No pattern match, asking GPT-3.5...')
    const gptName = await askGPTForName(text)

    if (gptName && gptName !== 'Unknown' && gptName.length > 1) {
      const sanitized = sanitizeName(gptName)
      console.log(`[Pipeline] ✓ GPT extracted: "${sanitized}"`)
      return sanitized
    }

    console.log('[Pipeline] ✗ Could not extract chemical name')
    return null
  } catch (error) {
    console.error('[Pipeline] Error:', error)
    return null
  }
}
