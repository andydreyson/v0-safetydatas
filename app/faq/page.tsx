import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/landing" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Everything you need to know about SafetyDatas</p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* General Questions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">General Questions</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What is SafetyDatas?</h3>
                <p className="text-gray-700 leading-relaxed">
                  SafetyDatas is a simple web application that helps you organize your chemical safety data sheets (SDS/datablad).
                  Upload your PDF files, and we'll automatically organize them alphabetically, create printable indexes, and let you
                  share them with your team via QR codes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Who is SafetyDatas for?</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  SafetyDatas is designed for any workplace that handles chemicals and needs organized safety documentation. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Automotive workshops and repair shops</li>
                  <li>Manufacturing facilities</li>
                  <li>Cleaning service companies</li>
                  <li>Woodworking and carpentry shops</li>
                  <li>Paint and coating facilities</li>
                  <li>Industrial plants</li>
                  <li>Construction sites</li>
                  <li>Any company working with chemicals</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How much does it cost?</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We offer three pricing tiers:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Starter ($15/month):</strong> Up to 100 data sheets, all core features</li>
                  <li><strong>Professional ($45/month):</strong> Unlimited data sheets, team collaboration (10 users), priority support</li>
                  <li><strong>Enterprise (Custom):</strong> Unlimited users, dedicated support, custom deployment</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  All plans include a 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </section>

          {/* Features & Functionality */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">Features & Functionality</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How does compound name extraction work?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We extract compound names from your PDF filenames. For example, if you upload "Acetone_SDS.pdf", we'll extract "Acetone"
                  as the compound name. You can always manually edit or add names as needed. It's simple and straightforward.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What is the alphabetical indexing feature?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once you upload your data sheets, we automatically organize them alphabetically (A-Z) by compound name.
                  This makes it easy to find any specific chemical quickly. You can view the organized index online or export it for printing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How do QR code shares work?</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you export a print index, we generate a QR code that links to an online version of your collection.
                  Anyone can scan the QR code with their phone to view the data sheets instantly. Shared collections expire after 90 days for security.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What are the print-ready exports?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We generate professional A4-optimized layouts designed for printing and binder filing. The exports include a cover page
                  with alphabetical index, detail pages for each letter, and proper margins for hole-punching. Perfect for compliance and
                  physical documentation.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How many documents can I upload?</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Starter plan supports up to 100 data sheets. The Professional plan has unlimited storage.
                  Enterprise plans are customized to your needs.
                </p>
              </div>
            </div>
          </section>

          {/* Security & Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">Security & Privacy</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes. All data is encrypted in transit and at rest. We use bank-level encryption and are GDPR compliant.
                  QR code shares expire after 90 days. You maintain full control over your documents and can delete them anytime.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Where is my data stored?</h3>
                <p className="text-gray-700 leading-relaxed">
                  All data is stored on EU-based servers with ISO 27001 certification. We comply with GDPR and European data protection standards.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I delete my data?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes. You can delete individual documents or your entire account at any time. When you delete data, it is permanently removed
                  from our servers within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Questions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">Technical Questions</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I use this offline?</h3>
                <p className="text-gray-700 leading-relaxed">
                  The web app requires internet for uploading and sharing. However, exported print indexes are standalone HTML files
                  that work offline once downloaded.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats are supported?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Currently, we support PDF files. Most safety data sheets are provided in PDF format by manufacturers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you have an API?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Not at this time. We focus on providing a simple, easy-to-use web interface for managing your data sheets.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What browsers are supported?</h3>
                <p className="text-gray-700 leading-relaxed">
                  SafetyDatas works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version
                  for the best experience.
                </p>
              </div>
            </div>
          </section>

          {/* Billing & Account */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">Billing & Account</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How does the free trial work?</h3>
                <p className="text-gray-700 leading-relaxed">
                  You get 14 days of full access to try SafetyDatas. No credit card required. After the trial, you can choose to subscribe
                  or your account will simply become inactive (your data is preserved for 30 days).
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes. You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-700 leading-relaxed">
                  As a digital service, all sales are final. However, you can cancel your subscription at any time and you won't be
                  charged for future months. We encourage you to use the 14-day free trial to test the service before subscribing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes. Upgrades take effect immediately and you'll be charged the difference. Downgrades take effect at the start
                  of your next billing cycle (no partial refunds for current month).
                </p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">Support</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I get help?</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can reach us through our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
                  Starter plan users get email support (24-48 hour response time). Professional plan users get priority support
                  (within 12 hours). Enterprise customers get dedicated support.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer training?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Enterprise plans include onboarding and training sessions. For other plans, we provide comprehensive documentation
                  and video tutorials.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Get in touch with our team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 SafetyDatas.com. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/documentation" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
