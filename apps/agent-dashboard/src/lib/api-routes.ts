export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/agent/profile',
    },
    AGENTS: {
        PROFILE: '/agent/profile',
        LISTINGS: '/agent/listings',          // GET + POST
        DASHBOARD_STATS: '/agent/dashboard/stats',
        REGISTER_USER: '/agent/register-user', // POST — register expert/client
    },
} as const;
