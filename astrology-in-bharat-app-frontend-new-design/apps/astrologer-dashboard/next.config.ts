import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // Speed up CI/builds by not failing on ESLint errors
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@repo/ui", "@repo/routes"],
};

export default nextConfig;
