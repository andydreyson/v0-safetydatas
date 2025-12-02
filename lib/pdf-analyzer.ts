/**
 * Advanced PDF Chemical Name Extraction
 *
 * This module provides intelligent extraction of chemical names from SDS/MSDS PDFs
 * using rule-based pattern matching and contextual analysis.
 */

// Dynamic import to avoid server-side issues
let pdfjsLib: typeof import('pdfjs-dist') | null = null

async function getPdfLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }
  return pdfjsLib
}

// Comprehensive chemical database (expanded)
const CHEMICAL_DATABASE = [
  // Solvents and Alcohols
  'acetone', 'ethanol', 'methanol', 'isopropanol', 'isopropyl alcohol', 'ipa',
  'butanol', 'propanol', 'glycerol', 'glycerin', 'ethylene glycol', 'propylene glycol',
  'diethylene glycol', 'triethylene glycol', 'butyl glycol', 'ethyl acetate', 'butyl acetate',
  'methyl ethyl ketone', 'mek', 'methyl isobutyl ketone', 'mibk',

  // Acids
  'sulfuric acid', 'sulphuric acid', 'hydrochloric acid', 'muriatic acid',
  'nitric acid', 'acetic acid', 'phosphoric acid', 'citric acid', 'formic acid',
  'oxalic acid', 'tartaric acid', 'lactic acid', 'benzoic acid', 'boric acid',
  'carbonic acid', 'hydrofluoric acid', 'perchloric acid', 'chromic acid',

  // Bases
  'sodium hydroxide', 'caustic soda', 'lye', 'potassium hydroxide', 'caustic potash',
  'ammonium hydroxide', 'ammonia solution', 'calcium hydroxide', 'slaked lime',
  'magnesium hydroxide', 'lithium hydroxide',

  // Hydrocarbons and Fuels
  'propane', 'butane', 'pentane', 'hexane', 'heptane', 'octane', 'nonane', 'decane',
  'toluene', 'xylene', 'benzene', 'styrene', 'naphthalene', 'anthracene',
  'gasoline', 'petrol', 'diesel', 'kerosene', 'mineral oil', 'petroleum',
  'naphtha', 'white spirit', 'paint thinner', 'turpentine', 'mineral spirits',
  'paraffin', 'cyclohexane', 'methylcyclohexane',

  // Salts and Minerals
  'sodium chloride', 'table salt', 'salt', 'calcium chloride', 'magnesium chloride',
  'potassium chloride', 'sodium carbonate', 'soda ash', 'washing soda',
  'sodium bicarbonate', 'baking soda', 'calcium carbonate', 'limestone', 'chalk',
  'ammonium chloride', 'ammonium sulfate', 'ammonium sulphate', 'sodium sulfate',
  'sodium sulphate', 'potassium permanganate', 'sodium hypochlorite', 'bleach',
  'calcium hypochlorite', 'sodium nitrate', 'potassium nitrate', 'saltpeter',
  'sodium tetraborate', 'borax', 'sodium phosphate', 'trisodium phosphate', 'tsp',

  // Peroxides
  'hydrogen peroxide', 'benzoyl peroxide', 'methyl ethyl ketone peroxide', 'mekp',
  'cumene hydroperoxide', 'tert-butyl hydroperoxide',

  // Metals and Compounds
  'aluminum', 'aluminium', 'aluminum oxide', 'alumina', 'copper', 'copper sulfate',
  'copper sulphate', 'iron', 'iron oxide', 'rust', 'zinc', 'zinc oxide',
  'zinc chloride', 'lead', 'lead oxide', 'mercury', 'silver', 'silver nitrate',
  'gold', 'platinum', 'rhodium', 'palladium', 'nickel', 'nickel sulfate',
  'chromium', 'chromium trioxide', 'tin', 'titanium', 'titanium dioxide',
  'magnesium', 'magnesium oxide', 'calcium', 'calcium oxide', 'quicklime',
  'sodium', 'potassium', 'lithium', 'barium', 'barium sulfate',

  // Gases
  'oxygen', 'nitrogen', 'argon', 'helium', 'neon', 'carbon dioxide', 'co2',
  'carbon monoxide', 'chlorine', 'ammonia', 'hydrogen', 'methane', 'ethane',
  'propylene', 'ethylene', 'acetylene', 'sulfur dioxide', 'nitrogen dioxide',
  'nitrous oxide', 'laughing gas', 'hydrogen sulfide', 'hydrogen sulphide',

  // Cleaning Products and Surfactants
  'sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles',
  'bleach', 'detergent', 'surfactant', 'soap', 'disinfectant', 'sanitizer',
  'quaternary ammonium', 'benzalkonium chloride', 'cetrimonium bromide',

  // Lab Chemicals
  'formaldehyde', 'formalin', 'glutaraldehyde', 'phenol', 'carbolic acid',
  'chloroform', 'trichloromethane', 'ether', 'diethyl ether', 'dichloromethane',
  'methylene chloride', 'acetonitrile', 'dimethyl sulfoxide', 'dmso',
  'tetrahydrofuran', 'thf', 'dimethylformamide', 'dmf', 'pyridine',
  'triethylamine', 'aniline', 'phenolphthalein', 'bromothymol blue',

  // Polymers and Resins
  'polyethylene', 'polypropylene', 'polystyrene', 'polyvinyl chloride', 'pvc',
  'polyvinyl alcohol', 'pva', 'polyethylene terephthalate', 'pet',
  'polymethyl methacrylate', 'pmma', 'acrylic', 'nylon', 'polyamide',
  'silicone', 'polydimethylsiloxane', 'pdms', 'epoxy', 'epoxy resin',
  'polyurethane', 'polyester', 'phenolic resin', 'urea formaldehyde',

  // Fertilizers and Agricultural
  'urea', 'ammonium nitrate', 'calcium nitrate', 'potassium nitrate',
  'superphosphate', 'triple superphosphate', 'diammonium phosphate', 'dap',
  'monoammonium phosphate', 'map', 'potassium chloride', 'muriate of potash',

  // Food and Pharma
  'glucose', 'dextrose', 'fructose', 'sucrose', 'sugar', 'lactose',
  'starch', 'cellulose', 'ascorbic acid', 'vitamin c', 'citric acid',
  'sorbitol', 'glycerin', 'propylene glycol',

  // Other Common Chemicals
  'water', 'distilled water', 'deionized water', 'silica', 'silicon dioxide',
  'graphite', 'carbon', 'activated carbon', 'charcoal', 'sulfur', 'sulphur',
  'phosphorus', 'iodine', 'fluorine', 'bromine', 'chlorine dioxide',
  'sodium thiosulfate', 'sodium thiosulphate', 'hypo', 'calcium sulfate',
  'gypsum', 'plaster of paris', 'kaolin', 'china clay', 'talc',
  'magnesium silicate', 'asbestos', 'mica', 'vermiculite', 'perlite',
]

// Multi-language SDS section headers
const SECTION_HEADERS = {
  english: [
    'product identifier', 'identification of the substance', 'product name',
    'trade name', 'chemical name', 'substance name', 'material name',
    'product and company identification', 'identification'
  ],
  norwegian: [
    'produktidentifikasjon', 'identifikasjon av stoffet', 'produktnavn',
    'handelsnavn', 'kjemisk navn', 'stoffnavn', 'materialnavn'
  ],
  swedish: [
    'produktidentifiering', 'identifiering av ämnet', 'produktnamn',
    'handelsnamn', 'kemiskt namn', 'ämnesnamn'
  ],
  danish: [
    'produktidentifikation', 'identifikation af stoffet', 'produktnavn',
    'handelsnavn', 'kemisk navn', 'stofnavn'
  ],
  german: [
    'produktidentifikator', 'identifizierung des stoffes', 'produktname',
    'handelsname', 'chemischer name', 'stoffname'
  ],
  french: [
    'identificateur de produit', 'identification de la substance', 'nom du produit',
    'nom commercial', 'nom chimique', 'nom de la substance'
  ]
}

// Words to exclude from chemical names
const EXCLUDED_WORDS = [
  'page', 'section', 'version', 'date', 'safety', 'data', 'sheet', 'material',
  'identification', 'product identifier', 'substance', 'mixture', 'company',
  'supplier', 'emergency', 'telephone', 'information', 'ireland', 'england',
  'regulations', 'product', 'name', 'trade', 'article', 'index', 'registration',
  'msds', 'sds', 'revision', 'print', 'issue', 'document', 'number', 'code',
  'reference', 'according', 'regulation', 'annex', 'reach', 'clp', 'ghs',
  'manufacturer', 'distributor', 'address', 'phone', 'fax', 'email', 'website',
  'recommended', 'use', 'restrictions', 'details'
]

interface ExtractionResult {
  name: string | null
  confidence: number
  method: string
  context?: string
}

/**
 * Normalize text for better matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõöø]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[æ]/g, 'ae')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Clean extracted chemical name
 */
function cleanChemicalName(name: string): string {
  return name
    .trim()
    // Remove parenthetical content
    .replace(/\s*\(.*?\)\s*/g, ' ')
    // Remove purity info
    .replace(/\s*[≥>]\s*[\d.,]+\s*%.*$/i, '')
    .replace(/\s*,?\s*for\s+synthesis.*$/i, '')
    // Remove dates
    .replace(/\s*\d{4}-\d{2}-\d{2}.*$/g, '')
    // Remove CAS numbers
    .replace(/\s*CAS\s*NO?\s*:?\s*[\d\-]+.*$/gi, '')
    .replace(/\s*CAS\s*:?\s*[\d\-]+.*$/gi, '')
    .replace(/\s+CAS$/i, '')
    // Remove EC numbers
    .replace(/\s*EC\s*NO?\s*:?\s*[\d\-]+.*$/gi, '')
    .replace(/\s*INDEX\s*NO?\s*:?\s*[\d\-]+.*$/gi, '')
    // Remove document type
    .replace(/\s*(MSDS|SDS|datasheet).*$/i, '')
    .replace(/\s+(version|revision|page).*$/i, '')
    // Remove trailing symbols and numbers
    .replace(/[\:\-\,\;]+$/, '')
    .replace(/\s*\d+\s*$/, '')
    // Clean whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validate if a name is a valid chemical name
 */
function isValidChemicalName(name: string): boolean {
  if (!name || name.length < 3 || name.length > 100) return false
  if (!/[a-zA-Z]{3,}/.test(name)) return false
  if (/^\d+$/.test(name)) return false

  const lowerName = name.toLowerCase()

  // Check if it's an excluded word
  if (EXCLUDED_WORDS.some(word => lowerName === word)) return false
  if (/^(article|index|registration|cas|ec|tel|email|web|phone|www|http)/i.test(name)) return false

  // Must not be mostly numbers
  const letterCount = (name.match(/[a-zA-Z]/g) || []).length
  const digitCount = (name.match(/\d/g) || []).length
  if (digitCount > letterCount) return false

  return true
}

/**
 * Calculate similarity score between two strings
 */
function getSimilarityScore(str1: string, str2: string): number {
  const s1 = normalizeText(str1)
  const s2 = normalizeText(str2)

  if (s1 === s2) return 100
  if (s1.includes(s2) || s2.includes(s1)) {
    const shorter = Math.min(s1.length, s2.length)
    const longer = Math.max(s1.length, s2.length)
    return Math.floor((shorter / longer) * 95)
  }

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const matchingWords = words1.filter(w => words2.includes(w)).length
  if (matchingWords > 0) {
    return Math.floor((matchingWords / Math.max(words1.length, words2.length)) * 85)
  }

  return 0
}

/**
 * Search for chemical in text from database
 */
function findChemicalInText(text: string, chemical: string): ExtractionResult | null {
  const normalized = normalizeText(text)
  const chemicalNorm = normalizeText(chemical)

  // Direct substring search
  const index = normalized.indexOf(chemicalNorm)
  if (index !== -1) {
    const start = Math.max(0, index - 50)
    const end = Math.min(normalized.length, index + chemicalNorm.length + 50)
    return {
      name: chemical,
      confidence: 100,
      method: 'database_exact_match',
      context: text.substring(start, end)
    }
  }

  // Word boundary search
  const regex = new RegExp(`\\b${chemicalNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  if (regex.test(normalized)) {
    return {
      name: chemical,
      confidence: 95,
      method: 'database_word_match'
    }
  }

  // Partial word match (for multi-word chemicals)
  const words = chemicalNorm.split(/\s+/)
  if (words.length > 1) {
    const allWordsFound = words.every(word => normalized.includes(word))
    if (allWordsFound) {
      return {
        name: chemical,
        confidence: 85,
        method: 'database_partial_match'
      }
    }
  }

  return null
}

/**
 * Extract using pattern matching
 */
function extractUsingPatterns(fullText: string): ExtractionResult | null {
  const patterns = [
    // Section 1.1 patterns (most reliable)
    {
      name: 'section_1_1_product_identifier',
      regex: /1\.1\s*[:\.]?\s*Product\s*identifier\s*[:\.]?\s*\n?\s*([^\n]{5,100})/i,
      confidence: 95
    },
    {
      name: 'section_1_1_substance',
      regex: /1\.1\s*[:\.]?\s*.*?substance\s*[:\.]?\s*\n?\s*([A-Z][^\n]{3,80}?)(?:\n|CAS|EC|Article|Registration|Index)/i,
      confidence: 90
    },
    // Product name with colon
    {
      name: 'product_name_colon',
      regex: /Product\s+[Nn]ame\s*[:\：]\s*\n?\s*([^\n]{3,80})/i,
      confidence: 85
    },
    // Trade name with colon
    {
      name: 'trade_name_colon',
      regex: /Trade\s+[Nn]ame\s*[:\：]\s*\n?\s*([^\n]{3,80})/i,
      confidence: 85
    },
    // Chemical name with colon
    {
      name: 'chemical_name_colon',
      regex: /Chemical\s+[Nn]ame\s*[:\：]\s*\n?\s*([^\n]{3,80})/i,
      confidence: 90
    },
    // Material name
    {
      name: 'material_name',
      regex: /Material\s+[Nn]ame\s*[:\：]\s*\n?\s*([^\n]{3,80})/i,
      confidence: 85
    },
    // Substance/Mixture with name
    {
      name: 'substance_mixture',
      regex: /(?:Substance|Mixture)\s*[:\：]?\s*\n?\s*([A-Z][a-z]+(?:\s+[A-Za-z]+){0,4})/i,
      confidence: 80
    },
    // MSDS header
    {
      name: 'msds_header',
      regex: /(?:MATERIAL\s+)?SAFETY\s+DATA\s+SHEET\s*\n\s*([A-Z][a-z]+(?:\s+[A-Za-z]+){0,3})/i,
      confidence: 75
    },
    // SDS header
    {
      name: 'sds_header',
      regex: /SAFETY\s+DATA\s+SHEET\s*\n\s*([A-Z][a-z]+(?:\s+[A-Za-z]+){0,3})/i,
      confidence: 75
    }
  ]

  for (const pattern of patterns) {
    const match = fullText.match(pattern.regex)
    if (match && match[1]) {
      // Split on common delimiters to get just the name
      const rawName = match[1].split(/\n|Synonym|CAS|EC|Product|Date|Version|Page|Article|Registration|Index/i)[0]
      const cleaned = cleanChemicalName(rawName)

      if (isValidChemicalName(cleaned)) {
        console.log(`[PDF] ✓ Pattern match (${pattern.name}): "${cleaned}"`)
        return {
          name: cleaned,
          confidence: pattern.confidence,
          method: `pattern_${pattern.name}`
        }
      }
    }
  }

  return null
}

/**
 * Extract chemical name from specific sections
 */
function extractFromSection(fullText: string, sectionNumber: string = '1'): ExtractionResult | null {
  // Try to extract just the relevant section
  const sectionRegex = new RegExp(
    `(?:^|\\n)\\s*${sectionNumber}[\\.\\s].*?(?=\\n\\s*\\d+[\\.\\s]|$)`,
    'is'
  )

  const sectionMatch = fullText.match(sectionRegex)
  if (!sectionMatch) return null

  const sectionText = sectionMatch[0]

  // Look for name after section headers in multiple languages
  for (const [lang, headers] of Object.entries(SECTION_HEADERS)) {
    for (const header of headers) {
      const headerRegex = new RegExp(
        `${header}\\s*[:\\：]?\\s*\\n?\\s*([^\\n]{3,100})`,
        'i'
      )
      const match = sectionText.match(headerRegex)
      if (match && match[1]) {
        const cleaned = cleanChemicalName(match[1])
        if (isValidChemicalName(cleaned)) {
          console.log(`[PDF] ✓ Section ${sectionNumber} match (${lang}): "${cleaned}"`)
          return {
            name: cleaned,
            confidence: 88,
            method: `section_${sectionNumber}_${lang}`
          }
        }
      }
    }
  }

  return null
}

/**
 * Main extraction function
 */
export async function extractCompoundNameFromPDF(file: File): Promise<string | null> {
  try {
    if (file.type !== 'application/pdf') return null

    console.log(`\n${'='.repeat(80)}`)
    console.log(`[PDF ANALYZER] Starting analysis for: ${file.name}`)
    console.log(`${'='.repeat(80)}`)

    // Get PDF.js library
    const pdfjs = await getPdfLib()

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

    // Read first 5 pages to find chemical name
    const maxPages = Math.min(5, pdf.numPages)
    let fullText = ''

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n'
    }

    console.log(`[PDF ANALYZER] Extracted ${fullText.length} characters from ${maxPages} page(s)`)

    const results: ExtractionResult[] = []

    // Strategy 1: Search for known chemicals from database
    console.log(`[PDF ANALYZER] Strategy 1: Database search (${CHEMICAL_DATABASE.length} chemicals)...`)
    for (const chemical of CHEMICAL_DATABASE) {
      const result = findChemicalInText(fullText, chemical)
      if (result && result.confidence >= 85) {
        results.push(result)
        if (result.confidence === 100) {
          console.log(`[PDF ANALYZER]   ✓ Found exact match: "${chemical}"`)
          break // Stop on exact match
        }
      }
    }

    // Strategy 2: Pattern-based extraction
    if (results.length === 0 || results[0].confidence < 95) {
      console.log(`[PDF ANALYZER] Strategy 2: Pattern matching...`)
      const patternResult = extractUsingPatterns(fullText)
      if (patternResult) {
        results.push(patternResult)
      }
    }

    // Strategy 3: Section-based extraction
    if (results.length === 0 || results[0].confidence < 90) {
      console.log(`[PDF ANALYZER] Strategy 3: Section analysis...`)
      const sectionResult = extractFromSection(fullText, '1')
      if (sectionResult) {
        results.push(sectionResult)
      }
    }

    // Select best result
    if (results.length > 0) {
      results.sort((a, b) => b.confidence - a.confidence)
      const bestResult = results[0]

      // Capitalize properly
      const capitalized = bestResult.name
        .split(' ')
        .map((word, index) => {
          // Keep certain words lowercase (unless first word)
          const lowerWords = ['of', 'and', 'or', 'the', 'for', 'in', 'on']
          if (index > 0 && lowerWords.includes(word.toLowerCase())) {
            return word.toLowerCase()
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')

      console.log(`[PDF ANALYZER] ✓ Best match: "${capitalized}" (confidence: ${bestResult.confidence}%, method: ${bestResult.method})`)
      console.log(`${'='.repeat(80)}\n`)
      return capitalized
    }

    console.log(`[PDF ANALYZER] ✗ No chemical name found`)
    console.log(`[PDF ANALYZER] Text preview: ${fullText.substring(0, 500)}...`)
    console.log(`${'='.repeat(80)}\n`)

  } catch (error) {
    console.error('[PDF ANALYZER] Error:', error)
  }

  return null
}
