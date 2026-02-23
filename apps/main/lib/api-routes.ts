export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login', // Verify endpoint
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/client/profile',
    },
    WALLET: {
        BALANCE: '/wallet/balance',
    },
    // Add other routes as discovered
} as const;
