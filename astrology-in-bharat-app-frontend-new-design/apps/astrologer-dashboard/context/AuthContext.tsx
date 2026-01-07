"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
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

    const login = (newToken: string, userData?: User) => {
        localStorage.setItem('accessToken', newToken);
        if (userData) {
            setUser(userData);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
        apiClient.post('/auth/logout').catch((err) => {
            console.error("Logout error:", err);
        });
        router.push('/');
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Try to get profile to verify token and get user data
                const res = await apiClient.get('/expert/profile');
                if (res.data) {
                    setUser(res.data.user || res.data);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                // If 401, apiClient interceptor might handle refresh. 
                // But if it fails here, user is likely not authenticated correctly.
                console.error("Auth init error:", err);
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
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
