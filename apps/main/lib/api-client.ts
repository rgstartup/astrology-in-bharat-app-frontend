
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCookie, deleteCookie } from '../utils/cookie';

// API Client Creation
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

export const apiClient = axios.create({
    baseURL: `${cleanApiUrl}/api/v1`,
    withCredentials: false, // Set to false to avoid cookie collision with Dashboard on localhost if needed
});

// Add a request interceptor to include the clientAccessToken
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = getCookie('clientAccessToken');
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

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const backendMessage = error.response.data?.message;
            if (backendMessage && typeof backendMessage === 'string') {
                // Show the specific message from backend (e.g., "Aapka session expire ho gaya hai")
                toast.error(backendMessage, { toastId: 'auth-error' });
            }

            // If it's a 401, the token is likely expired or invalid
            if (typeof window !== 'undefined') {
                deleteCookie('clientAccessToken');
                // Optional: Redirect to login or dispatch clean state action
                // But we let the store handle state updates reactively or via page reload
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
