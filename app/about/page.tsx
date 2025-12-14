import Link from "next/link"
import { ArrowLeft, Shield, Target, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/landing" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">About SafetyDatas</h1>
          </div>
          <p className="text-lg text-gray-600">Simple safety data sheet organization for everyone</p>
        </div>
      </header>

      {/* About Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Mission Statement */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              To make safety data sheet organization simple, accessible, and efficient for every workplace that handles chemicals -
              from small workshops to large industrial facilities.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              SafetyDatas was born from a simple observation: too many companies waste hours every week manually organizing
              their chemical safety documentation. Whether it's an automotive workshop with 50 chemicals or a manufacturing
              facility with hundreds, the process was the same - tedious manual sorting through binders.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We built SafetyDatas to solve this problem. Not with complex features or over-engineering, but with a focused,
              simple solution: upload your PDFs, we organize them alphabetically, and you can export professional print indexes
              or share them with your team via QR codes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, SafetyDatas helps workplaces across multiple industries - from car repair shops to industrial plants,
              cleaning services to engineering firms - organize their safety documentation in minutes instead of hours.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Our Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Simplicity */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border-2 border-blue-200">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simplicity</h3>
              <p className="text-gray-700">
                We focus on doing one thing well: organizing safety data sheets. No bloated features, no complicated interfaces.
                Just simple, effective tools.
              </p>
            </div>

            {/* Honesty */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 border-2 border-purple-200">
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Honesty</h3>
              <p className="text-gray-700">
                We're transparent about what our tool does and doesn't do. We don't claim to have features we haven't built.
                We focus on delivering what we promise.
              </p>
            </div>

            {/* Accessibility */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border-2 border-green-200">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-700">
                Safety documentation shouldn't be complicated or expensive. We make our tools accessible to small workshops
                and large facilities alike.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">Who We Serve</h2>

          <div className="bg-gray-50 rounded-xl p-8">
            <p className="text-lg text-gray-700 mb-6">
              SafetyDatas is used by a wide range of workplaces that handle chemicals:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Industries We Support:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Automotive Workshops & Repair Shops
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Manufacturing & Production Facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Professional Cleaning Services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Woodworking & Carpentry
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Paint & Coating Facilities
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">And More:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Construction Sites
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Chemical Processing Plants
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Industrial Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Laboratories & Research Facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Any Workplace Handling Chemicals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-3 border-b-2 border-blue-600">What Makes Us Different</h2>

          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Focus on One Problem</h3>
              <p className="text-gray-700">
                We don't try to be an all-in-one safety management platform. We focus exclusively on organizing safety data sheets,
                and we do it well.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Simple, Not Simplistic</h3>
              <p className="text-gray-700">
                Our interface is easy to use, but we include professional features like print-optimized layouts with proper
                margins for binder filing and QR code sharing for team access.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Affordable for Everyone</h3>
              <p className="text-gray-700">
                Starting at just $15/month, SafetyDatas is accessible to small workshops and large facilities alike.
                No enterprise-only pricing that locks out smaller businesses.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. European Data Standards</h3>
              <p className="text-gray-700">
                All data is stored on EU-based servers with GDPR compliance and ISO 27001 certification. Your data stays
                in Europe and is protected by strict European data protection laws.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Safety Documentation?</h2>
            <p className="text-xl opacity-95 mb-8 max-w-2xl mx-auto">
              Join workplaces across multiple industries who have switched from manual organization to SafetyDatas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg text-lg font-bold hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
            <p className="text-sm opacity-90 mt-6">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 SafetyDatas.com. All rights reserved.</p>
          <div className="mt-3 space-x-4">
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/documentation" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
