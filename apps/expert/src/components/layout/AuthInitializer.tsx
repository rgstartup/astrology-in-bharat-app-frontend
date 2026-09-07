"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { login, refreshAuth } = useAuthStore();
    const pathname = usePathname();
    const authCheckRef = useRef(false);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (authCheckRef.current) return;

        const initAuth = async () => {
            console.log("🔐 [AuthInitializer] initAuth called", { pathname, hasInitialUser: !!initialUser, initialUser });

            const publicPaths = ["/", "/register", "/forgot-password", "/reset-password", "/verify-email", "/verify-ip"];
            const isPublic = publicPaths.includes(pathname || "/");
            
            if (isPublic) {
                console.log("🔐 [AuthInitializer] Public path, skipping refreshAuth");
                if (initialUser) {
                    console.log("🔐 [AuthInitializer] Setting initialUser from SSR:", initialUser);
                    login("", initialUser);
                }
                return;
            }

            // On protected pages, always do a fresh refreshAuth to get latest state
            console.log("🔐 [AuthInitializer] Protected page - calling refreshAuth()");
            await refreshAuth();
            const state = (await import("@/store/useAuthStore")).useAuthStore.getState();
            console.log("🔐 [AuthInitializer] After refreshAuth:", { isAuthenticated: state.isAuthenticated, user: state.user });
        };

        authCheckRef.current = true;
        initAuth();
    }, [login, refreshAuth, initialUser, pathname]);

    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
};
