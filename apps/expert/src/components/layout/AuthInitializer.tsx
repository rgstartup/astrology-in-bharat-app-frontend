"use client";

import { AuthProvider, type IAuthProviderProps } from "@/providers/AuthProvider";

export const AuthInitializer = ({
  children,
  initialUser = null,
}: IAuthProviderProps) => {
  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
};

export default AuthInitializer;
