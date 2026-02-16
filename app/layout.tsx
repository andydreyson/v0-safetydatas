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
  title: 'SafetyDatas - Simple SDS Management for SMBs',
  description: 'Organize safety data sheets in minutes. Avoid OSHA fines. Upload your PDFs, get an A-Z index + QR code access. $15/mo. Perfect for auto shops, clinics & salons.',
  keywords: 'safety data sheet management, SDS organizer, OSHA compliance, chemical data sheets, stoffkartotek, sikkerhetsdatablad',
  generator: 'SafetyDatas.com',
  openGraph: {
    title: 'SafetyDatas - Simple SDS Management for Small Businesses',
    description: 'Organize safety data sheets in minutes. Upload PDFs, get A-Z index + QR codes. $15/mo.',
    url: 'https://safetydatas.com',
    siteName: 'SafetyDatas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafetyDatas - Simple SDS Management',
    description: 'Organize safety data sheets in minutes. $15/mo.',
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
