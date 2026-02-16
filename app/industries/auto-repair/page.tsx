import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Check, FileText, Shield, ArrowRight, Clock, QrCode, Wrench, AlertTriangle, Droplets, Paintbrush, Database, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Auto Repair Shop Chemical Compliance | SafetyDatas",
  description: "Simplify auto repair shop chemical compliance. Organize safety data sheets for brake fluid, degreasers, antifreeze & more. QR code access for your mechanics. $15/month.",
  keywords: "auto repair shop chemical compliance, mechanic shop safety data sheets, automotive SDS requirements, garage chemical organization",
}

export default function AutoRepairPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.svg" alt="SafetyDatas" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">SafetyDatas</span>
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
                <Wrench className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Built for Auto Shops</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Auto Repair Shop{" "}
                <span className="text-blue-600">Chemical Compliance</span>{" "}
                Made Simple
              </h1>

              <p className="text-lg text-gray-600">
                Stop digging through greasy binders. Upload your chemical docs, get them organized A-Z, 
                and give your mechanics instant QR code access.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Pass Inspections Easily</p>
                    <p className="text-sm text-gray-600">Clean, organized index ready to print</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">QR Code Access</p>
                    <p className="text-sm text-gray-600">Mechanics scan to find any sheet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Set Up in 10 Minutes</p>
                    <p className="text-sm text-gray-600">Upload once, organized forever</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Avoid Big Fines</p>
                    <p className="text-sm text-gray-600">Stay compliant, stay safe</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all">
                  Get Started — $15/month
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <p className="text-sm text-gray-500">Cancel anytime • No setup fees</p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-12 flex items-center justify-center">
              <div className="text-center">
                <Wrench className="h-24 w-24 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Auto Shop Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Auto Shops Struggle with Product Sheets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <AlertTriangle className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Paper Binder Problems</h3>
              <p className="text-gray-600">Grease, dirt, and oil destroy paper binders within weeks. Pages tear and get lost.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <Clock className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Inspection Panic</h3>
              <p className="text-gray-600">Inspector shows up unannounced. Frantic searching wastes time and looks unprofessional.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <Droplets className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Chemicals Everywhere</h3>
              <p className="text-gray-600">Brake fluid, degreasers, antifreeze — dozens of chemicals that all need tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chemicals List */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chemicals Auto Shops Must Track</h2>
            <p className="text-gray-600">Every chemical needs a current Safety Data Sheet</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Droplets, title: "Brake & Hydraulic Fluids", desc: "DOT 3, DOT 4, transmission fluids" },
              { icon: Database, title: "Engine Degreasers", desc: "Parts cleaners, carb cleaner, solvents" },
              { icon: Droplets, title: "Antifreeze & Coolants", desc: "Ethylene glycol, radiator flush" },
              { icon: Paintbrush, title: "Paints & Coatings", desc: "Touch-up paints, primers, undercoating" },
              { icon: Wrench, title: "Adhesives & Sealants", desc: "RTV silicone, threadlockers, epoxies" },
              { icon: FileText, title: "Everything Else", desc: "Welding gases, battery acid, lubricants" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <item.icon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all">
              Organize Your Chemicals Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-blue-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">From messy binders to organized compliance in 3 steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Upload Your Sheets</h3>
              <p className="text-gray-600">Scan or upload your PDFs. Takes about 5 minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">We Organize A-Z</h3>
              <p className="text-gray-600">Automatic sorting. No manual data entry.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Team Scans QR Code</h3>
              <p className="text-gray-600">Hang the poster. Mechanics scan to access instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Ditch the Paper Binders?</h2>
          <p className="text-xl mb-8 opacity-90">Join auto shops that simplified their chemical compliance. Pass inspections, protect your team.</p>
          
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-all">
            Get Started — $15/month
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="flex justify-center gap-8 mt-8 text-sm opacity-80">
            <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Cancel anytime</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4" /> No setup fees</span>
          </div>
        </div>
      </section>
    </div>
  )
}
