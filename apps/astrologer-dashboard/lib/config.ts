
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";

// Clean the URL to get the base (without /api/v1)
export const CLIENT_API_URL = API_URL;
export const BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");

export const config = {
    apiUrl: CLIENT_API_URL,
    backendUrl: BACKEND_URL,
};

export default config;
