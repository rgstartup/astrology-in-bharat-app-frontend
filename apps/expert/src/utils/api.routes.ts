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
    AVAILABILITY: "/expert/availability",
    AVAILABILITY_ME: "/expert/availability/me",
  },
  CHAT: {
    ATTACHMENTS: "/expert/chat/attachments",
  },
  DASHBOARD: {
    STATS: "/expert-dashboard/stats",
    APPOINTMENTS_PENDING: "/chat/sessions/appointments/pending",
    APPOINTMENTS_COMPLETED: "/chat/sessions/appointments/completed",
    CALLS_PENDING: "/call/sessions/appointments/pending",
    CALLS_COMPLETED: "/call/sessions/appointments/completed",
    PUJA_APPOINTMENTS: "/puja-appointments/expert",
  },
  REVIEWS: {
    LIST: (expertId: string) => `/reviews/expert/${expertId}`,
    STATS: (expertId: string) => `/reviews/expert/${expertId}/stats`,
    REPLY: (id: string) => `/expert/reviews/${id}/reply`,
  },
} as const;
