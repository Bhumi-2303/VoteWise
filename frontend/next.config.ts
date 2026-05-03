import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'civicinfo.googleapis.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
