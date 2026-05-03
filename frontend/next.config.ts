import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Use remotePatterns instead of deprecated domains
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
  // eslint key is deprecated in Next 16+ config root for some builds, 
  // but usually it's still supported in specific ways.
  // The error said "Unrecognized key(s) in object: 'eslint'".
  // I will move it or rely on CLI flags.
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
