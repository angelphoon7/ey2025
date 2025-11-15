import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: [],
  // Fix for routesManifest.dataRoutes error
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Ensure proper static generation
  trailingSlash: false,
  // Set output file tracing root to fix lockfile warning
  outputFileTracingRoot: __dirname,
  // Disable webpack cache to reduce disk usage
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },
  // Disable ESLint during builds to reduce memory usage
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
