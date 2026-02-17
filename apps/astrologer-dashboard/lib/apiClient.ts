import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

const isServer = typeof window === 'undefined';
export const apiClient = axios.create({
    baseURL: isServer ? (cleanApiUrl ? `${cleanApiUrl}/api/v1` : "") : "/api/v1",
    withCredentials: true,
    timeout: 5000,
});

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const backendMessage = error.response.data?.message;
            if (backendMessage && typeof backendMessage === 'string') {
                toast.error(backendMessage, { toastId: 'auth-error' });
            }
            // Optional: Handle state cleanup if needed, but middleware/store usually handles this
        }
        return Promise.reject(error);
    }
);

export default apiClient;


