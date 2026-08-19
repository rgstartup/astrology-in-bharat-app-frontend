import type { NextConfig } from "next";

// ─── Security Headers ──────────────────────────────────────────────────────────
const securityHeaders = [
  // Prevent clickjacking — page cannot be embedded in an iframe
  { key: "X-Frame-Options", value: "DENY" },

  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Referrer info — only send origin on cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable browser features we don't use
  { key: "Permissions-Policy", value: "geolocation=()" },

  // HSTS — force HTTPS for 1 year (production only)
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),

  // ─── Content Security Policy ───────────────────────────────────────────────
  {
    key: "Content-Security-Policy",
    value: [
      // Default: only same origin
      "default-src 'self'",

      // Scripts: self + Razorpay + Google APIs + Frameworks (inline eval for Next.js) + Sentry (Razorpay dependency)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com https://translate.googleapis.com https://www.youtube.com https://s.ytimg.com https://*.sentry-cdn.com",

      // Styles: self + inline (Tailwind) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",

      // Fonts: self + Google Fonts + FontAwesome + data URIs (for embedded fonts in libs like Chart.js)
      "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",

      // Images: self + Cloudinary + Google OAuth + JD Magic Box (Wildcard) + data URIs + RandomUser + Unsplash + YouTube + Flaticon + TripAdvisor + Sai Org + Wikimedia + Flickr + Alamy + Shutterstock + TwoBrownFeet + IndiTales
      "img-src 'self' data: blob: *",

      // API & WebSocket connections
      // Whitelist both production (OnRender) and local development (Localhost), plus Razorpay Sentry telemetry
      `connect-src 'self' https://nominatim.openstreetmap.org https://checkout.razorpay.com https://lumberjack.razorpay.com https://*.sentry.io https://*.sentry-cdn.com https://www.youtube.com https://*.twilio.com wss: ws: wss://*.twilio.com https://astrology-in-bharat-services.onrender.com wss://astrology-in-bharat-services.onrender.com http://localhost:6543 http://127.0.0.1:6543 ws://localhost:6543 ${process.env.NEXT_PUBLIC_API_URL || ""} ${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/i, "").replace(/^http/, 'ws') || ""}`,

      // Frames: Razorpay checkout iframe and YouTube embeds
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://www.youtube-nocookie.com",

      // Media - Twilio video/audio & Cloudinary uploaded videos
      "media-src 'self' blob: https://*.twilio.com https://res.cloudinary.com https://*.cloudinary.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  transpilePackages: ["@repo/ui", "@repo/routes", "swiper"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
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
  async redirects() {
    return [
      {
        source: "/buy-products",
        destination: "/product",
        permanent: true,
      },
      {
        source: "/buy-products/:path*",
        destination: "/product/:path*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543').replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");
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

  devIndicators: false,

  async headers() {
    return [
      {
        // Apply security headers to ALL routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;


