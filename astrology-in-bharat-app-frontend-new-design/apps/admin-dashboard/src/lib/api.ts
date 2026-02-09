import axios from "axios";

import { toast } from "react-toastify";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "")}/api/v1` : "http://localhost:6543/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
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
                // Show the specific message from backend (e.g., "Aapka session expire ho gaya hai")
                toast.error(backendMessage, { toastId: 'admin-auth-error' });
            }

            // Clear admin cookies if token is expired
            if (typeof document !== 'undefined') {
                deleteCookie('accessToken');
                deleteCookie('user');
            }

            // Optional: Redirect to login or home
            // window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
