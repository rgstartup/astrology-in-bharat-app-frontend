import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
        ],
    },
    async rewrites() {
        const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "")
            .replace(/\/api\/v1\/?$/, "")
            .replace(/\/+$/, "");
        return [
            { source: "/api/v1/:path*", destination: `${backendUrl}/api/v1/:path*` },
        ];
    },
};

export default nextConfig;
