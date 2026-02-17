
"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getCookie, setCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

export const AuthInitializer = ({
    children,
    initialUser = null
}: {
    children: React.ReactNode,
    initialUser?: any
}) => {
    const { clientLogin, refreshAuth } = useAuthStore();
    const authCheckRef = useRef(false);

    useEffect(() => {
        if (authCheckRef.current) return;
        authCheckRef.current = true;

        if (initialUser) {
            // If server already found a user, just update the store
            clientLogin("", initialUser);
        } else {
            // Otherwise, double check on client (for cases where server didn't fetch)
            const token = getCookie('clientAccessToken');
            if (token) {
                refreshAuth();
            } else {
                useAuthStore.setState({ clientLoading: false, isClientAuthenticated: false });
            }
        }
    }, [clientLogin, refreshAuth, initialUser]);

    return <>{children}</>;
};
