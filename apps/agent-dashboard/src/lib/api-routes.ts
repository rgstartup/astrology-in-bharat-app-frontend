export const API_ROUTES = {
    AUTH: {
        LOGIN: '/agent/login',
        LOGOUT: '/agent/logout',
        REFRESH: '/agent/refresh',
        ME: '/agent/profile',
    },
    AGENTS: {
        PROFILE: '/agent/profile',
        LISTINGS: '/agent/listings',          // GET + POST
        DASHBOARD_STATS: '/agent/dashboard/stats',
        REGISTER_USER: '/agent/register-user', // POST — register expert/client
    },
} as const;
