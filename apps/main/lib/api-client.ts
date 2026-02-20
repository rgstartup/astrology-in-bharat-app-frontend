import axios from 'axios';
import { API_ROUTES } from './api-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Required for httpOnly cookies
});

// Refresh Token Logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Public/auth pages — never redirect these to /sign-in on 401
const PUBLIC_PATHS = ['/sign-in', '/register', '/forgot-password', '/reset-password', '/verify-email'];

const isOnPublicPage = () => {
    if (typeof window === "undefined") return false;
    return PUBLIC_PATHS.some(p => window.location.pathname.startsWith(p));
};

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH)) {
            // ✅ If already on a public/auth page, just reject — do NOT redirect (prevents infinite loop)
            if (isOnPublicPage()) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post(API_ROUTES.AUTH.REFRESH);
                processQueue(null);
                isRefreshing = false;
                return apiClient(originalRequest);
            } catch (_error) {
                processQueue(_error, null);
                isRefreshing = false;
                // Only redirect if NOT already on a public page
                if (typeof window !== "undefined" && !isOnPublicPage()) {
                    window.location.href = "/sign-in";
                }
                return Promise.reject(_error);
            }
        }

        if (error.response?.status === 401 && (originalRequest._retry || originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH))) {
            // Only redirect if NOT already on a public page
            if (typeof window !== "undefined" && !isOnPublicPage()) {
                window.location.href = "/sign-in";
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
