/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['static-cdn.jtvnw.net'],
    loader: 'custom',
  },
}

module.exports = nextConfig
