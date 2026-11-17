export const API_ROUTES = {
  AUTH: {
    LOGIN: {
      EMAIL: "/expert/auth/email/login",
      GOOGLE: "/expert/auth/google/login",
    },
    REGISTER_INITIATE: "/expert/auth/email/register/initiate",
    REGISTER_COMPLETE: "/expert/auth/email/register/complete",
    REGISTER_CONFIRM: "/expert/auth/email/register/complete",
    REFRESH: "/expert/auth/refresh",
    LOGOUT: "/expert/auth/logout",
  },
  ACCOUNT: {
    ROOT: "/expert/account",
    PERSONAL_INFO: "/expert/account/personal-info",
    AVAILABILITY: "/expert/availability",
    AVAILABILITY_ME: "/expert/availability/me",
  },
  AVATAR: {
    UPLOAD_SIGNATURE: "/expert/account/avatar/upload-signature",
    VERIFY: "/expert/account/avatar/verify",
  },
  ONBOARDING: {
    STATUS: "/expert/onboarding/status",
    COMPLETE: "/expert/onboarding/complete",
  },
  PROFESSIONS: {
    LIST: "/professions?limit=100&is_active=true",
    SYNC_ME: "/expert/professions/me",
  },
  SPECIALIZATIONS: {
    AVAILABLE: "/expert/specializations/available",
    SYNC_ME: "/expert/specializations/me",
  },
  CHAT: {
    ATTACHMENTS: "/expert/chat/attachments",
  },
  DASHBOARD: {
    STATS: "/expert/me/dashboard/stats",
    APPOINTMENTS_PENDING: "/chat/sessions/appointments/pending",
    APPOINTMENTS_COMPLETED: "/chat/sessions/appointments/completed",
    CALLS_PENDING: "/call/sessions/appointments/pending",
    CALLS_COMPLETED: "/call/sessions/appointments/completed",
    PUJA_APPOINTMENTS: "/puja-appointments/expert",
  },
  REVIEWS: {
    LIST: "/expert/me/reviews",
    STATS: "/expert/me/reviews/stats",
    REPLY: (id: string) => `/expert/reviews/${id}/reply`,
  },
  BANK_LINKS: {
    ROOT: "/expert/bank-accounts",
    INITIATE: "/expert/bank-accounts/link/initiate",
    COMPLETE: "/expert/bank-accounts/link/complete",
    CALLBACK: "/expert/bank-accounts/callback",
    REFRESH_STATUS: "/expert/bank-accounts/link/refresh-status",
    VALIDATE_PENNY_DROP: "/expert/bank-accounts/link/validate-penny-drop",
    SET_PRIMARY: "/expert/bank-accounts/link/set-primary",
  },
  PAYOUT_ACCOUNTS: {
    ROOT: "/expert/payout-accounts",
    INITIATE: "/expert/payout-accounts/initiate",
    COMPLETE: "/expert/payout-accounts/complete",
    LINKS: "/expert/payout-accounts/links",
    PAYOUT: "/expert/payout-accounts/payout",
    RECONCILE: "/expert/payout-accounts/reconcile",
    REMOVE: (id: number) => `/expert/payout-accounts/${id}`,
    SET_PRIMARY: (id: number) => `/expert/payout-accounts/${id}/set-primary`,
  },
} as const;
