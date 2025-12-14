import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/landing" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600">Last updated: December 8, 2025</p>
        </div>
      </header>

      {/* Privacy Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-gray-800 font-medium mb-2">Your Privacy Matters</p>
            <p className="text-gray-700 text-sm">
              SafetyDatas is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect,
              use, and safeguard your information in compliance with GDPR and European data protection laws.
            </p>
          </div>

          {/* 1. Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SafetyDatas ("we", "us", or "our") operates the SafetyDatas.com web application. This Privacy Policy informs you
              of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* 2. Data Controller */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Controller</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SafetyDatas is the data controller responsible for your personal data. For questions about this Privacy Policy
              or your personal data, please contact us through our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
            </p>
          </section>

          {/* 3. Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Personal Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              While using our Service, we may ask you to provide certain personally identifiable information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Email address</li>
              <li>Name and company name</li>
              <li>Billing information (for paid subscriptions)</li>
              <li>Contact preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Usage Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Device information</li>
              <li>Error logs and diagnostics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Document Data</h3>
            <p className="text-gray-700 leading-relaxed">
              We store the safety data sheets (PDF files) you upload to our Service. This may include chemical names,
              manufacturer information, and safety instructions. We do not read or analyze the content of your documents
              except as necessary to provide the Service (e.g., extracting compound names from filenames).
            </p>
          </section>

          {/* 4. How We Use Your Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Data</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>To provide and maintain our Service</li>
              <li>To process your documents and create alphabetical indexes</li>
              <li>To manage your account and subscriptions</li>
              <li>To process payments and send invoices</li>
              <li>To send you service updates and support communications</li>
              <li>To improve our Service and user experience</li>
              <li>To detect and prevent technical issues or security threats</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* 5. Legal Basis for Processing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We process your personal data based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Contractual Necessity:</strong> To fulfill our contract with you and provide the Service</li>
              <li><strong>Legitimate Interest:</strong> To improve our Service, prevent fraud, and ensure security</li>
              <li><strong>Consent:</strong> For marketing communications (you can withdraw consent at any time)</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          {/* 6. Data Storage and Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Storage and Security</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.1 Data Storage</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your data is stored on secure servers located in the European Union. We use Vercel for hosting and Upstash
              (Redis) for data storage. All data remains within EU jurisdictions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Security Measures</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest for all stored data</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Automatic expiration of shared collections (90 days)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data only as long as necessary to provide the Service and comply with legal obligations.
              Active accounts: data is retained while your subscription is active. Canceled accounts: data is retained for 30 days
              before permanent deletion. Shared collections: automatically deleted after 90 days.
            </p>
          </section>

          {/* 7. Data Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Sharing and Third Parties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell or rent your personal data to third parties. We may share your data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Vercel (hosting), Upstash (database) - all EU-based or GDPR-compliant</li>
              <li><strong>Payment Processors:</strong> For handling subscription payments (they have their own privacy policies)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All third-party providers are contractually obligated to protect your data and comply with GDPR.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Under GDPR, you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us through our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
              We will respond within 30 days.
            </p>
          </section>

          {/* 9. Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use essential cookies to provide the Service (e.g., session management, authentication). We do not use
              third-party advertising or tracking cookies.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. Disabling essential cookies may limit Service functionality.
            </p>
          </section>

          {/* 10. International Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is stored and processed within the European Union. If data is transferred outside the EU, we ensure
              appropriate safeguards are in place (e.g., Standard Contractual Clauses, adequacy decisions).
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for children under 16 years of age. We do not knowingly collect personal data from
              children. If you believe a child has provided us with personal data, please contact us.
            </p>
          </section>

          {/* 12. Changes to Privacy Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or
              through a notice on our Service. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 13. Contact Us */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>SafetyDatas</strong></p>
              <p className="text-gray-700 mb-2">Email: <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link></p>
              <p className="text-gray-700">Response time: Within 30 days (GDPR requirement)</p>
            </div>
          </section>

          {/* 14. Supervisory Authority */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Supervisory Authority</h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to lodge a complaint with your local data protection supervisory authority if you believe
              we have not complied with GDPR or your local data protection laws.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 SafetyDatas.com. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/documentation" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
