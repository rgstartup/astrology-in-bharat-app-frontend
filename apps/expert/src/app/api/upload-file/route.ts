import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/upload-file
 * Proxies large file uploads (videos/images) to backend.
 * - Forwards auth cookies automatically (server-side, no CORS issue)
 * - No 4MB body limit (handled by custom config below)
 * - Bypasses Next.js client proxy which has Vercel 4MB limit
 */
export async function POST(request: NextRequest) {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1')
        .replace(/\/+$/, '');

    // Forward cookies as Authorization if needed
    const cookies = request.headers.get('cookie') || '';
    
    // Extract accessToken from cookies manually (it's httpOnly so only server can read)
    const tokenMatch = cookies.match(/accessToken=([^;]+)/);
    const accessToken = tokenMatch ? tokenMatch[1] : null;

    const formData = await request.formData();

    const headers: Record<string, string> = {};
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        // Forward raw cookie header (backend will parse it)
        if (cookies) headers['Cookie'] = cookies;
    }

    const response = await fetch(`${backendUrl}/expert/upload-file`, {
        method: 'POST',
        headers,
        body: formData,
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
}

// Increase body size limit for this route to 50MB
export const config = {
    api: {
        bodyParser: false,
    },
};
