"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Cookie helpers
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

const setCookie = (name: string, value: string, days: number = 30) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const deleteCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface User {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
    is_available?: boolean;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData?: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const login = async (newToken: string, userData?: User) => {
        setCookie('accessToken', newToken);
        setIsAuthenticated(true);

        // Fetch full profile immediately to get expert-specific fields
        try {
            const res = await apiClient.get('/expert');
            if (res.data) {
                const fullUserData = { ...res.data.user, ...res.data, profileId: res.data.id };
                setUser(fullUserData);
            } else if (userData) {
                setUser(userData);
            }
        } catch (err) {
            console.error("Error fetching expert profile after login:", err);
            if (userData) setUser(userData);
        }
    };

    const logout = () => {
        deleteCookie('accessToken');
        setUser(null);
        setIsAuthenticated(false);
        apiClient.post('/auth/logout').catch((err) => {
            console.error("Logout error:", err);
        });
        router.push('/');
    };

    useEffect(() => {
        const initAuth = async () => {
            if (typeof window === 'undefined') return;

            // Capture tokens from URL (Google OAuth Redirect)
            const searchParams = new URLSearchParams(window.location.search);
            const urlAccessToken = searchParams.get('accessToken');
            const urlRefreshToken = searchParams.get('refreshToken');

            if (urlAccessToken) {
                console.log("🎁 [Auth] Found expert tokens in URL, processing...");
                setCookie('accessToken', urlAccessToken);
                if (urlRefreshToken) {
                    setCookie('refreshToken', urlRefreshToken);
                }

                toast.success("Login Successful!");

                // Clean URL parameters and redirect to dashboard
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, newUrl);
                router.push('/dashboard');
            }

            const token = getCookie('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Try to get profile to verify token and get user data
                const res = await apiClient.get('/expert');
                if (res.data) {
                    // Merge User data INTO Profile data, but keep Profile ID as 'id'
                    const fullUserData = { ...res.data.user, ...res.data, profileId: res.data.id };
                    setUser(fullUserData);
                    setIsAuthenticated(true);
                }
            } catch (err: any) {
                // If 401, apiClient interceptor might handle refresh. 
                // But if it fails here, user is likely not authenticated correctly.
                console.error("Auth init error:", err);
                if (err.response?.status === 401) {
                    const errorData = err.response?.data as any;
                    console.log("[AuthContext] 401 Error Data:", errorData); // DEBUG LOG

                    let errorMessageString = "";
                    if (typeof errorData?.message === 'string') {
                        errorMessageString = errorData.message;
                    } else if (Array.isArray(errorData?.message)) {
                        errorMessageString = errorData.message.join(" ");
                    } else if (typeof errorData?.message === 'object') {
                        errorMessageString = JSON.stringify(errorData.message);
                    }

                    // Only logout if it's NOT a throttling error
                    if (!errorMessageString.toLowerCase().includes('too many requests')) {
                        console.warn("[AuthContext] Invalid token (401), logging out...");
                        deleteCookie('accessToken');
                        setIsAuthenticated(false);
                    } else {
                        // If it IS a throttling error masked as 401, keep authenticated
                        console.warn("[AuthContext] Token valid but throttled (401), keeping session.");
                        setIsAuthenticated(true);
                    }
                } else if (err.response?.status === 429) {
                    // If 429, definitely keep authenticated
                    setIsAuthenticated(true);
                } else {
                    // For other errors (500, etc.), arguably we should keep authenticated?
                    // Let's assume yes if we have a token.
                    setIsAuthenticated(true);
                }
                // For other errors (or throttle masked as 401), we keep the token.
                // We'll set loading to false so app can render.
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
