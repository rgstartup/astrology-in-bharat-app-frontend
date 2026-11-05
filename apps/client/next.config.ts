import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.29"],
  productionBrowserSourceMaps: false,
  transpilePackages: ["@repo/ui", "@repo/routes"],
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.jdmagicbox.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/shop/:path*",
        permanent: true,
      },
      {
        source: "/buy-products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/buy-products/:path*",
        destination: "/shop/:path*",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/shop/cart",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    const backendUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:6543";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`, // Proxy to Backend
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },

  devIndicators: {
    position: "bottom-left",
  },
};

export default withNextIntl(nextConfig);
