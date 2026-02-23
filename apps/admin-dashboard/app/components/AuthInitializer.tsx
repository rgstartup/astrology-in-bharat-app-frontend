"use client";

import { useEffect, ReactNode, useRef } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useSearchParams, useRouter } from "next/navigation";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: ReactNode,
    initialUser?: any
}) => {
    const { refreshAuth } = useAuthStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        // 1. Capture OAuth redirect (token in URL means backend already set HttpOnly cookies)
        const token = searchParams.get("token");
        if (token) {
            // Clean URL, then refresh auth (cookies are already set by backend)
            const nextUrl = window.location.pathname;
            router.replace(nextUrl);
            refreshAuth();
            return;
        }

        refreshAuth();
    }, [searchParams, refreshAuth, router]);

    return <>{children}</>;
};
