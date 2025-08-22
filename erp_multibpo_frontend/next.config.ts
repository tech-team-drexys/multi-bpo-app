/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora erros ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora erros TypeScript
  },
  experimental: {
    optimizeCss: false, // Desabilita otimização rigorosa de CSS
  },
  // Outras configurações...
}

module.exports = nextConfig