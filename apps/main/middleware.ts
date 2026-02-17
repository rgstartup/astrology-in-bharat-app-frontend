import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseJwt } from './utils/jwt';
import safeFetch from '@packages/safe-fetch/safeFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    console.log(`[MiddlewareDebug] Path: ${pathname}`);

    // 0. Define Protected Routes
    const protectedPaths = ['/profile', '/wallet', '/settings', '/session-history'];
    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

    // 1. Capture tokens from URL (e.g. from Social Login)
    const urlAccessToken = searchParams.get('accessToken') || searchParams.get('token');
    const urlRefreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');

    if (urlAccessToken) {
        const nextResponse = NextResponse.redirect(new URL(pathname, request.url));
        nextResponse.cookies.set('clientAccessToken', urlAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        if (urlRefreshToken) {
            nextResponse.cookies.set('refreshToken', urlRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
            });
        }
        return nextResponse;
    }

    // 2. Get tokens from cookies
    let accessToken = request.cookies.get('clientAccessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let shouldRefresh = false;

    // 3. Expiry & Validity Check
    if (accessToken) {
        const payload = parseJwt(accessToken);

        if (!payload) {
            console.log("⚠️ Invalid JWT token detected in middleware. Treating as unauthenticated.");
            accessToken = undefined; // Invalidate the token
        } else if (payload.exp) {
            const expiryTime = payload.exp * 1000; // convert to ms
            const currentTime = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (expiryTime - currentTime < fiveMinutesInMs) {
                console.log("🕒 Token expiring soon, triggering refresh...");
                shouldRefresh = true;
            }
        }
    } else if (refreshToken) {
        // No access token but have refresh token
        shouldRefresh = true;
    }

    // 4. Logic for Refreshing Token
    if (shouldRefresh && refreshToken) {
        const [data, error] = await safeFetch<any>(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `refreshToken=${refreshToken}`
            },
        });

        if (data && !error) {
            accessToken = data.accessToken;

            const nextResponse = NextResponse.next();
            if (accessToken) {
                nextResponse.cookies.set('clientAccessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
            return nextResponse;
        } else if (error) {
            console.error("Middleware refresh error:", error);
        }
    }

    // 4. Redirect to login if still no accessToken on protected route
    if (isProtectedRoute && !accessToken) {
        const loginUrl = new URL('/sign-in', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Redirect to profile if already logged in and trying to access sign-in/register
    // REMOVED: This causes issues if the token is invalid/stale. Let the client-side handle redirects if valid.
    /* const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/register');
    if (isAuthPage && accessToken) {
        return NextResponse.redirect(new URL('/profile', request.url));
    } */

    return NextResponse.next();
}

// Config for middleware matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/ (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
