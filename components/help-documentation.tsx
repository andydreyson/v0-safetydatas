"use client"

import { X, Upload, FileText, Folders, Printer, QrCode, Search, Tag, Trash2, Edit, ArrowUpAZ, Copy, RefreshCw, Sparkles, Shield, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type HelpDocumentationProps = {
  onClose: () => void
}

export function HelpDocumentation({ onClose }: HelpDocumentationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl mx-4 my-8 bg-white rounded-3xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10" />
            <h1 className="text-4xl font-bold">SafetyDatas Help & Documentation</h1>
          </div>
          <p className="text-blue-100 text-lg">Complete guide to using SafetyDatas for managing chemical safety data sheets</p>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Getting Started */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              Getting Started
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
              <p className="text-gray-700 leading-relaxed">
                SafetyDatas helps you organize chemical safety data sheets in minutes. Upload your PDFs, and the system automatically extracts compound names from filenames and organizes them alphabetically. You can then create groups, generate print indexes with QR codes, and share with your team.
              </p>
            </div>
          </section>

          {/* 1. Uploading Documents */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-blue-600" />
              1. Uploading Documents
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">How to upload:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Click the <strong>"Upload Documents"</strong> button in the dashboard</li>
                  <li>Drag and drop PDF files, or click to browse</li>
                  <li>Select multiple files at once (supports batch upload)</li>
                  <li>System automatically extracts compound names from filenames</li>
                  <li>Duplicate detection runs automatically - you'll be notified if duplicates exist</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>💡 Tip:</strong> Name your PDF files clearly (e.g., "Sodium_Chloride.pdf", "Acetic_Acid.pdf") so the system can extract accurate compound names.
                </p>
              </div>
            </div>
          </section>

          {/* 2. How Files are Sorted */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowUpAZ className="h-6 w-6 text-blue-600" />
              2. Automatic Sorting & Organization
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Alphabetical Organization:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>All documents are automatically sorted <strong>alphabetically by compound name</strong></li>
                  <li>Each document is assigned a <strong>page number</strong> (starting from page 2)</li>
                  <li>Page 1 is reserved for the index cover page</li>
                  <li>Use the <strong>"Organize Alphabetically"</strong> button in the sidebar to manually re-sort if needed</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>💡 Tip:</strong> After uploading new files, the system automatically sorts all documents alphabetically and updates page numbers.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Document Management */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              3. Managing Documents
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">View & Edit:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Click on a document</strong> to view it in the document viewer</li>
                  <li><strong>Edit document name:</strong> Click the edit icon next to the document name</li>
                  <li><strong>Add tags:</strong> Select documents and use "Batch Tag" to add tags for organization</li>
                  <li><strong>Search:</strong> Use the search bar to filter by compound name or filename</li>
                  <li><strong>Filter by tags:</strong> Click on tags to filter documents</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">AI-Powered Rename:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Select PDF documents you want to rename</li>
                  <li>Click <strong>"Rename with AI"</strong> in the sidebar</li>
                  <li>System uses GPT-3.5 to extract compound names from PDF content</li>
                  <li>More accurate than filename-based extraction</li>
                </ul>
              </div>
              <div className="border-l-4 border-red-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Delete Documents:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Select one or more documents (checkboxes)</li>
                  <li>Click <strong>"Delete"</strong> in the sidebar</li>
                  <li>Confirm deletion - this action cannot be undone</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Working with Groups */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Folders className="h-6 w-6 text-blue-600" />
              4. Working with Groups
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Create a Group:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to the <strong>Documents</strong> view</li>
                  <li>Select documents you want to group (use checkboxes)</li>
                  <li>Click <strong>"Add to Group"</strong> in the sidebar</li>
                  <li>Choose "Create New Group" and give it a name and description</li>
                  <li>Selected documents are now in the group</li>
                </ol>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Add Documents to Existing Group:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Select documents</li>
                  <li>Click <strong>"Add to Group"</strong></li>
                  <li>Select one or more existing groups</li>
                  <li>Click "Assign" - documents are now in those groups</li>
                </ol>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Manage Groups:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to <strong>"My Groups"</strong> in the sidebar</li>
                  <li>Click on a group to view its documents</li>
                  <li><strong>Edit group:</strong> Click the edit icon to change name/description</li>
                  <li><strong>Remove document from group:</strong> Click the X next to the document</li>
                  <li><strong>Delete group:</strong> Click "Delete Group" (documents remain, only group is deleted)</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 5. QR Codes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <QrCode className="h-6 w-6 text-blue-600" />
              5. QR Codes & Sharing
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Collection QR Code (Print Index):</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to <strong>Documents</strong> view</li>
                  <li>Click <strong>"Print Index"</strong> in the sidebar</li>
                  <li>System generates a print-ready HTML file with:</li>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Cover page with SafetyDatas branding</li>
                    <li>QR code that links to the online collection</li>
                    <li>Alphabetical overview (A-Z with page ranges)</li>
                    <li>Detail pages for each letter</li>
                    <li>Document placeholder pages</li>
                  </ul>
                  <li>Open the HTML file in browser and print to PDF (Ctrl+P)</li>
                  <li>QR code is valid for <strong>90 days</strong></li>
                </ol>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Group QR Code:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to <strong>My Groups</strong></li>
                  <li>Click on a group to view it</li>
                  <li>Click <strong>"Generate QR Code"</strong></li>
                  <li>QR code opens in a new tab</li>
                  <li>Save or print the QR code</li>
                </ol>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>💡 Tip:</strong> QR codes allow anyone to view the collection online without needing an account. Perfect for sharing with team members or printing on binder labels.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Printing & Exporting */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Printer className="h-6 w-6 text-blue-600" />
              6. Printing & Exporting
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Print Index (A4 Format):</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Click <strong>"Print Index"</strong> in the sidebar (Documents view)</li>
                  <li>HTML file is generated and downloaded</li>
                  <li>Open the file in your browser</li>
                  <li>Press Ctrl+P (or Cmd+P on Mac) to print</li>
                  <li>Select "Save as PDF" as the printer</li>
                  <li>Print settings are optimized for:
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li><strong>A4 paper size</strong></li>
                      <li><strong>Ring binder friendly:</strong> 25mm left margin for hole punching</li>
                      <li>Black & white optimized for printing</li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="border-l-4 border-green-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Export Options:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>CSV Export:</strong> Exports document list as spreadsheet</li>
                  <li><strong>ZIP Export:</strong> Downloads all PDFs in a ZIP file (coming soon)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Alphabetical Index View */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="h-6 w-6 text-blue-600" />
              7. Alphabetical Index View
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">How to use:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to Documents view</li>
                  <li>Toggle <strong>"Index View"</strong> in the sidebar</li>
                  <li>See documents grouped by first letter (A, B, C, etc.)</li>
                  <li>Click on letter badges to quickly jump to that section</li>
                  <li>Each compound shows its name and page number</li>
                </ol>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>💡 Tip:</strong> Index view is great for quickly finding compounds and seeing how your printed index will look.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Advanced Features */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              8. Advanced Features
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Check for Duplicates:</h3>
                <p className="text-gray-700 mb-2">Finds documents with the same compound name and file size.</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Click <strong>"Check Duplicates"</strong> in sidebar</li>
                  <li>System scans all documents</li>
                  <li>Shows list of duplicates and asks if you want to delete them</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Synchronize Names:</h3>
                <p className="text-gray-700 mb-2">Syncs compound names with display names.</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Click <strong>"Sync Names"</strong> in sidebar</li>
                  <li>Updates compoundName field to match display name</li>
                  <li>Useful after manual name edits</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 py-2 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">View Modes:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Table View:</strong> Compact list with all details</li>
                  <li><strong>Gallery View:</strong> Card-based layout with previews</li>
                  <li><strong>Accordion View:</strong> Expandable rows</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 9. Dashboard Overview */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              9. Dashboard Overview
            </h2>
            <div className="space-y-4 ml-8">
              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">What you see:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Statistics:</strong> Total documents, active groups, recent uploads, warnings</li>
                  <li><strong>Quick Actions:</strong> Upload, View Index, Check Duplicates</li>
                  <li><strong>Recent Activity:</strong> Real-time log of all actions (uploads, edits, deletes, etc.)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips & Best Practices */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Tips & Best Practices
            </h2>
            <div className="space-y-3 ml-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Name PDF files clearly before uploading (e.g., "Compound_Name.pdf")</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Use groups to organize documents by project, department, or location</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Run duplicate checks periodically to keep database clean</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Use AI rename for PDFs with unclear filenames</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Print QR codes on binder labels for easy mobile access</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>✓</strong> Watch the Recent Activity log to track all changes</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-3xl border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Need more help? Check our FAQ or contact support.
            </p>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
