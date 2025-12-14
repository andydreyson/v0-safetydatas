import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-lg text-gray-600">Last updated: December 8, 2025</p>
        </div>
      </header>

      {/* Terms Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-gray-800 font-medium mb-2">Agreement to Terms</p>
            <p className="text-gray-700 text-sm">
              By accessing and using SafetyDatas, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </div>

          {/* 1. Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", or "your")
              and SafetyDatas ("we", "us", or "our") regarding your use of the SafetyDatas.com web application (the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, and agree
              to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You must meet the following requirements to use the Service:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You are at least 16 years of age (or legal age of majority in your jurisdiction)</li>
              <li>You have the legal capacity to enter into binding contracts</li>
              <li>You are not prohibited from using the Service under applicable laws</li>
              <li>You represent a legitimate business or organization (for commercial use)</li>
            </ul>
          </section>

          {/* 3. Account Registration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use the Service, you must create an account by providing accurate and complete information. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide truthful, accurate, and current information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Responsibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage
              arising from unauthorized use of your account.
            </p>
          </section>

          {/* 4. Service Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SafetyDatas provides a web-based platform for organizing, managing, and sharing safety data sheets (SDS). The Service includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Document upload and storage (PDF format)</li>
              <li>Automatic compound name extraction from filenames</li>
              <li>Alphabetical indexing and organization</li>
              <li>Print-ready export functionality</li>
              <li>QR code sharing (90-day expiration)</li>
              <li>Team collaboration features (Professional and Enterprise plans)</li>
            </ul>
          </section>

          {/* 5. Subscription and Payment */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Payment</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Subscription Plans</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We offer the following subscription tiers:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Starter:</strong> $15/month - Up to 100 data sheets</li>
              <li><strong>Professional:</strong> $45/month - Unlimited data sheets, team collaboration (10 users)</li>
              <li><strong>Enterprise:</strong> Custom pricing - Unlimited users, dedicated support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Free Trial</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              New users receive a 14-day free trial with full access to all plan features. No credit card is required for the trial.
              After the trial period, you must subscribe to continue using the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Billing</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              By subscribing to a paid plan, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pay all fees associated with your chosen plan</li>
              <li>Automatic monthly billing to your payment method</li>
              <li>Responsibility for all applicable taxes</li>
              <li>Price changes with 30 days advance notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.4 Cancellation and No Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may cancel your subscription at any time from your account settings. Upon cancellation:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You retain access until the end of your current billing period</li>
              <li>You will not be charged for future billing periods</li>
              <li><strong>No refunds:</strong> As a digital service with immediate access, all subscription fees are non-refundable</li>
              <li>Use the 14-day free trial to evaluate the service before subscribing</li>
              <li>Your data is preserved for 30 days after cancellation</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Exception:</strong> Refunds may be issued at our sole discretion in cases of technical errors, billing mistakes,
              or service unavailability caused by us.
            </p>
          </section>

          {/* 6. Acceptable Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree to use the Service only for lawful purposes. You must NOT:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Violate any intellectual property rights</li>
              <li>Attempt to hack, disrupt, or compromise the Service</li>
              <li>Use automated tools to scrape or extract data</li>
              <li>Share your account credentials with unauthorized persons</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Impersonate others or provide false information</li>
              <li>Use the Service for any unlawful or fraudulent activity</li>
            </ul>
          </section>

          {/* 7. User Content */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Content and Data</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.1 Your Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all ownership rights to the documents and data you upload ("User Content"). By uploading User Content,
              you grant us a limited license to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Store and process your files to provide the Service</li>
              <li>Display your content within the Service interface</li>
              <li>Generate exports and QR code shares as requested</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.2 Content Responsibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are solely responsible for the accuracy, legality, and appropriateness of your User Content. You represent that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You have the right to upload and share the content</li>
              <li>Your content does not violate any laws or third-party rights</li>
              <li>Your content does not contain confidential information you're not authorized to share</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.3 Content Backup</h3>
            <p className="text-gray-700 leading-relaxed">
              While we maintain backups, you are responsible for maintaining your own backups of important documents. We are
              not liable for any loss of User Content.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service, including all software, designs, logos, and content (excluding User Content), is owned by SafetyDatas
              and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not copy, modify, distribute, sell, or reverse engineer any part of the Service without our express written permission.
            </p>
          </section>

          {/* 9. Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.1 Termination by You</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time by canceling your subscription or deleting your account from settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.2 Termination by Us</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may suspend or terminate your access to the Service if:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You violate these Terms</li>
              <li>Your payment fails or account becomes delinquent</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>We are required to do so by law</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.3 Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your access to the Service will cease immediately. Your data will be deleted 30 days after
              termination unless required to be retained by law.
            </p>
          </section>

          {/* 10. Disclaimers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers and Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              WE DISCLAIM ALL WARRANTIES INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Uninterrupted, error-free, or secure operation</li>
              <li>Accuracy or reliability of content or results</li>
              <li>Compliance with safety regulations or legal requirements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Important:</strong> SafetyDatas is a document organization tool. We do not verify the accuracy, completeness,
              or compliance of safety data sheets. You are responsible for ensuring your documents meet all applicable safety
              and regulatory requirements.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAFETYDATAS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions or data breaches</li>
              <li>Reliance on inaccurate or incomplete safety information</li>
              <li>Workplace accidents or regulatory violations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless SafetyDatas from any claims, damages, losses, or expenses (including legal fees)
              arising from: (a) your use of the Service, (b) your User Content, (c) your violation of these Terms, or (d) your
              violation of any rights of third parties.
            </p>
          </section>

          {/* 13. Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. We will notify you of significant changes by email or through the Service.
              Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the European Union and the country where SafetyDatas is established.
              Any disputes shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          {/* 15. Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>SafetyDatas</strong></p>
              <p className="text-gray-700">Contact: <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 SafetyDatas.com. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/documentation" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
