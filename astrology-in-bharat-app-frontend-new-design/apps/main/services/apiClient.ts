import axios from 'axios';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// We will store the token in memory safely
let accessToken = '';

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

const apiClient = axios.create({
    baseURL: API_ENDPOINT,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Silent refresh
                // We use a separate axios instance (or just axios) to avoid interceptor loop if refresh fails with 401 from interceptor
                // But since we are calling /refresh, it shouldn't need a bearer token usually (it uses cookie). 
                // Our interceptor adds bearer if accessToken exists. If it's expired, that's fine.

                const res = await axios.post(`${API_ENDPOINT}/auth/refresh`, {}, { withCredentials: true });

                const newAccessToken = res.data.accessToken;

                if (newAccessToken) {
                    setAccessToken(newAccessToken);

                    // Update header for retry
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry original request with new token
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed (expired or invalid or network)
                // Perform logout or cleanup
                setAccessToken('');
                // We can throw the error so the calling component knows it failed
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
