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
    const { login, refreshAuth } = useAuthStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        // 1. Capture tokens from URL (for OAuth/External Login)
        const token = searchParams.get("token");
        if (token) {
            login(token);
            const nextUrl = window.location.pathname;
            router.replace(nextUrl);
            return;
        }

        refreshAuth();
    }, [searchParams, login, refreshAuth, router]);

    return <>{children}</>;
};
