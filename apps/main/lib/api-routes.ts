export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/email/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/client/profile',
        REGISTER: '/auth/email/register',
        VERIFY_EMAIL: '/auth/email/verify',
        FORGOT_PASSWORD: '/auth/forgot/password',
        RESET_PASSWORD: '/auth/reset/password',
    },
    PLACES: {
        SEARCH: '/places/search',
        IMAGES: '/places/images',
    },
    WALLET: {
        BALANCE: '/wallet/balance',
    },
    EXPERT: {
        GET_ALL_PUJAS: '/expert/pujas/all',
        GET_PUJA_BY_ID: '/expert/puja/info/:id',
    },
    WISHLIST: {
        PUJA_TOGGLE: '/wishlist/puja/:id/toggle',
    },
    PUJA: {
        BOOKING: '/puja-appointments',
        GET_USER_APPOINTMENTS: '/puja-appointments/user',
    },
    ASTROLOGY: {
        HOROSCOPE_DAILY: '/astrology/horoscope/daily',
        KUNDLI_MATCHING: '/astrology/matching/advanced',
        MANGAL_DOSHA: '/astrology/mangal-dosha',
        BIRTH_DETAILS: '/astrology/birth-details',
    },
    QUOTES: '/quotes',
    PRODUCTS: '/products',
} as const;
