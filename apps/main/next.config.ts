import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/ui", "@repo/routes", "swiper"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Move turbo rules here and rename to turbopack
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000").replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "")}/api/v1/:path*`, // Proxy to Backend
      },
      {
        source: "/uploads/:path*",
        destination: `${(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000").replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "")}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

export default nextConfig;


