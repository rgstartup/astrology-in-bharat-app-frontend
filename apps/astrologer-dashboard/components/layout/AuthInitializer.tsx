"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { login, refreshAuth } = useAuthStore();
    const authCheckRef = useRef(false);

    useEffect(() => {
        if (authCheckRef.current) return;

        const initAuth = async () => {
            if (initialUser) {
                login("", initialUser);
                return;
            }

            // Fallback for cases where SSR didn't fetch user but cookie exists
            await refreshAuth();
        };

        authCheckRef.current = true;
        initAuth();
    }, [login, refreshAuth, initialUser]);

    return <>{children}</>;
};
