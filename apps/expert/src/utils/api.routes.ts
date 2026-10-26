export const API_ROUTES = {
  AUTH: {
    LOGIN: {
      EMAIL: "/expert/auth/email/login",
      GOOGLE: "/expert/auth/google/login",
    },
    REGISTER_INITIATE: "/expert/auth/email/register/initiate",
    REGISTER_CONFIRM: "/expert/auth/email/register/confirm",
    REFRESH: "/expert/auth/refresh",
    LOGOUT: "/expert/auth/logout",
  },
  ACCOUNT: {
    ROOT: "/expert/account",
    AVAILABILITY: "/expert/availability",
    AVAILABILITY_ME: "/expert/availability/me",
  },
  CHAT: {
    ATTACHMENTS: "/expert/chat/attachments",
  },
} as const;
