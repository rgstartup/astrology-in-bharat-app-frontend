export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login', // Verify endpoint
        LOGOUT: '/auth/client-logout',
        REFRESH: '/auth/refresh',
        ME: '/client',
    },
    WALLET: {
        BALANCE: '/wallet/balance',
    },
    // Add other routes as discovered
} as const;
