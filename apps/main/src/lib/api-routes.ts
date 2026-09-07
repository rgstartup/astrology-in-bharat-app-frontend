export const API_ROUTES = {
  AUTH: {
    CLIENT: {
      LOGIN: "/auth/client/email/login",
      REGISTER: "/auth/client/email/register",
      GOOGLE_LOGIN: "/auth/client/google/login",
      ME: "/client/account",
    },
    LOGIN: "/auth/email/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/client/account",
    REGISTER: "/auth/email/register",
    VERIFY_EMAIL: "/auth/email/verify",
    FORGOT_PASSWORD: "/auth/forgot/password",
    RESET_PASSWORD: "/auth/reset/password",
  },
  PLACES: {
    SEARCH: "/places/search",
    IMAGES: "/places/images",
  },
  WALLET: {
    BALANCE: "/wallet/balance",
  },
  EXPERT: {
    GET_ALL_PUJAS: "/expert/pujas/all",
    GET_PUJA_BY_ID: "/expert/puja/info/:id",
  },
  WISHLIST: {
    PUJA_TOGGLE: "/wishlist/puja/:id/toggle",
  },
  PUJA: {
    BOOKING: "/puja-appointments",
    GET_USER_APPOINTMENTS: "/puja-appointments/user",
  },
  ASTROLOGY: {
    HOROSCOPE_DAILY: "/astrology/horoscope-daily",
    KUNDLI_MATCHING: "/astrology/matching/advanced",
    MANGAL_DOSHA: "/astrology/mangal-dosha",
    BIRTH_DETAILS: "/astrology/birth-details",
    PANCHANG: "/astrology/panchang",
    PLANETARY_POSITIONS: "/astrology/planetary-positions",
  },
  QUOTES: "/quotes",
  PRODUCTS: "/products",
} as const;
