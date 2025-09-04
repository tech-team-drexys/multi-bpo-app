import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  eslint: {
    // Ignora erros de ESLint durante build em produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
