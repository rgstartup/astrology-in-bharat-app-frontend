import { api } from "@/src/lib/api";

export const getUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const getUserStats = async () => {
  const res = await api.get("/admin/users/stats");
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const getExperts = async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  const res = await api.get("/admin/experts", { params });
  return res.data;
};

export const getExpertStats = async () => {
  const res = await api.get("/admin/experts/stats");
  return res.data;
};

export const getExpertById = async (id: number) => {
  const res = await api.get(`/admin/experts/${id}`);
  return res.data;
};

export const updateExpertStatus = async (id: number, data: { status: string; reason?: string }) => {
  const res = await api.patch(`/admin/experts/${id}/status`, data);
  return res.data;
};
export const toggleUserBlock = async (id: number, isBlocked: boolean) => {
  const res = await api.patch(`/admin/users/${id}/block`, { isBlocked });
  return res.data;
};

export const getDashboardStats = async () => {
  try {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
  } catch (error) {
    console.error("Dashboard stats fetch failed, returning mock fallback", error);
    return null; // Return null so the UI can handle empty state or keep loading false
  }
};

export const getUserGrowthStats = async (days: number) => {
  const res = await api.get("/admin/analytics/user-growth", { params: { days } });
  return res.data;
};

// Coupons Management
export const createCoupon = async (data: any) => {
  const res = await api.post("/admin/coupons", data);
  return res.data;
};

export const assignCouponToUser = async (userId: number, couponCode: string) => {
  const res = await api.post(`/admin/coupons/assign/${userId}`, { code: couponCode });
  return res.data;
};

export const getCoupons = async (params?: any) => {
  const res = await api.get("/admin/coupons", { params });
  return res.data;
};

export const getCouponStats = async () => {
  const res = await api.get("/admin/coupons/stats");
  return res.data;
};

export const updateCoupon = async (id: string, data: any) => {
  const res = await api.patch(`/admin/coupons/${id}`, data);
  return res.data;
};

export const deleteCoupon = async (id: number) => {
  const res = await api.delete(`/admin/coupons/${id}`);
  return res.data;
};

// Bulk Coupon Assignment
export const assignCouponBulk = async (data: { couponCode: string; filters: any }) => {
  const res = await api.post("/admin/coupons/assign-bulk", data);
  return res.data;
};

// Get count of users matching filters (for preview)
export const getFilteredUsersCount = async (filters: any) => {
  const res = await api.post("/admin/users/filter-count", filters);
  return res.data.count || 0;
};

// Get list of users matching filters (for preview)
export const getFilteredUsers = async (params: any) => {
  const res = await api.post("/admin/users/filtered-list", params);
  return res.data.users || res.data || [];
};

// Disputes / Support Tickets Management
export const getDisputes = async (params?: { page?: number; limit?: number; status?: string }) => {
  try {
    const res = await api.get("/admin/support/disputes", { params });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch disputes:", err);
    return [];
  }
};

export const getDisputeById = async (id: number) => {
  try {
    const res = await api.get(`/admin/support/disputes/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch dispute ${id}:`, err);
    return null;
  }
};

export const updateDisputeStatus = async (id: number, data: { status: string; notes?: string }) => {
  const res = await api.patch(`/admin/support/disputes/${id}/status`, data);
  return res.data;
};

export const getDisputeStats = async () => {
  try {
    // If backend returns 500/404 because this endpoint missing/broken
    const res = await api.get("/admin/support/disputes/stats");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch dispute stats:", err);
    return {
      total: 0,
      pending: 0,
      underReview: 0,
      resolved: 0,
      rejected: 0,
    };
  }
};

// Chat APIs
export const getDisputeMessages = async (disputeId: number) => {
  try {
    const res = await api.get(`/admin/support/disputes/${disputeId}/messages`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch messages for dispute ${disputeId}:`, err);
    return [];
  }
};

export const sendDisputeMessage = async (disputeId: number, data: { message?: string, attachmentUrl?: string, attachmentType?: string }) => {
  try {
    const res = await api.post(`/admin/support/disputes/${disputeId}/messages`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to send dispute message:`, err);
    throw err;
  }
};

export const markDisputeMessagesRead = async (disputeId: number) => {
  try {
    const res = await api.patch(`/admin/support/disputes/${disputeId}/messages/read`);
    return res.data;
  } catch (err) {
    console.error(`Failed to mark messages as read:`, err);
    return null;
  }
};

// Live Sessions
export const getLiveSessions = async (type?: string) => {
  const res = await api.get(`/admin/live-sessions${type ? `?type=${type}` : ""}`);
  return res.data;
};

export const getChatHistory = async (id: number) => {
  const res = await api.get(`/admin/live-sessions/${id}/history`);
  return res.data;
};




