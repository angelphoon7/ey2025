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
  outputFileTracingRoot: '/Users/angelphoon/Documents/ey20255',
};

export default nextConfig;
