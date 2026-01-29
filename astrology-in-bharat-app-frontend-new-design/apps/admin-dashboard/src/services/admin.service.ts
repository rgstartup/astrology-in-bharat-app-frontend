import { api } from "@/src/lib/api";

export const getUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const getUserStats = async () => {
  const res = await api.get("/admin/users/stats");
  return res.data;
};

export const getExperts = async (params?: { page?: number; limit?: number; search?: string }) => {
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
