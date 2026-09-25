export const API_ROUTES = {
  AUTH: {
    CLIENT: {
      LOGIN: "/client/auth/email/login",
      REGISTER: "/client/auth/email/register/initiate",
      VERIFY_OTP: "/client/auth/email/register/complete",
      GOOGLE_LOGIN: "/client/auth/google/login",
      ME: "/client/account",
      PICTURE: "/client/account/picture",
      REFRESH: "/client/auth/refresh",
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
  CLIENT: {
    AUTH: {
      LOGIN: "/client/auth/email/login",
      REGISTER: "/client/auth/email/register/initiate",
      VERIFY_OTP: "/client/auth/email/register/complete",
      GOOGLE_LOGIN: "/client/auth/google/login",
      ME: "/client/account",
      PICTURE: "/client/account/picture",
      REFRESH: "/client/auth/refresh",
    },
    FAVORITES: {
      EXPERT: {
        LIST: "/client/favorites/expert",
        ADD_TO_FAVORITE: "/client/favorites/expert/:id",
        REMOVE_FROM_FAVORITE: "/client/favorites/expert/:id",
      },
      PRODUCT: {
        LIST: "/client/favorites/product",
        ADD_TO_FAVORITE: "/client/favorites/product/:id",
        REMOVE_FROM_FAVORITE: "/client/favorites/product/:id",
      },
      PRODUCT_VARIANT: {
        LIST: "/client/favorites/product-variant",
        ADD_TO_FAVORITE: "/client/favorites/product-variant/:id",
        REMOVE_FROM_FAVORITE: "/client/favorites/product-variant/:id",
      },
    },
    WALLET: {
      TRANSACTIONS: "/client/wallet/transaction",
      RECHARGE_INITIATE: "/client/wallet/recharge/initiate",
      RECHARGE_VERIFY: "/client/wallet/recharge/verify",
    },
  },
  CONSULTATION: {
    TOPICS: "/consultations/topics",
  },
  SPECIALIZATIONS: "/specializations",
  PLACES: {
    SEARCH: "/places/search",
    IMAGES: "/places/images",
  },
  WALLET: {
    BALANCE: "/wallet/balance",
  },
  EXPERT: {
    ACCOUNT: "/expert/account/:id",
    LIST: "/expert/account/list",
    DETAILS: "/expert/account/profile",
    GET_ALL_PUJAS: "/expert/pujas/all",
    GET_PUJA_BY_ID: "/expert/puja/info/:id",
    PRODUCTS: {
      ROOT: "/expert/products",
    },
  },
  WISHLIST: {
    PUJA_TOGGLE: "/wishlist/puja/:id/toggle",
  },
  PUJA: {
    BOOKING: "/puja-appointments",
    GET_USER_APPOINTMENTS: "/puja-appointments/user",
  },
  ASTROLOGY: {
    SERVICES: "/astrology/services",
    SERVICE_BY_ID: "/astrology/services/:id",
    HOROSCOPE_DAILY: "/astrology/horoscope-daily",
    KUNDLI_MATCHING: "/astrology/matching/advanced",
    MANGAL_DOSHA: "/astrology/mangal-dosha",
    BIRTH_DETAILS: "/astrology/birth-details",
    PANCHANG: "/astrology/panchang",
    PLANETARY_POSITIONS: "/astrology/planetary-positions",
  },
  DEVOTION: {
    RITUALS: "/devotion/rituals",
    RITUAL_BY_ID: "/devotion/rituals/:id",
  },
  QUOTES: "/quotes",
  PRODUCTS: "/products",
} as const;
