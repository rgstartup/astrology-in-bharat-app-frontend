"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient, { setAccessToken } from '../services/apiClient';

interface AuthContextType {
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const login = (newToken: string) => {
        setToken(newToken);
        setAccessToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setAccessToken('');
        // Optionally call logout API
        apiClient.post('/auth/logout').catch(() => { });
    };

    // On mount, try to refresh token to restore session
    useEffect(() => {
        const initAuth = async () => {
            try {
                // We attempt to call refresh. If cookie exists and is valid, we get a token.
                const res = await apiClient.post('/auth/refresh');
                if (res.data.accessToken) {
                    login(res.data.accessToken);
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
        <AuthContext.Provider value={{ accessToken: token, login, logout, isAuthenticated: !!token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
