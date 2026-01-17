"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// API client with proper cookie handling
export const apiClient = axios.create({
    baseURL: '/api/v1',
    withCredentials: false, // Set to false to avoid cookie collision with Dashboard on localhost
});

// Add a request interceptor to include the clientAccessToken
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('clientAccessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
    avatar?: string;
}

interface ClientAuthContextType {
    clientUser: ClientUser | null;
    clientLogin: (token: string, userData?: ClientUser) => void;
    clientLogout: () => void;
    refreshAuth: () => Promise<void>;
    isClientAuthenticated: boolean;
    clientLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType>({
    clientUser: null,
    clientLogin: () => { },
    clientLogout: () => { },
    refreshAuth: async () => { },
    isClientAuthenticated: false,
    clientLoading: true,
});

export const ClientAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [clientUser, setClientUser] = useState<ClientUser | null>(null);
    const [clientLoading, setClientLoading] = useState(true);
    const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
    const router = useRouter();
    const authCheckRef = useRef(false); // Add ref to prevent multiple checks

    const clientLogin = (newToken: string, userData?: ClientUser) => {
        localStorage.setItem('clientAccessToken', newToken);
        if (userData) {
            setClientUser(userData);
        }
        setIsClientAuthenticated(true);
    };

    const clientLogout = async () => {
        console.log("🚪 Starting logout process...");

        // Clear local state first
        setClientUser(null);
        setIsClientAuthenticated(false);
        setClientLoading(false);

        // Clear all local storage items
        localStorage.removeItem('clientAccessToken');
        localStorage.removeItem('refreshToken'); // If any client refresh token exists

        console.log("🗑️ Cleared local storage and state");

        try {
            // Call backend logout endpoint
            console.log("📡 Calling backend logout...");
            const response = await apiClient.post('/auth/client-logout');
            console.log("✅ Backend logout successful:", response.data);
        } catch (err: any) {
            console.error("❌ Backend logout error:", err);

            // Even if backend fails, continue with frontend logout
            if (err.response?.status === 401) {
                console.log("ℹ️ User was already logged out (401)");
            } else if (err.response?.status === 404) {
                console.log("ℹ️ Logout endpoint not found (404)");
            } else {
                console.log("⚠️ Network error during logout, but continuing...");
            }
        }

        console.log("🔄 Redirecting to home...");
        router.push('/');
    };

    const refreshAuth = async () => {
        const token = localStorage.getItem('clientAccessToken');
        console.log("🔄 Manually refreshing authentication... Token present:", !!token);
        if (!token) {
            setIsClientAuthenticated(false);
            setClientLoading(false);
            return;
        }
        // Only set loading if we don't have an auth status yet
        if (!isClientAuthenticated) {
            setClientLoading(true);
        }
        try {
            const res = await apiClient.get('/client');
            console.log("📊 Profile response:", res.data);

            // If we get a 200 response (even with empty data), user is authenticated
            // because the endpoint is protected by JwtAuthGuard
            if (res.status === 200) {
                // Try to get user info from response
                if (res.data && res.data.user) {
                    setClientUser(res.data.user);
                    setIsClientAuthenticated(true);
                    console.log("✅ User authenticated via user data:", res.data.user);
                } else if (res.data && res.data.id) {
                    // Profile exists but no nested user object
                    setClientUser({
                        id: res.data.user?.id || res.data.id,
                        name: res.data.user?.name || res.data.full_name,
                        email: res.data.user?.email,
                        roles: res.data.user?.roles || [],
                        avatar: res.data.user?.avatar || res.data.profile_picture
                    });
                    setIsClientAuthenticated(true);
                    console.log("✅ User authenticated via profile data:", res.data);
                } else {
                    // User is authenticated but has no profile yet
                    // We need to get user info from somewhere else or use minimal data
                    console.log("✅ User authenticated but no profile exists");

                    // Try to get user info from login response or create minimal user object
                    // For now, we'll consider them authenticated with minimal data
                    setClientUser({
                        id: 0, // Will be updated when profile is created
                        name: "User",
                        email: "",
                        roles: []
                    });
                    setIsClientAuthenticated(true);
                }
            } else {
                setIsClientAuthenticated(false);
                setClientUser(null);
                console.log("❌ No authentication data found");
            }
        } catch (err: any) {
            console.error("❌ Refresh auth error:", err);
            // If we get 401, user is not authenticated
            if (err.response?.status === 401) {
                setIsClientAuthenticated(false);
                setClientUser(null);
                console.log("❌ User not authenticated (401)");
            } else {
                // Other errors might be network issues, don't clear auth state
                console.log("⚠️ Network error, keeping current auth state");
            }
        } finally {
            setClientLoading(false);
        }
    };

    useEffect(() => {
        // Prevent multiple simultaneous authentication checks
        if (authCheckRef.current) {
            return;
        }

        const initClientAuth = async () => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('clientAccessToken');
            console.log("🔍 [ClientAuth] Initializing... Token found:", !!token);

            if (!token) {
                console.log("ℹ️ [ClientAuth] No clientAccessToken found, skipping auth check");
                setIsClientAuthenticated(false);
                setClientLoading(false);
                return;
            }

            // OPTIMISTIC: Assume authenticated if we have a token
            setIsClientAuthenticated(true);

            try {
                console.log("🔍 [ClientAuth] Verifying session via /client/profile...");
                const res = await apiClient.get('/client', {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    },
                    params: {
                        _t: new Date().getTime() // Anti-cache timestamp
                    }
                });

                console.log("📊 [ClientAuth] Profile response mapping...");

                // If we get a 200 response (even with empty data), user is authenticated
                // because the endpoint is protected by JwtAuthGuard
                if (res.status === 200) {
                    // Try to get user info from response
                    if (res.data && res.data.user) {
                        setClientUser(res.data.user);
                        setIsClientAuthenticated(true);
                        console.log("✅ User authenticated via user data:", res.data.user);
                    } else if (res.data && res.data.id) {
                        // Profile exists but no nested user object
                        setClientUser({
                            id: res.data.user?.id || res.data.id,
                            name: res.data.user?.name || res.data.full_name,
                            email: res.data.user?.email,
                            roles: res.data.user?.roles || [],
                            avatar: res.data.user?.avatar || res.data.profile_picture
                        });
                        setIsClientAuthenticated(true);
                        console.log("✅ User authenticated via profile data:", res.data);
                    } else {
                        // User is authenticated but has no profile yet
                        console.log("✅ User authenticated but no profile exists");

                        // Try to get user info from login response or create minimal user object
                        // For now, we'll consider them authenticated with minimal data
                        setClientUser({
                            id: 0, // Will be updated when profile is created
                            name: "User",
                            email: "",
                            roles: []
                        });
                        setIsClientAuthenticated(true);
                    }
                } else {
                    setIsClientAuthenticated(false);
                    setClientUser(null);
                    console.log("❌ No authentication data found");
                }
            } catch (err: any) {
                console.error("❌ [ClientAuth] Auth init error:", err);
                // If we get 401, user is definitely not authenticated or token expired
                if (err.response?.status === 401) {
                    console.log("❌ [ClientAuth] User not authenticated (401), clearing session");
                    setIsClientAuthenticated(false);
                    setClientUser(null);
                    localStorage.removeItem('clientAccessToken');
                } else if (err.response?.status === 404) {
                    // NEW: Treat 404 as authenticated but no profile yet
                    console.log("✅ [ClientAuth] Profile not found (404), but user is authenticated");
                    setIsClientAuthenticated(true);
                    setClientUser({
                        id: 0,
                        name: "New Cosmic Explorer",
                        email: "",
                        roles: []
                    });
                } else {
                    // Other errors (500, network) - better to stay "authenticated" 
                    // and let the page handle the error or show cached data
                    console.log("⚠️ [ClientAuth] Network or server error, assuming session is still valid");
                    setIsClientAuthenticated(true);
                }
            } finally {
                setClientLoading(false);
                authCheckRef.current = false;
            }
        };

        authCheckRef.current = true; // Set ref to prevent multiple calls
        initClientAuth();
    }, []);

    return (
        <ClientAuthContext.Provider value={{
            clientUser,
            clientLogin,
            clientLogout,
            refreshAuth,
            isClientAuthenticated,
            clientLoading
        }}>
            {children}
        </ClientAuthContext.Provider>
    );
};

export const useClientAuth = () => useContext(ClientAuthContext);
