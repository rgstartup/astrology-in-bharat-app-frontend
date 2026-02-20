
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { clientLogin, refreshAuth } = useAuthStore();
    // This ref persists across re-renders and route changes
    const authCheckRef = useRef(false);
    const pathname = usePathname();

    useEffect(() => {
        // Guard: run ONLY ONCE across the entire session, not on every pathname change
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        if (initialUser) {
            // Server already validated the user — just hydrate the client store
            clientLogin(initialUser);
        } else if (!useAuthStore.getState().isClientAuthenticated) {
            // No server-side user — attempt a client-side refresh
            // Capture the current path at the time of the check (snapshot, NOT reactive)
            const currentPath = window.location.pathname;

            refreshAuth().finally(() => {
                const state = useAuthStore.getState();
                if (!state.isClientAuthenticated) {
                    // Only redirect if user was trying to access a protected page
                    const protectedPrefixes = ['/profile', '/wallet', '/settings', '/session-history'];
                    if (protectedPrefixes.some(p => currentPath.startsWith(p))) {
                        window.location.href = '/sign-in';
                    }
                    // Public pages (/, /sign-in, /register, etc.) — do NOT redirect
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ Empty dependency array — run only ONCE on mount, never on re-renders

    return <>{children}</>;
};
