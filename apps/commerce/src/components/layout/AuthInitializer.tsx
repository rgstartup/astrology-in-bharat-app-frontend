"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { setAuthCookies } from "@/actions/auth";
import { toast } from "react-toastify";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { login, refreshAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;

        const handleAuth = async () => {
            // 1. Handle URL tokens (Google Auth Callback)
            const accessToken = searchParams?.get("accessToken");
            const refreshToken = searchParams?.get("refreshToken");

            if (accessToken) {
                console.log("[AuthInitializer] Token found in URL, capturing...");
                try {
                    await setAuthCookies(accessToken, refreshToken || undefined);
                    
                    // Update store
                    login(accessToken, initialUser);
                    
                    // Clean URL and redirect
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, "", newUrl);
                    
                    // toast.success("Login successful!");
                    window.location.href = "/dashboard";
                } catch (err) {
                    console.error("[AuthInitializer] Error setting cookies:", err);
                }
            } else {
                // 2. Regular server-side hydration (initialUser can be null)
                refreshAuth(initialUser);
            }
        };

        initializedRef.current = true;
        handleAuth();
    }, [searchParams, initialUser, login, refreshAuth]);

    return <>{children}</>;
};
