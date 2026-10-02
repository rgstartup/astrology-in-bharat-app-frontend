export const API_ROUTES = {
  AUTH: {
    LOGIN: {
      EMAIL: "/expert/auth/email/login",
      GOOGLE: "/expert/auth/google/login",
    },
    REGISTER_INITIATE: "/expert/auth/email/register/initiate",
    REGISTER_CONFIRM: "/expert/auth/email/register/confirm",
  },
  ACCOUNT: {
    ROOT: "/expert/account",
  },
} as const;
