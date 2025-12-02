// Test script to analyze PDF extraction
const fs = require('fs');
const path = require('path');

// Use dynamic import for ES module
async function loadPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');
  // Set up worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  return pdfjsLib;
}

async function extractText(pdfPath, pdfjsLib) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`FILE: ${pdfPath}`);
  console.log(`${'='.repeat(80)}\n`);

  // Read first 2 pages
  const maxPages = Math.min(2, pdf.numPages);
  let fullText = '';

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + ' ';
  }

  console.log('FULL TEXT (first 1000 chars):');
  console.log('-'.repeat(80));
  console.log(fullText.substring(0, 1000));
  console.log('-'.repeat(80));

  // Test patterns
  const patterns = [
    { name: 'Product name', regex: /Product\s*[Nn]ame\s*[:：]\s*([A-Za-z][A-Za-z0-9\s\-,.']+?)(?:\s+\d|\s+Product|\s+Version|\s+CAS|\s+EC|\s*$|1\.2)/i },
    { name: 'Trade name', regex: /Trade\s*[Nn]ame\s*[:：]\s*([A-Za-z][A-Za-z0-9\s\-,.']+?)(?:\s+\d|\s+Product|\s+Version|\s+CAS|\s+EC|\s*$|1\.2)/i },
    { name: 'Commercial name', regex: /Commercial\s*[Nn]ame\s*[:：]\s*([A-Za-z][A-Za-z0-9\s\-,.']+?)(?:\s+\d|\s+Product|\s+Version|\s+CAS|\s+EC|\s*$|1\.2)/i },
    { name: '1.1 Product identifier', regex: /1\.1[^\n]*Product\s*identifier[^\n:]*[:：]\s*([A-Za-z][A-Za-z0-9\s\-,.']+?)(?:\s+1\.2|\s+Synonyms|\s+Product|\s*$)/i },
  ];

  console.log('\nPATTERN MATCHES:');
  console.log('-'.repeat(80));

  for (const { name, regex } of patterns) {
    const match = fullText.match(regex);
    if (match) {
      console.log(`✓ ${name}: "${match[1]}"`);
    } else {
      console.log(`✗ ${name}: No match`);
    }
  }

  console.log('\n');
}

async function main() {
  const pdfjsLib = await loadPdfJs();

  const testFiles = [
    '../mockup datasheets/SDB-5025-IE-EN.pdf',
    '../mockup datasheets/Propane-GHS-SDS-2021-09-17_EN.pdf',
    '../mockup datasheets/Paint-thinner-kleanstrip.pdf',
    '../mockup datasheets/51_2006764091_RHODIUMCASNO7440-16-6MSDS.pdf',
  ];

  for (const file of testFiles) {
    try {
      await extractText(file, pdfjsLib);
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

main().catch(console.error);
