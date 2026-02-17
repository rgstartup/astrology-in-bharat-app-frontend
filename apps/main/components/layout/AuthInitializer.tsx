
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { getCookie, setCookie } from "../../utils/cookie";
import { toast } from "react-toastify";
import { logoutAction } from "../../actions/auth";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { clientLogin, refreshAuth } = useAuthStore();
    const authCheckRef = useRef(false);

    const pathname = usePathname();

    useEffect(() => {
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        if (initialUser) {
            // If server already found a user, just update the store
            clientLogin("", initialUser);
        } else {
            // Otherwise, double check on client (for cases where server didn't fetch)
            const token = getCookie('clientAccessToken');
            if (token) {
                refreshAuth();
            } else {
                useAuthStore.setState({ clientLoading: false, isClientAuthenticated: false });

                // ZOMBIE COOKIE KILLER:
                // If we are on a protected route (e.g. /profile, /wallet) AND we have no user,
                // it implies the Middleware let us through (likely due to a stale httpOnly cookie),
                // but the RootLayout failed to validate it.
                // We MUST clear the cookie to break the infinite loop.
                const protectedPrefixes = ['/profile', '/wallet', '/settings', '/session-history'];
                if (protectedPrefixes.some(p => pathname?.startsWith(p))) {
                    console.log("🧟 Zombie session detected. Clearing invalid cookies...");
                    logoutAction().then(() => {
                        // Force reload to get fresh state (middleware will now block us or we land on public page)
                        window.location.href = '/sign-in';
                    });
                }
            }
        }
    }, [clientLogin, refreshAuth, initialUser, pathname]);

    return <>{children}</>;
};
