"use client"

import Link from "next/link"
import Image from "next/image"
import { Check, FileText, Shield, Search, Download, ChevronRight, Users, Zap, Lock, TrendingUp, Star, ArrowRight, Clock, Database, QrCode, Printer } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Sticky */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">SafetyDatas</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">FAQs</a>
            </div>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">No more messy paper binders</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Organize Your Chemical Papers in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10 Minutes</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Got a shelf full of messy product sheets? Dump them all here. 
                We'll sort them A-Z and give you a QR code so your team can find any sheet instantly.
              </p>

              {/* Value Props - Simple Language */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-green-100 rounded">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Find Any Sheet in 2 Seconds</p>
                    <p className="text-sm text-gray-600">Scan the QR code, get what you need</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-blue-100 rounded">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Save Hours Every Month</p>
                    <p className="text-sm text-gray-600">No more digging through folders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-purple-100 rounded">
                    <Printer className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ready for Inspections</p>
                    <p className="text-sm text-gray-600">Print a clean index in one click</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-amber-100 rounded">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Avoid Big Government Fines</p>
                    <p className="text-sm text-gray-600">Stay organized, stay safe</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105"
                >
                  Start Free Trial — No Card Required
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  See How It Works
                </a>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Cancel anytime
                </span>
              </p>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/industries/factory-workers-working-with-adept-robotic-arm-workshop.webp"
                  alt="Manufacturing facility - modern industrial workplace"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto object-cover"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Perfect for auto shops, clinics & salons</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Key Features</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mt-3">
              Simple Tools to Organize Your Data Sheets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to keep your chemical documentation organized and accessible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Extraction</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically extract compound names from your PDF filenames. Manual editing available when needed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Alphabetical Indexing</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatic A-Z organization with visual navigation. Find any compound quickly and easily.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Printer className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Print-Ready Layouts</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional A4-optimized designs with perfect margins for binder filing and compliance
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Sharing</h3>
              <p className="text-gray-600 leading-relaxed">
                Share collections with your team via QR codes. Everyone gets instant access to the same data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Professionals Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Real Workplaces</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mt-3">
              Trusted by Professionals Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From automotive workshops to manufacturing facilities, cleaning services to industrial plants -
              any workplace that handles chemicals needs organized safety data
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/medium-shot-man-checking-car.webp"
                alt="Automotive workshop - mechanic checking vehicle"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Automotive Workshops</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/professional-cleaner-wearing-protection-uniform-cleaning-floor-production-plant.webp"
                alt="Professional cleaning services - safety compliance"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Cleaning Services</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/industrial-workers-cooperating-while-doing-quality-control-manufactured-products-factory.webp"
                alt="Manufacturing facility - industrial workers cooperating on quality control"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Manufacturing</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/caucasian-technician-engineer-man-uniform-with-tablet-checking-control-boiler-tanks-liquid-pipeline-chemical-factory-production-line.webp"
                alt="Chemical industry - process monitoring"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Chemical Industry</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/happy-mid-adult-carpenter-working-his-workshop.webp"
                alt="Woodworking workshop - carpenter using chemicals for finishing"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Woodworking</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/man-spraying-powder-paint-from-gun-full-shot.webp"
                alt="Paint and coating industry - workplace safety"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Paint & Coating</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/mature-man-examining-factory.webp"
                alt="Factory inspection - quality and safety"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Industrial Plants</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="/images/industries/view-male-engineer-work-engineers-day-celebration.webp"
                alt="Engineering work - technical safety management"
                width={800}
                height={533}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Engineering</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-6">
              <span className="font-semibold">No matter your industry</span> - if you work with chemicals,
              you need organized safety documentation
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all"
            >
              Start Organizing Today
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From upload to organized index in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload PDFs</h3>
              <p className="text-gray-600">
                Drag and drop your safety data sheets or upload multiple files at once
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic Organization</h3>
              <p className="text-gray-600">
                We extract compound names and sort everything alphabetically - no manual work needed
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Export & Share</h3>
              <p className="text-gray-600">
                Generate print indexes with QR codes and share with your team instantly
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mt-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start organizing today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600">Perfect for small teams and laboratories</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$15</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 100 data sheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Automatic name extraction</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Alphabetical indexing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Print-ready exports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">QR code sharing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl border-2 border-blue-600 p-8 shadow-2xl transform scale-105 hover:scale-110 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-blue-100">For growing teams and companies</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$45</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <p className="text-sm text-blue-200 mt-2">Billed monthly</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Unlimited data sheets</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Everything in Starter, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Team collaboration (up to 10 users)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Custom branding on exports</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600">For large organizations with advanced needs</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Contact us for pricing</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Everything in Professional, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom deployment options</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Training & onboarding</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Contact Sales
              </a>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600 mb-6">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-2 text-gray-700">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="font-medium">Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">GDPR compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="font-medium">Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SafetyDatas?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for any company that works with chemical data sheets
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Benefit 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Hours Every Week</h3>
                <p className="text-gray-600">
                  No more manual sorting through binders. Organize your entire data sheet portfolio
                  in minutes instead of hours.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Print Layouts</h3>
                <p className="text-gray-600">
                  A4-optimized designs with perfect margins for binder filing. Ready to print
                  and use immediately in your safety documentation.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">
                  Share your organized collections with team members via QR codes. Everyone
                  gets instant access to the same up-to-date information.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Up to Date</h3>
                <p className="text-gray-600">
                  Cloud-based system means your indexes stay synchronized. Add new sheets
                  and instantly regenerate updated indexes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mt-3">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how teams are saving time with SafetyDatas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "We used to spend hours organizing our data sheets. Now it takes minutes.
                The whole team can find what they need instantly."
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  LB
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Lars Berg</p>
                  <p className="text-sm text-gray-600">Safety Coordinator</p>
                  <p className="text-xs text-gray-500">Manufacturing Facility</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Before:</span> Hours of manual sorting every week</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold text-gray-900">After:</span> Organized in minutes, accessible by all</p>
                <p className="text-sm font-semibold text-green-600 mt-2">Time saved: Significant</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "The print layouts are perfect for our binders. QR codes mean the team can
                access digital versions anytime. Simple and effective."
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  KJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Kari Johansen</p>
                  <p className="text-sm text-gray-600">Operations Manager</p>
                  <p className="text-xs text-gray-500">Industrial Company</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Before:</span> Messy binders, hard to share</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold text-gray-900">After:</span> Professional prints + digital access</p>
                <p className="text-sm font-semibold text-green-600 mt-2">Result: Better organization</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "We have over 80 different chemicals. The alphabetical index makes finding
                specific data sheets instant. So much better than our old system."
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  TN
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Thomas Nielsen</p>
                  <p className="text-sm text-gray-600">Workshop Supervisor</p>
                  <p className="text-xs text-gray-500">Automotive Workshop</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Before:</span> Searching through messy files</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold text-gray-900">After:</span> Find any sheet in seconds</p>
                <p className="text-sm font-semibold text-green-600 mt-2">Result: Much easier access</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Minutes</div>
              <p className="text-gray-600">Not hours to organize</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Simple</div>
              <p className="text-gray-600">Upload, organize, share</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Team Access</div>
              <p className="text-gray-600">Everyone on same page</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does compound name extraction work?
              </h3>
              <p className="text-gray-600">
                We extract compound names from your PDF filenames. You can always manually
                edit or add names as needed. It's simple and straightforward.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes. All data is encrypted and stored securely. QR code shares expire after
                90 days. You maintain full control over your documents and can delete them
                anytime.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use this offline?
              </h3>
              <p className="text-gray-600">
                The web app requires internet for AI processing and sharing. However, exported
                print indexes are standalone HTML files that work offline.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How many documents can I upload?
              </h3>
              <p className="text-gray-600">
                The Starter plan supports up to 100 data sheets. Professional plan has unlimited
                storage. Perfect for teams of any size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 text-white px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/industries/construction-engineers-with-hard-hats-bg.webp"
            alt="Construction engineers with safety equipment"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-purple-900/90"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Start organizing in minutes</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to Organize Your Data Sheets?
          </h2>
          <p className="text-xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time searching through binders. Get your chemical data sheets
            organized and accessible to your whole team in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl text-lg font-bold hover:bg-white/10 transition-all"
            >
              View Pricing
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-center text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span>Simple pricing - $15/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span>Instant setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SafetyDatas</span>
              </div>
              <p className="text-sm leading-relaxed">
                Simple data sheet organization for any company that works with chemicals.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">&copy; 2025 SafetyDatas.com. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                GDPR Compliant
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                ISO 27001
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                EU-Based Servers
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
