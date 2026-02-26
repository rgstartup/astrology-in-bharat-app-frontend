"use client";

import { useEffect, useRef } from "react";
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

    useEffect(() => {
        if (authCheckRef.current) return;

        const initAuth = async () => {
            if (initialUser) {
                login("", initialUser);
                return;
            }

            const publicPaths = ["/", "/register", "/forgot-password", "/reset-password", "/verify-email", "/verify-ip"];
            if (publicPaths.includes(pathname || "/")) {
                return;
            }

            // Fallback for cases where SSR didn't fetch user but cookie exists
            await refreshAuth();
        };

        authCheckRef.current = true;
        initAuth();
    }, [login, refreshAuth, initialUser, pathname]);

    return <>{children}</>;
};
