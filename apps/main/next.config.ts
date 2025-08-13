import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable image optimization temporarily
  images: {
    unoptimized: true,
  },
  // transpilePackages: ["@repo/ui"],
};

export default nextConfig;
