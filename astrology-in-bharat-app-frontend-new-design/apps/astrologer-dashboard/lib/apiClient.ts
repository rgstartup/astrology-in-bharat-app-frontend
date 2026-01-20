import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const apiEnvVar = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "");
const API_BASE_URL = apiEnvVar ? `${apiEnvVar}/api/v1` : 'http://localhost:6543/api/v1';

console.log("DEBUG: process.env.NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
console.log("DEBUG: Resolved API_BASE_URL =", API_BASE_URL);

// Cookie helper
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

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookies
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== "undefined" ? getCookie('accessToken') : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // Debug log
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - Auth Header Set. Token starts with: ${token.substring(0, 10)}...`);
        } else {
            console.warn(`[API] ${config.method?.toUpperCase()} ${config.url} - No Token Found in Cookies!`);
        }

        // Add expert: true to payloads for POST, PUT, PATCH
        const method = config.method?.toLowerCase();
        if (['post', 'put', 'patch'].includes(method || '')) {
            if (config.data instanceof FormData) {
                if (!config.data.has('expert')) {
                    config.data.append('expert', 'true');
                }
            } else if (typeof config.data === 'object' && config.data !== null) {
                config.data.expert = true;
            } else if (!config.data) {
                config.data = { expert: true };
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
            console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response.status} | Data:`, error.response.data);
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if it's actually a throttle error (misconfigured backend returning 401 for 429)
            const errorData = error.response?.data as any;
            let errorMessage = "";

            if (typeof errorData?.message === 'string') {
                errorMessage = errorData.message;
            } else if (Array.isArray(errorData?.message)) {
                errorMessage = errorData.message.join(" ");
            } else if (typeof errorData?.message === 'object') {
                errorMessage = JSON.stringify(errorData.message);
            }

            if (errorMessage.toLowerCase().includes('too many requests')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh the token
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true, // Send cookies with refresh token
                    }
                );

                const { accessToken } = response.data;

                // Store new access token in Cookies
                setCookie('accessToken', accessToken);

                // Update default header
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);

                // Retry original request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError: any) {
                // Refresh token is also expired or invalid
                processQueue(refreshError, null);

                // Clear tokens
                deleteCookie('accessToken');

                // Redirect to sign-in
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
