import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp?: number;
    iat?: number;
    sub?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. Only protect dashboard routes
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    // 1. Get Tokens — unified cookie names across all roles; role is in JWT payload
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // 2. No tokens at all → redirect to login
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Have an access token → verify it is not expired
    if (accessToken) {
        try {
            const payload = jwtDecode<JwtPayload>(accessToken);
            const exp = (payload?.exp ?? 0) * 1000;

            if (exp > Date.now()) {
                // ✅ Token valid — allow through
                return NextResponse.next();
            }
            // Token expired — fall through to refresh
        } catch {
            // Malformed token — fall through to refresh
        }
    }

    // 4. Token expired or missing — try refresh
    if (refreshToken) {
        try {
            const refreshRes = await fetch(`${API_BASE_URL}/agent/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `refreshToken=${refreshToken}`
                }
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newToken = data.accessToken;

                if (newToken) {
                    const nextResponse = NextResponse.next();
                    nextResponse.cookies.set('accessToken', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                    });
                    return nextResponse;
                }
            }
        } catch {
            // Refresh failed — redirect to login
        }
    }

    // 5. All checks failed → redirect to login
    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
