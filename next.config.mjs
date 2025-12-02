/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for pdf-parse and tesseract.js with Turbopack
  serverExternalPackages: ['pdf-parse', 'tesseract.js'],
}

export default nextConfig
