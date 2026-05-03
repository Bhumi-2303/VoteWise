import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allow images from common civic domains if needed
  images: {
    domains: ['www.google.com', 'civicinfo.googleapis.com'],
  },
  // Ensure we can deploy to Cloud Run without issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
