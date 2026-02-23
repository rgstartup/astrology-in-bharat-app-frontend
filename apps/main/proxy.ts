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
    const { pathname, searchParams } = request.nextUrl;

    // 0. Protected Routes
    const protectedPaths = ['/profile', '/wallet', '/settings', '/session-history'];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    // 1. Social Login Logic (Keep it)
    // Backend sends: accessToken, refreshToken (exact names — no fallbacks)
    const urlAccessToken = searchParams.get('accessToken');
    const urlRefreshToken = searchParams.get('refreshToken');

    if (urlAccessToken) {
        const nextUrl = new URL(pathname, request.url);
        // Clear search params to clean URL
        nextUrl.searchParams.delete('accessToken');
        nextUrl.searchParams.delete('refreshToken');

        const nextResponse = NextResponse.redirect(nextUrl);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        };
        nextResponse.cookies.set('accessToken', urlAccessToken, cookieOptions);
        if (urlRefreshToken) {
            nextResponse.cookies.set('refreshToken', urlRefreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
        }
        return nextResponse;
    }

    // 2. Cookie Logic
    let accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let shouldRefresh = false;

    // 3. Check Expiry using jwt-decode
    if (accessToken) {
        try {
            const payload = jwtDecode<JwtPayload>(accessToken);
            if (payload?.exp) {
                const expiryTime = payload.exp * 1000;
                const currentTime = Date.now();
                // Refresh if expired OR expiring in < 5 mins (proactive refresh)
                if (expiryTime - currentTime < 5 * 60 * 1000) {
                    shouldRefresh = true;
                }
            } else {
                // No exp claim — treat as invalid, try refresh
                if (refreshToken) shouldRefresh = true;
            }
        } catch {
            // Malformed token — try refresh
            if (refreshToken) shouldRefresh = true;
        }
    } else if (refreshToken) {
        // No access token but have refresh token -> Refresh
        shouldRefresh = true;
    }

    // 4. Refresh Logic (Server Side)
    if (shouldRefresh && refreshToken) {
        try {
            // Use fetch for server-side call
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `refreshToken=${refreshToken}`
                }
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newAccessToken = data.accessToken;

                if (newAccessToken) {
                    const nextResponse = NextResponse.next();
                    nextResponse.cookies.set('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                    });

                    // Also update request cookie so downstream server components see new token

                    return nextResponse;
                }
            } else {
                // Refresh endpoint returned non-OK status
                // Will fall through to Final Guard
            }
        } catch {
            // Network error or fetch failed — fall through to Final Guard
        }
    }

    // 5. Final Guard
    if (isProtectedRoute) {
        if (!accessToken) {
            // If we failed to get accessToken and refresh failed
            if (refreshToken && shouldRefresh) {
                // Refresh failed, so redirect
                const loginUrl = new URL('/sign-in', request.url);
                loginUrl.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(loginUrl);
            }

            // No tokens at all
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Double-check expiry (handles case where refresh failed but token still exists)
        let isExpired = true;
        try {
            const payload = jwtDecode<JwtPayload>(accessToken);
            isExpired = payload?.exp ? (payload.exp * 1000 < Date.now()) : true;
        } catch {
            isExpired = true;
        }

        if (isExpired) {
            // Expired and refresh failed or didn't happen
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
