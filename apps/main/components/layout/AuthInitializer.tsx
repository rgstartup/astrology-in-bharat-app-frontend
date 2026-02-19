
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
            clientLogin("", initialUser);
        } else if (!useAuthStore.getState().isClientAuthenticated) {
            // Only refresh if we don't already have a valid client session
            refreshAuth().finally(() => {
                const state = useAuthStore.getState();
                if (!state.isClientAuthenticated) {
                    // ZOMBIE COOKIE KILLER:
                    const protectedPrefixes = ['/profile', '/wallet', '/settings', '/session-history'];
                    if (protectedPrefixes.some(p => pathname?.startsWith(p))) {
                        logoutAction().then(() => {
                            window.location.href = '/sign-in';
                        });
                    }
                }
            });
        }
    }, [clientLogin, refreshAuth, initialUser, pathname]);

    return <>{children}</>;
};
