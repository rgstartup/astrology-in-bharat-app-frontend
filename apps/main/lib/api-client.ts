
import axios from 'axios';
import { toast } from 'react-toastify';
import { deleteCookie } from '../utils/cookie';
import { API_BASE_URL } from '../utils/api-config';

const isServer = typeof window === 'undefined';

export const apiClient = axios.create({
    baseURL: isServer ? API_BASE_URL : '/api/v1',
    withCredentials: true, // Required for httpOnly cookies as per Sushant Sir's guidelines
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const backendMessage = error.response.data?.message;
            if (backendMessage && typeof backendMessage === 'string') {
                toast.error(backendMessage, { toastId: 'auth-error' });
            }

            if (typeof window !== 'undefined') {
                deleteCookie('clientAccessToken');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
