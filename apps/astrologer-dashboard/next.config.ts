import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // Speed up CI/builds by not failing on ESLint errors
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@repo/ui", "@repo/routes"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
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
