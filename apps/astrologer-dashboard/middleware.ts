import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import safeFetch from '@packages/safe-fetch/safeFetch';

// Simple JWT parser for middleware
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";
const cleanApiBase = API_URL.replace(/\/api\/v1\/?$/, "");

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 0. Define Protected Routes
    const isDashboardRoute = pathname.startsWith('/dashboard');

    // 1. Capture tokens from URL (e.g. from Social Login or Redirects)
    const urlAccessToken = searchParams.get('accessToken') || searchParams.get('token');
    const urlRefreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');

    if (urlAccessToken) {
        const nextResponse = NextResponse.redirect(new URL(pathname, request.url));
        nextResponse.cookies.set('accessToken', urlAccessToken, {
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
    let accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let shouldRefresh = false;

    // 3. Expiry Check (5-minute rule)
    if (accessToken) {
        const payload = parseJwt(accessToken);
        if (payload && payload.exp) {
            const expiryTime = payload.exp * 1000;
            const currentTime = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (expiryTime - currentTime < fiveMinutesInMs) {
                console.log("🕒 Astrologer token expiring soon, triggering refresh...");
                shouldRefresh = true;
            }
        }
    } else if (refreshToken) {
        shouldRefresh = true;
    }

    // 4. Logic for Refreshing Token
    if (shouldRefresh && refreshToken) {
        const [data, error] = await safeFetch<any>(`${cleanApiBase}/api/v1/auth/refresh`, {
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
                nextResponse.cookies.set('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
            return nextResponse;
        } else if (error) {
            console.error("Astrologer Middleware refresh error:", error);
        }
    }

    // 5. Redirect to login if still no accessToken on protected route
    if (isDashboardRoute && !accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 6. Redirect to dashboard if logged in and trying to access login page (root)
    const isLoginPage = pathname === '/';
    if (isLoginPage && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Matcher config
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
