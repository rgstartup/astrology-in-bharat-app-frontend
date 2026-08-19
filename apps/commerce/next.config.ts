import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/styles"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    const backendUrl = BACKEND_URL
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/+$/, '');

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
