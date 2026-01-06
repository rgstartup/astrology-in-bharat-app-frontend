"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient, { setAccessToken } from '../services/apiClient';

interface User {
    id: number;
    name?: string;
    email?: string;
    avatar?: string;
    roles?: string[];
}

interface AuthContextType {
    accessToken: string | null;
    user: User | null;
    login: (token: string, userData?: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (newToken: string, userData?: User) => {
        setToken(newToken);
        setAccessToken(newToken);
        if (userData) {
            setUser(userData);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setAccessToken('');
        // Clear all possible auth cookies
        const cookiesToClear = ['access_token', 'accessToken', 'refreshToken'];
        cookiesToClear.forEach(name => {
            document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        });

        // Call logout API to revoke token on backend
        apiClient.post('/auth/logout').catch((err) => {
            console.error("Logout API call failed:", err);
        });
    };

    // On mount, try to refresh token to restore session
    useEffect(() => {
        const initAuth = async () => {
            try {
                // We attempt to call refresh. If cookie exists and is valid, we get a token.
                const res = await apiClient.post('/auth/refresh');
                if (res.data.accessToken) {
                    setAccessToken(res.data.accessToken);
                    setToken(res.data.accessToken);

                    // Fetch user profile immediately after getting token
                    try {
                        const profileRes = await apiClient.get('/client/profile');
                        if (profileRes.data) {
                            // The API usually returns the client record which contains user object
                            const clientData = profileRes.data;
                            setUser({
                                id: clientData.user?.id || clientData.id,
                                name: clientData.user?.name || clientData.full_name,
                                email: clientData.user?.email,
                                avatar: clientData.user?.avatar,
                            });
                        }
                    } catch (profileErr) {
                        console.error("Failed to fetch profile during init:", profileErr);
                    }
                }
            } catch (e) {
                // Not logged in or session expired
                console.log("Session initialization failed or no session:", e);
            } finally {
                setLoading(false);
            }
        }
        initAuth();
    }, [])

    return (
        <AuthContext.Provider value={{
            accessToken: token,
            user,
            login,
            logout,
            isAuthenticated: !!token,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
