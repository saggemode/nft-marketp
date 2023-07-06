/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['ipfs.infura.io', 'gateway.pinata.cloud']
    
  }
}

module.exports = nextConfig
