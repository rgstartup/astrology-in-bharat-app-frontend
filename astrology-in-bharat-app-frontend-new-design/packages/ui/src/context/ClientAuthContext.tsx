"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// API client with proper cookie handling
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
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

    const clientLogin = (newToken: string, userData?: ClientUser) => {
        localStorage.setItem('clientAccessToken', newToken);
        if (userData) {
            setClientUser(userData);
        }
        setIsClientAuthenticated(true);
    };

    const clientLogout = async () => {
        localStorage.removeItem('clientAccessToken');
        setClientUser(null);
        setIsClientAuthenticated(false);
        
        try {
            await apiClient.post('/auth/client-logout');
        } catch (err) {
            console.error("Client Logout error:", err);
        }
        
        router.push('/');
    };

    const refreshAuth = async () => {
        console.log("🔄 Manually refreshing authentication...");
        setClientLoading(true);
        try {
            const res = await apiClient.get('/client/profile');
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
                        roles: res.data.user?.roles || []
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
        const initClientAuth = async () => {
            try {
                console.log("🔍 Checking authentication status...");
                // Check authentication by calling profile endpoint
                const res = await apiClient.get('/client/profile');
                
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
                            roles: res.data.user?.roles || []
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
                console.error("❌ Client Auth init error:", err);
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
