import { api } from "@/lib/api";

export const getUsers = async (params?: { page?: number; limit?: number; search?: string }): Promise<[any | null, any | null]> => {
  return await api.get("/admin/clients", { params });
};

export const getUserStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/clients/stats");
};

export const getUserById = async (id: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/clients/${id}`);
};

export const getExperts = async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<[any | null, any | null]> => {
  return await api.get("/admin/experts", { params });
};

export const getExpertStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/experts/stats");
};

export const getExpertById = async (id: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/experts/${id}`);
};

export const updateExpertStatus = async (id: string, data: { status: string; reason?: string }): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/experts/${id}/status`, data);
};

export const toggleUserBlock = async (id: string, isBlocked: boolean): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/clients/${id}/block`, { isBlocked });
};

export const getDashboardStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/dashboard/stats");
};

export const getUserGrowthStats = async (days: number = 7): Promise<[any | null, any | null]> => {
  return await api.get("/admin/analytics/user-growth", { params: { days } });
};

export const getRevenueTrend = async (days: number = 7): Promise<[any | null, any | null]> => {
  return await api.get("/admin/analytics/revenue-trend", { params: { days } });
};

export const getEarningsBreakdown = async (days: number = 7): Promise<[any | null, any | null]> => {
  return await api.get("/admin/analytics/earnings-breakdown", { params: { days } });
};

export const getTopExperts = async (limit: number = 5): Promise<[any | null, any | null]> => {
  return await api.get("/admin/analytics/top-experts", { params: { limit } });
};

// Coupons Management
export const createCoupon = async (data: any): Promise<[any | null, any | null]> => {
  return await api.post("/admin/coupons", data);
};

export const assignCouponToUser = async (userId: string, couponCode: string): Promise<[any | null, any | null]> => {
  return await api.post(`/admin/coupons/assign/${userId}`, { code: couponCode });
};

export const getCoupons = async (params?: any): Promise<[any | null, any | null]> => {
  return await api.get("/admin/coupons", { params });
};

export const getCouponStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/coupons/stats");
};

export const updateCoupon = async (id: string, data: any): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/coupons/${id}`, data);
};

export const deleteCoupon = async (id: string): Promise<[any | null, any | null]> => {
  return await api.delete(`/admin/coupons/${id}`);
};

// Bulk Coupon Assignment
export const assignCouponBulk = async (data: { couponCode: string; filters: any }): Promise<[any | null, any | null]> => {
  return await api.post("/admin/coupons/assign-bulk", data);
};

export const getFilteredUsersCount = async (filters: any): Promise<[any | null, any | null]> => {
  return await api.post("/admin/clients/filter-count", filters);
};

export const getFilteredUsers = async (params: any): Promise<[any | null, any | null]> => {
  return await api.post("/admin/clients/filtered-list", params);
};

export const getDisputes = async (params?: { page?: number; limit?: number; status?: string }): Promise<[any | null, any | null]> => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    status: params?.status === "all" ? undefined : params?.status,
  };
  return await api.get("/admin/support/disputes", { params: queryParams });
};

export const getDisputeById = async (id: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/support/disputes/${id}`);
};

export const updateDisputeStatus = async (id: string, data: { status: string; notes?: string }): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/support/disputes/${id}/status`, data);
};

export const getDisputeStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/support/disputes/stats");
};


// Chat APIs
export const getDisputeMessages = async (disputeId: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/support/disputes/${disputeId}/messages`);
};

export const sendDisputeMessage = async (disputeId: string, data: { message?: string, attachmentUrl?: string, attachmentType?: string }): Promise<[any | null, any | null]> => {
  return await api.post(`/admin/support/disputes/${disputeId}/messages`, data);
};

export const markDisputeMessagesRead = async (disputeId: string): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/support/disputes/${disputeId}/messages/read`);
};


// Live Sessions
export const getLiveSessions = async (type?: string, params?: { page?: number; limit?: number }): Promise<[any | null, any | null]> => {
  return await api.get("/admin/live-sessions", { params: { type, ...params } });
};

export const getLiveSessionStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/live-sessions/stats");
};

export const getChatHistory = async (id: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/live-sessions/${id}/history`);
};

export const terminateSession = async (id: string, data: { userMessage?: string; expertMessage?: string }): Promise<[any | null, any | null]> => {
  return await api.post(`/admin/live-sessions/${id}/terminate`, data);
};

export const getWithdrawals = async (params?: { page?: number; limit?: number; status?: string; role?: string }): Promise<[any | null, any | null]> => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    status: params?.status === "all" ? undefined : params?.status,
    role: params?.role,
  };
  return await api.get("/admin/withdrawals", { params: queryParams });
};


export const updateWithdrawalStatus = async (id: string, data: { status: string; remark?: string }): Promise<[any | null, any | null]> => {
  return await api.patch(`/admin/withdrawals/${id}/status`, data);
};

export const getWithdrawalStats = async (role?: string): Promise<[any | null, any | null]> => {
  return await api.get("/admin/withdrawals/stats", { params: { role } });
};


// Review Management
export const getReviews = async (params?: { page?: number; limit?: number; rating?: number; ratingType?: string; status?: string; search?: string; review_type?: string }): Promise<[any | null, any | null]> => {
  return await api.get("/reviews/admin/all", { params });
};

export const getReviewStats = async (): Promise<[any | null, any | null]> => {
  return await api.get("/reviews/admin/stats");
};

export const updateReviewStatus = async (id: string, status: string): Promise<[any | null, any | null]> => {
  return await api.patch(`/reviews/admin/${id}/status`, { status });
};

export const deleteReviewResource = async (id: string): Promise<[any | null, any | null]> => {
  return await api.delete(`/reviews/admin/${id}`);
};

export const sendReviewResponse = async (id: string, message: string): Promise<[any | null, any | null]> => {
  return await api.post(`/admin/reviews/${id}/response`, { message });
};

// Commission Settings
export const getCommissionSettings = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/settings/commissions");
};

export const updateCommissionSettings = async (data: Record<string, string | number>): Promise<[any | null, any | null]> => {
  return await api.post("/admin/settings/commissions", data);
};

// Merchant Sales
export const getMerchantSalesOverview = async (): Promise<[any | null, any | null]> => {
  return await api.get("/admin/merchant-sales");
};

export const getMerchantSalesDetails = async (id: string): Promise<[any | null, any | null]> => {
  return await api.get(`/admin/merchant-sales/${id}`);
};

