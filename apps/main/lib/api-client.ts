
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCookie, deleteCookie } from '../utils/cookie';

// API Client Creation
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

export const apiClient = axios.create({
    baseURL: `${cleanApiUrl}/api/v1`,
    withCredentials: true, // Crucial for httpOnly cookies
});

// Request interceptor - No longer needs to manually set Bearer token if using withCredentials + httpOnly cookies
// But if the backend STILL expects Bearer header, we might have a problem unless the backend also accepts cookies.
// Sushant sir said "set them as httpOnly cookie", usually implying the backend will read from cookies.

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
