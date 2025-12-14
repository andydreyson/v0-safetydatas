import Link from "next/link"
import { ArrowLeft, Upload, FileText, Download, QrCode, Search, Printer, Share2 } from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/landing" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Documentation</h1>
          <p className="text-lg text-gray-600">Learn how to use SafetyDatas to organize your safety data sheets</p>
        </div>
      </header>

      {/* Documentation Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
          <p className="text-lg text-gray-700 mb-8">
            Get up and running with SafetyDatas in just a few minutes. Follow these simple steps to organize your safety data sheets.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Documents</h3>
              <p className="text-gray-700">
                Upload your PDF safety data sheets. We'll extract compound names from filenames automatically.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Organize</h3>
              <p className="text-gray-700">
                Check the automatically organized A-Z index. Edit compound names if needed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export & Share</h3>
              <p className="text-gray-700">
                Generate print indexes with QR codes and share with your team instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Features Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Feature Guides</h2>

          {/* Upload Documents */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Uploading Documents</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">How to Upload:</h4>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-2">
                <li>Click the "Upload Documents" or "Add New Document" button</li>
                <li>Select one or more PDF files from your computer</li>
                <li>Wait for the upload to complete (you'll see a progress indicator)</li>
                <li>The compound name will be automatically extracted from the filename</li>
              </ol>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">💡 Pro Tip:</p>
              <p className="text-sm text-gray-700">
                Name your files with the chemical name first (e.g., "Acetone_SDS.pdf", "Ethanol_SafetySheet.pdf") for best results with automatic name extraction.
              </p>
            </div>
          </div>

          {/* Document Management */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Managing Documents</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">What You Can Do:</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong>Edit Compound Names:</strong> Click on any compound name to edit it manually
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong>Add Tags:</strong> Organize documents with custom tags (e.g., "Flammable", "Corrosive")
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong>Search:</strong> Use the search bar to find specific compounds quickly
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <div>
                    <strong>Delete:</strong> Remove documents you no longer need
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Alphabetical Index */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Alphabetical Index</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                The alphabetical index automatically organizes all your compounds from A-Z. This makes finding specific
                safety data sheets quick and easy.
              </p>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Automatic alphabetical sorting by compound name</li>
                <li>Letter navigation (jump to A, B, C, etc.)</li>
                <li>Visual grouping by first letter</li>
                <li>Quick search within the index</li>
                <li>View document details by clicking on any compound</li>
              </ul>
            </div>
          </div>

          {/* Print Export */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Printer className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Print Index Export</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">How to Export for Printing:</h4>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-2">
                <li>Click the "Export" button in the top menu</li>
                <li>Select "Print Index" from the dropdown</li>
                <li>A new browser tab will open with the print-ready layout</li>
                <li>Use your browser's print function (Ctrl+P or Cmd+P)</li>
                <li>Select "Save as PDF" or print directly to paper</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's Included in the Print Index:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Cover Page:</strong> Title and alphabetical overview showing which letters have compounds</li>
                <li><strong>QR Code:</strong> Scan to access the digital version online (expires after 90 days)</li>
                <li><strong>Detail Pages:</strong> One page per letter listing all compounds in that group</li>
                <li><strong>A4 Optimized:</strong> Perfect margins for hole-punching and binder filing (25mm left margin)</li>
              </ul>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg mt-4">
              <p className="text-sm font-medium text-gray-900 mb-1">📄 Print Tip:</p>
              <p className="text-sm text-gray-700">
                For best results, print in portrait orientation on A4 paper. The extra left margin allows for hole-punching
                without covering text.
              </p>
            </div>
          </div>

          {/* QR Code Sharing */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">QR Code Sharing</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-gray-700 mb-4">
                When you export a print index, we automatically generate a QR code that links to an online version of your collection.
              </p>

              <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-2">
                <li>Export a print index (QR code is generated automatically)</li>
                <li>The QR code appears on the cover page of your print index</li>
                <li>Anyone can scan the code with their smartphone camera</li>
                <li>They'll be taken to a web page showing your organized collection</li>
                <li>The shared link expires after 90 days for security</li>
              </ol>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">🔒 Privacy Note:</p>
              <p className="text-sm text-gray-700">
                Shared collections are publicly accessible via the QR code link but automatically expire after 90 days. Only people
                with the link can access the collection.
              </p>
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Team Collaboration</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                <em>(Available on Professional and Enterprise plans)</em>
              </p>

              <p className="text-gray-700 mb-4">
                Share your SafetyDatas account with team members so everyone can access and manage data sheets together.
              </p>

              <h4 className="font-semibold text-gray-900 mb-3">Team Features:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Invite team members via email (Professional: up to 10 users)</li>
                <li>Everyone sees the same organized collection</li>
                <li>Real-time updates when documents are added or edited</li>
                <li>Manage team member permissions from account settings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips & Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Tips & Best Practices</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">📂 File Naming Convention</h3>
              <p className="text-gray-700 text-sm">
                Name files as "ChemicalName_SDS.pdf" for best automatic extraction. Example: "Acetone_SDS.pdf", "Sodium_Hydroxide_SDS.pdf"
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-3">🏷️ Use Tags Wisely</h3>
              <p className="text-gray-700 text-sm">
                Tag documents by hazard class (Flammable, Toxic, Corrosive) or usage (Cleaning, Production, Maintenance) for easier filtering.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">🔄 Keep It Updated</h3>
              <p className="text-gray-700 text-sm">
                Replace outdated safety data sheets when manufacturers issue new versions. Always use the most current information.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-6 border border-orange-200">
              <h3 className="font-bold text-gray-900 mb-3">🖨️ Print Regularly</h3>
              <p className="text-gray-700 text-sm">
                Print updated indexes monthly or quarterly to keep physical binders current. Post QR codes in work areas for quick mobile access.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Troubleshooting</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2">Upload Failed?</h3>
              <p className="text-gray-700 text-sm">
                Make sure your file is in PDF format and under 25MB. Check your internet connection and try again.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2">Compound Name Not Extracted?</h3>
              <p className="text-gray-700 text-sm">
                Click on the document and manually edit the compound name. Our extraction works best with files named "ChemicalName_SDS.pdf"
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2">Print Layout Looks Wrong?</h3>
              <p className="text-gray-700 text-sm">
                Make sure you're using portrait orientation and A4 paper size in your print settings. Disable any browser scaling.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2">QR Code Not Working?</h3>
              <p className="text-gray-700 text-sm">
                Shared collections expire after 90 days. If the QR code doesn't work, export a new print index to generate a fresh link.
              </p>
            </div>
          </div>
        </section>

        {/* Need More Help */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need More Help?</h2>
          <p className="mb-6 opacity-95">
            Can't find what you're looking for? Check our FAQ or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 SafetyDatas.com. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
