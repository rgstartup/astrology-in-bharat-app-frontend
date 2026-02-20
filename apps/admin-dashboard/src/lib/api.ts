import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE_URL, getBasePath } from "@/src/utils/api-config";

// DIRECT CONNECTION TO BACKEND (No Proxy) - still available if needed via getBasePath()
// const cleanApiUrl = getBasePath();

const isServer = typeof window === 'undefined';

export const api = axios.create({
    // Using relative path to trigger Next.js Rewrite (Proxy)
    baseURL: "/api/v1",
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for Auth Token
api.interceptors.request.use((config) => {
    if (typeof document !== "undefined") {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("adminAccessToken="))
            ?.split("=")[1];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Helper to delete cookies
const deleteCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const backendMessage = error.response.data?.message;
            if (backendMessage && typeof backendMessage === 'string') {
                toast.error(backendMessage, { toastId: 'admin-auth-error' });
            }

            if (typeof window !== 'undefined') {
                deleteCookie('adminAccessToken');
                deleteCookie('user');

                // Only redirect if NOT already on the login page
                if (window.location.pathname !== '/' && window.location.pathname !== '/admin') {
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);
