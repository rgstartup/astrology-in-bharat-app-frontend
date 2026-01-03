import { api } from "@/src/lib/api";

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};
