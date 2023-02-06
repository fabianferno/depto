/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
