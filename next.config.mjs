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
