/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: nginx on Cloud Run serves out/, and the models run in the visitor's browser.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
}

export default nextConfig
