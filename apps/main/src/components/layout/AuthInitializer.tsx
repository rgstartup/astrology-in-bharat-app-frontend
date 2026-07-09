
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";

export const AuthInitializer = ({
    children,
    initialUser = null,
    hasToken = false
}: {
    children: React.ReactNode,
    initialUser?: any,
    hasToken?: boolean
}) => {
    const { login, refreshAuth } = useAuthStore();
    // This ref persists across re-renders and route changes
    const authCheckRef = useRef(false);
    const pathname = usePathname();

    useEffect(() => {
        // Guard: run ONLY ONCE across the entire session, not on every pathname change
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        if (initialUser) {
            // Server already validated the user — just hydrate the client store
            login(initialUser);
        } else if (hasToken && !useAuthStore.getState().isAuthenticated) {
            // No server-side user but token exists — attempt a client-side refresh
            const currentPath = window.location.pathname;

            refreshAuth().finally(() => {
                const state = useAuthStore.getState();
                if (!state.isAuthenticated && !state.loading) {
                    const protectedPrefixes = ['/client'];
                    if (protectedPrefixes.some(p => currentPath.startsWith(p))) {
                        useAuthStore.getState().logout("/sign-in?expired=1");
                    }
                }
            });
        } else {
            // No token at all — user is definitely unauthenticated. Just resolve loading state.
            useAuthStore.setState({ loading: false, isAuthenticated: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ Empty dependency array — run only ONCE on mount, never on re-renders

    return <>{children}</>;
};
