"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            <Mail className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-lg text-gray-600">Have questions? We'd love to hear from you.</p>
        </div>
      </header>

      {/* Contact Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

            {isSubmitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-700">
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                    Company <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Your company name"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="enterprise">Enterprise Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24-48 hours during business days.
                </p>
              </form>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            {/* Response Times */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Times</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Starter Plan</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Email Support:</strong> 24-48 hour response time during business days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">Professional Plan</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Priority Support:</strong> Within 12 hours, including weekends
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-6 border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-2">Enterprise Plan</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Dedicated Support:</strong> Direct contact with dedicated support team, same-day response
                  </p>
                </div>
              </div>
            </div>

            {/* Common Questions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Before You Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-4">
                  Many questions can be answered in our documentation:
                </p>
                <div className="space-y-3">
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Check our FAQ
                  </Link>
                  <Link
                    href="/documentation"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Read the Documentation
                  </Link>
                </div>
              </div>
            </div>

            {/* Sales Inquiries */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">Enterprise Sales</h2>
              <p className="mb-4 opacity-95">
                Looking for a custom solution for your organization? Contact our sales team for:
              </p>
              <ul className="space-y-2 text-sm opacity-95">
                <li>• Custom pricing for large teams</li>
                <li>• On-premise deployment options</li>
                <li>• Dedicated training and onboarding</li>
                <li>• Custom feature development</li>
              </ul>
              <p className="mt-4 text-sm opacity-90">
                Select "Enterprise Sales" in the subject dropdown above.
              </p>
            </div>
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
            <Link href="/documentation" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
