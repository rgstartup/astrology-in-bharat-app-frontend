import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:3001",
});

export type Session = typeof authClient.$Infer.Session;
export type AuthUser = (typeof authClient.$Infer.Session)["user"];
