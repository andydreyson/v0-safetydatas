import type { Document } from "@/app/page"

export async function exportToPDF(documents: Document[]) {
  // Sort documents alphabetically by compound name
  const sortedDocs = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

  const groupedDocs = sortedDocs.reduce(
    (acc, doc) => {
      const firstLetter = doc.compoundName[0].toUpperCase()
      if (!acc[firstLetter]) {
        acc[firstLetter] = []
      }
      acc[firstLetter].push(doc)
      return acc
    },
    {} as Record<string, Document[]>,
  )

  const letters = Object.keys(groupedDocs).sort()

  // Generate collection QR code
  const collectionQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `Collection: ${sortedDocs.length} compounds | Generated: ${new Date().toISOString()}`,
  )}`

  const indexContent = generateIndexContent(groupedDocs, letters, sortedDocs)

  // Create printable HTML document with index page + all data sheets
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Data Sheet Index</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .index-page { page-break-after: always; padding: 20px; }
        .index-title { text-align: center; font-size: 28px; margin-bottom: 10px; font-weight: bold; }
        .index-subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
        .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8f8f8; }
        .qr-section img { max-width: 250px; }
        .qr-label { font-size: 12px; color: #666; margin-top: 10px; }
        .index-content { margin-top: 30px; column-count: 2; column-gap: 30px; }
        .letter-section { break-inside: avoid; margin-bottom: 25px; }
        .letter-header { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #333; }
        .compound-list { list-style: none; padding: 0; margin: 0; }
        .compound-item { padding: 6px 0; display: flex; justify-content: space-between; border-bottom: 1px dotted #ddd; }
        .compound-name { font-weight: 500; }
        .page-number { color: #666; font-size: 14px; }
        .document-page { page-break-before: always; page-break-after: always; padding: 20px; }
        .doc-header { background: #f8f8f8; padding: 15px; margin-bottom: 20px; border-left: 4px solid #333; }
        .doc-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .doc-meta { font-size: 12px; color: #666; line-height: 1.8; }
        .doc-content { padding: 20px; border: 1px solid #e0e0e0; min-height: 400px; background: #fafafa; }
        .placeholder-text { color: #999; font-style: italic; text-align: center; padding: 60px 20px; }
      </style>
    </head>
    <body>
      <!-- INDEX PAGE -->
      <div class="index-page">
        <h1 class="index-title">Data Sheet Index</h1>
        <p class="index-subtitle">
          Generated on ${new Date().toLocaleDateString()} | Total Compounds: ${sortedDocs.length}
        </p>
        
        <!-- QR Code for the entire collection on index page -->
        <div class="qr-section">
          <img src="${collectionQRCode}" alt="Collection QR Code" />
          <p class="qr-label">Scan to access digital version of this index</p>
        </div>
        
        <!-- Alphabetical index grouped by letter -->
        <div class="index-content">
          ${indexContent}
        </div>
      </div>
      
      <!-- DATA SHEETS (Each starts on new page) -->
      ${sortedDocs
        .map(
          (doc, index) => `
        <div class="document-page">
          <div class="doc-header">
            <div class="doc-title">${doc.compoundName}</div>
            <div class="doc-meta">
              <strong>Filename:</strong> ${doc.name}<br>
              <strong>Page Number:</strong> ${index + 2}<br>
              <strong>Upload Date:</strong> ${new Date(doc.uploadDate).toLocaleString()}<br>
              <strong>File Type:</strong> ${doc.fileType}<br>
              <strong>Size:</strong> ${doc.size}
              ${doc.tags.length > 0 ? `<br><strong>Tags:</strong> ${doc.tags.join(", ")}` : ""}
            </div>
          </div>
          
          <div class="doc-content">
            <div class="placeholder-text">
              <p><strong>Data sheet content for ${doc.compoundName}</strong></p>
              <p style="margin-top: 20px;">The actual PDF/document content would be embedded here in production.</p>
              <p style="margin-top: 10px; font-size: 12px;">
                This placeholder represents where the uploaded data sheet (${doc.name}) would appear.
              </p>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </body>
    </html>
  `

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `datasheet-index-${new Date().toISOString().split("T")[0]}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  alert(
    "Index generated! Open the HTML file in your browser and use Print to PDF (Ctrl+P) to create the final document.",
  )
}

function generateIndexContent(groupedDocs: Record<string, Document[]>, letters: string[], allDocs: Document[]): string {
  return letters
    .map((letter) => {
      const compounds = groupedDocs[letter]
      const compoundsList = compounds
        .map((doc) => {
          const pageNum = allDocs.findIndex((d) => d.id === doc.id) + 2
          return `
          <li class="compound-item">
            <span class="compound-name">${doc.compoundName}</span>
            <span class="page-number">Page ${pageNum}</span>
          </li>
        `
        })
        .join("")

      return `
      <div class="letter-section">
        <div class="letter-header">${letter}</div>
        <ul class="compound-list">
          ${compoundsList}
        </ul>
      </div>
    `
    })
    .join("")
}

export function exportToCSV(documents: Document[]) {
  const headers = ["Compound Name", "Filename", "Upload Date", "Type", "Size", "Tags", "Page Number"]
  const sortedDocs = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

  const rows = sortedDocs.map((doc, index) => [
    doc.compoundName,
    doc.name,
    new Date(doc.uploadDate).toLocaleString(),
    doc.fileType,
    doc.size,
    doc.tags.join("; "),
    String(index + 2),
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  downloadFile(csvContent, "documents-index.csv", "text/csv")
}

export function exportToZip(documents: Document[]) {
  const sortedDocs = [...documents].sort((a, b) => a.compoundName.localeCompare(b.compoundName))

  const manifest = sortedDocs.map((doc, index) => ({
    compoundName: doc.compoundName,
    filename: doc.name,
    uploadDate: doc.uploadDate,
    fileType: doc.fileType,
    size: doc.size,
    tags: doc.tags,
    pageNumber: index + 2,
  }))

  const content = JSON.stringify(manifest, null, 2)
  downloadFile(content, "documents-manifest.json", "application/json")
  alert("ZIP export coming soon! Downloaded manifest file for now.")
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
