import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";
const cleanApiBase = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 0. Protected Routes Check
    const isDashboardRoute = pathname.startsWith('/admin');

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
        try {
            const response = await fetch(`${cleanApiBase}/api/v1/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `refreshToken=${refreshToken}`
                },
            });

            if (response.ok) {
                const data = await response.json();
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
            }
        } catch (error) {
            console.error("Middleware refresh error:", error);
        }
    }

    // 4. Redirect to login if still no accessToken on protected route
    if (isDashboardRoute && !accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 5. Redirect to dashboard if logged in and trying to access login page (root)
    const isLoginPage = pathname === '/';
    if (isLoginPage && accessToken) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

// Config for middleware matcher
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
