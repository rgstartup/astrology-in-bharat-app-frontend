export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/agent/profile',
    },
    AGENTS: {
        PROFILE: '/agent/profile',
        LISTINGS: '/agent/listings',          // GET (all types) + POST (create mandir/puja_shop)
        REFERRED_USERS: '/agent/listings',    // GET – referred users + place listings
        DASHBOARD_STATS: '/agent/dashboard/stats',
        COMMISSIONS: '/agent/commissions',
        REGISTER_USER: '/auth/agent/register', // POST — register expert/client
        WALLET: {
            BALANCE: '/agent/wallet/balance',
            WITHDRAWALS: '/agent/wallet/withdrawals',
            WITHDRAW: '/agent/wallet/withdraw',
            SETTLE: '/agent/wallet/settle',
        }
    },
} as const;

