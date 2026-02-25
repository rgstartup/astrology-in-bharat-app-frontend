import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp?: number;
    iat?: number;
    userId?: number;
    role?: string;
}

import { getApiUrl } from '@/utils/api-config';

const API_BASE_URL = getApiUrl();
const debug = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthDebug][middleware]', ...args);
    }
};

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 0. Protected Routes
    const protectedPaths = ['/profile', '/wallet', '/settings', '/session-history'];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    // 1. Social Login Logic (Keep it)
    // Backend sends: accessToken, refreshToken (exact names — no fallbacks)
    const urlAccessToken = searchParams.get('accessToken');
    const urlRefreshToken = searchParams.get('refreshToken');
    debug('request', {
        pathname,
        isProtectedRoute,
        hasUrlAccessToken: Boolean(urlAccessToken),
        hasUrlRefreshToken: Boolean(urlRefreshToken),
    });

    if (urlAccessToken) {
        debug('social callback tokens found, setting cookies and redirecting clean URL');

        // 1. Determine redirection target based on role
        let targetPath = pathname;
        let targetHost = request.nextUrl.origin;

        try {
            const payload = jwtDecode<JwtPayload>(urlAccessToken);
            if (payload.role === 'agent') {
                targetHost = process.env.ASTROLOGER_FRONTEND_URL || 'http://localhost:3003';
                targetPath = '/dashboard';
            } else if (payload.role === 'admin') {
                targetHost = process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001';
                targetPath = '/dashboard';
            }
        } catch (err) {
            debug('failed to decode urlAccessToken for role check', err);
        }

        const nextUrl = new URL(targetPath, targetHost);
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
    debug('cookie snapshot', {
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
    });

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
            debug('refresh request threw network/error');
            debug('access token decode failed, will consider refresh');
            // Malformed token — try refresh
            if (refreshToken) shouldRefresh = true;
        }
    } else if (refreshToken) {
        // No access token but have refresh token -> Refresh
        shouldRefresh = true;
    }
    debug('token evaluation', {
        shouldRefresh,
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
    });

    // 4. Refresh Logic (Server Side)
    if (shouldRefresh && refreshToken) {
        try {
            // Use fetch for server-side call
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'GET',
                headers: {
                    'Cookie': `refreshToken=${refreshToken}`
                }
            });
            debug('refresh response', { status: refreshRes.status, ok: refreshRes.ok });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newAccessToken = data.accessToken;

                if (newAccessToken) {
                    debug('refresh success, issuing new access token cookie');
                    const nextResponse = NextResponse.next();
                    nextResponse.cookies.set('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax' as const,
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                    });

                    // Also update request cookie so downstream server components see new token

                    return nextResponse;
                }
            } else {
                debug('refresh failed with non-ok status');
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
                debug('redirecting to sign-in: refresh attempted but no access token');
                // Refresh failed, so redirect
                const loginUrl = new URL('/sign-in', request.url);
                loginUrl.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(loginUrl);
            }

            debug('redirecting to sign-in: no tokens');
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
            debug('redirecting to sign-in: access token expired');
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
