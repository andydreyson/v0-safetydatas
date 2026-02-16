import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SafetyDatas - Organize Your Chemical Product Sheets',
  description: 'Got messy chemical product sheets? Upload them all, get them organized A-Z, and share with your team via QR code. Perfect for auto shops, clinics, salons & more.',
  keywords: 'chemical product sheets, safety data sheets, organize product information, QR code for chemical sheets, small business chemical records',
  generator: 'SafetyDatas.com',
  openGraph: {
    title: 'SafetyDatas - Organize Your Chemical Product Sheets',
    description: 'Upload your messy product sheets. Get them organized A-Z with QR code access.',
    url: 'https://safetydatas.com',
    siteName: 'SafetyDatas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafetyDatas - Organize Your Chemical Product Sheets',
    description: 'Upload your product sheets. Get them organized A-Z with QR code access.',
  },
  alternates: {
    canonical: 'https://safetydatas.com',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#FAFAFA]`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
