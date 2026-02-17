
"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getCookie, setCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { clientLogin, refreshAuth, clientLoading, isClientAuthenticated } = useAuthStore();
    const authCheckRef = useRef(false);

    useEffect(() => {
        if (authCheckRef.current) return;

        const initClientAuth = async () => {
            // 1. URL Token Check
            const searchParams = new URLSearchParams(window.location.search);
            const urlAccessToken = searchParams.get('accessToken') || searchParams.get('token');
            const urlRefreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');

            if (urlAccessToken) {
                setCookie('clientAccessToken', urlAccessToken);
                if (urlRefreshToken) {
                    setCookie('refreshToken', urlRefreshToken);
                }

                clientLogin(urlAccessToken); // Trigger login state update
                toast.success("Login Successful!");

                // Clean URL
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, newUrl);
                return;
            }

            // 2. Cookie Token Check
            const token = getCookie('clientAccessToken');
            if (token) {
                // Trigger refreshAuth which sets isLoading and fetches profile
                await refreshAuth();
            } else {
                // No token, ensure loading is false
                useAuthStore.setState({ clientLoading: false, isClientAuthenticated: false });
            }
        };

        authCheckRef.current = true;
        initClientAuth();
    }, [clientLogin, refreshAuth]);

    return <>{children}</>;
};
