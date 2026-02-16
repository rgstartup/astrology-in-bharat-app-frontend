import { api } from "@/src/lib/api";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  return res.data;
};



