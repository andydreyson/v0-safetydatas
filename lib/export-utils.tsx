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

  // Share collection and get unique URL
  let shareUrl = ""
  let collectionQRCode = ""

  try {
    const response = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: sortedDocs }),
    })

    if (response.ok) {
      const data = await response.json()
      shareUrl = data.url

      // Generate QR code with the share URL
      collectionQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`
    } else {
      // Fallback QR code with collection info
      collectionQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `Collection: ${sortedDocs.length} compounds | Generated: ${new Date().toISOString()}`,
      )}`
    }
  } catch (error) {
    console.error("Failed to share collection:", error)
    // Fallback QR code
    collectionQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      `Collection: ${sortedDocs.length} compounds | Generated: ${new Date().toISOString()}`,
    )}`
  }

  const indexContent = generateIndexContent(groupedDocs, letters, sortedDocs)

  // Generate cover page content with QR code
  const coverPageContent = generateCoverPage(letters, groupedDocs, sortedDocs, collectionQRCode, shareUrl)

  // Create printable HTML document with index page + all data sheets
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Safety Data Sheets - Alphabetical Index</title>
      <style>
        @page {
          size: A4;
          margin: 20mm 15mm 20mm 25mm; /* Top, Right, Bottom, Left (extra left for binding) */
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.5;
          color: #000;
          background: white;
        }

        /* COVER PAGE */
        .cover-page {
          page-break-after: always;
          padding: 40mm 20mm;
        }
        .cover-header {
          text-align: center;
          border: 3px solid #000;
          padding: 40px 20px;
          margin-bottom: 50px;
        }
        .cover-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .cover-subtitle {
          font-size: 18px;
          margin-bottom: 20px;
          color: #333;
        }
        .cover-meta {
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 15px;
          margin-top: 15px;
        }
        .cover-meta p {
          margin: 5px 0;
        }
        .letter-overview {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 15px;
          margin-top: 40px;
        }
        .letter-card {
          border: 2px solid #000;
          padding: 20px 10px;
          text-align: center;
        }
        .letter-big {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .letter-count {
          font-size: 11px;
          margin-bottom: 3px;
        }
        .letter-pages {
          font-size: 10px;
          color: #666;
        }

        /* DETAIL INDEX PAGES */
        .index-page {
          page-break-after: always;
        }
        .index-letter-header {
          border-bottom: 3px solid #000;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .index-letter-big {
          font-size: 48px;
          font-weight: bold;
          float: left;
          margin-right: 20px;
          line-height: 1;
        }
        .index-letter-info {
          padding-top: 5px;
        }
        .index-letter-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .index-letter-subtitle {
          font-size: 12px;
          color: #666;
        }
        .compound-list {
          list-style: none;
          margin-top: 20px;
        }
        .compound-item {
          border-bottom: 1px solid #ddd;
          padding: 12px 0;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .compound-item:last-child {
          border-bottom: none;
        }
        .compound-name-main {
          font-size: 14px;
          font-weight: bold;
        }
        .compound-filename {
          font-size: 11px;
          color: #666;
          margin-left: 10px;
        }
        .compound-page {
          font-weight: bold;
          white-space: nowrap;
          margin-left: 20px;
        }

        /* DOCUMENT PAGES */
        .document-page {
          page-break-before: always;
        }
        .doc-header {
          border: 2px solid #000;
          padding: 20px;
          margin-bottom: 25px;
        }
        .doc-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .doc-meta {
          font-size: 11px;
          line-height: 1.7;
          color: #333;
        }
        .doc-content {
          border: 1px solid #ccc;
          padding: 20px;
          min-height: 600px;
          background: #fafafa;
        }
        .placeholder-text {
          color: #666;
          text-align: center;
          padding: 60px 20px;
          font-size: 12px;
        }

        /* Print optimizations */
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <!-- COVER PAGE -->
      ${coverPageContent}

      <!-- DETAILED INDEX PAGES (One page per letter) -->
      ${letters.map(letter => {
        const compounds = groupedDocs[letter]
        const firstCompoundPage = sortedDocs.findIndex(d => d.id === compounds[0].id) + 2
        return `
          <div class="index-page">
            <div class="index-letter-header">
              <div class="index-letter-big">${letter}</div>
              <div class="index-letter-info">
                <div class="index-letter-title">Section ${letter}</div>
                <div class="index-letter-subtitle">${compounds.length} compound${compounds.length !== 1 ? 's' : ''} • Pages ${firstCompoundPage}-${firstCompoundPage + compounds.length - 1}</div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <ul class="compound-list">
              ${compounds.map(doc => {
                const pageNum = sortedDocs.findIndex(d => d.id === doc.id) + 2
                return `
                  <li class="compound-item">
                    <div>
                      <span class="compound-name-main">${doc.compoundName}</span>
                      <span class="compound-filename">(${doc.originalName.length > 40 ? doc.originalName.substring(0, 40) + '...' : doc.originalName})</span>
                    </div>
                    <span class="compound-page">Page ${pageNum}</span>
                  </li>
                `
              }).join('')}
            </ul>
          </div>
        `
      }).join('')}
      
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

function generateCoverPage(
  letters: string[],
  groupedDocs: Record<string, Document[]>,
  allDocs: Document[],
  qrCodeUrl: string,
  shareUrl: string
): string {
  return `
    <div class="cover-page">
      <div class="cover-header">
        <h1 class="cover-title">Safety Data Sheets</h1>
        <p class="cover-subtitle">Alphabetical Index &amp; Collection</p>
        <div class="cover-meta">
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Total Compounds:</strong> ${allDocs.length}</p>
          <p><strong>Sections:</strong> ${letters.join(', ')}</p>
        </div>
      </div>

      ${shareUrl ? `
      <div style="text-align: center; margin: 30px 0; padding: 20px; border: 2px solid #000;">
        <div style="margin-bottom: 15px;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#2563eb"/>
          </svg>
          <h2 style="font-size: 24px; font-weight: bold; margin: 10px 0 5px 0; color: #000;">SafetyDatas</h2>
          <p style="font-size: 11px; color: #666; margin-bottom: 15px;">Chemical Safety Data Sheets</p>
        </div>
        <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; margin-bottom: 10px;" />
        <p style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">Scan to view online</p>
        <p style="font-size: 10px; color: #666; word-break: break-all;">${shareUrl}</p>
        <p style="font-size: 9px; color: #999; margin-top: 5px;">Link expires in 90 days</p>
      </div>
      ` : ''}

      <div class="letter-overview">
        ${letters.map(letter => {
          const compounds = groupedDocs[letter]
          const firstPage = allDocs.findIndex(d => d.id === compounds[0].id) + 2
          const lastPage = firstPage + compounds.length - 1

          return `
            <div class="letter-card">
              <div class="letter-big">${letter}</div>
              <div class="letter-count">${compounds.length} compound${compounds.length !== 1 ? 's' : ''}</div>
              <div class="letter-pages">Pages ${firstPage}-${lastPage}</div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
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
