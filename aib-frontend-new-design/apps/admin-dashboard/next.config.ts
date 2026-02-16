import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ["@repo/ui", "@repo/routes"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"}/api/v1/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
