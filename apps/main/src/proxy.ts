import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import safeFetch from '@repo/safe-fetch';

// Simple JWT parser for proxy
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. Protected Routes Check
    const protectedPrefixes = ['/client'];
    const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

    // 1. Get tokens from cookies
    let accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    let shouldRefresh = false;

    // 2. Expiry Check (5-minute rule)
    if (accessToken) {
        const payload = parseJwt(accessToken);
        if (payload && payload.exp) {
            const expiryTime = payload.exp * 1000;
            const currentTime = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;

            if (expiryTime - currentTime < fiveMinutesInMs) {
                shouldRefresh = true;
            }
        }
    } else if (refreshToken) {
        shouldRefresh = true;
    }

    // 3. Logic for Refreshing Token
    if (shouldRefresh && refreshToken) {
        const [data, error] = await safeFetch<any>(`${API_BASE_URL}/auth/refresh`, {
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
                    sameSite: 'lax', // Use lax for main site to allow redirects from payment gateways
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
            return nextResponse;
        } else if (error) {
            console.error("[Main Proxy] refresh error:", error);
        }
    }

    // 4. Redirect to sign-in if still no accessToken on protected route
    if (isProtectedRoute && !accessToken) {
        const url = new URL('/sign-in', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // 5. Redirect to profile if logged in and trying to access sign-in/register
    const isAuthPage = pathname === '/sign-in' || pathname === '/register';
    if (isAuthPage && accessToken) {
        return NextResponse.redirect(new URL('/client/profile', request.url));
    }

    return NextResponse.next();
}

// Matcher configuration for proxy
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
