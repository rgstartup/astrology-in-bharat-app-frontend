import type { NextConfig } from "next";

// ─── Security Headers ──────────────────────────────────────────────────────────
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://content.jdmagicbox.com",
      `connect-src 'self' https://api.prokerala.com https://checkout.razorpay.com https://*.twilio.com wss: ws: wss://*.twilio.com https://astrology-in-bharat-services.onrender.com wss://astrology-in-bharat-services.onrender.com http://localhost:6543 http://127.0.0.1:6543 ws://localhost:6543`,
      "frame-src https://api.razorpay.com https://checkout.razorpay.com",
      "media-src 'self' blob: https://*.twilio.com https://res.cloudinary.com https://*.cloudinary.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/ui", "@repo/routes", "@repo/safe-fetch"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'content.jdmagicbox.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543')
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/+$/, '');

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`, // Proxy to Backend
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
