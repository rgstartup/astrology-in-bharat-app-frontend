import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/get-upload-token
 * Returns the access token from httpOnly cookie so browser can use it
 * for direct large file uploads to backend (bypassing Vercel 4.5MB limit)
 */
export async function GET(request: NextRequest) {
    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/accessToken=([^;]+)/);
    const accessToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ token: accessToken });
}
