"use server";

import { cookies } from "next/headers";
import { createSafeFetchInstance } from "@repo/safe-fetch";
import { getErrorMessage } from "@repo/lib";

export const api = createSafeFetchInstance({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  timeoutMs: 30_000,
});

export async function adminLoginAction(formData: any) {
    // requiredRole backend ko bhejna zaroori hai taaki role validate ho sake
    const [data, error] = await api.post<any>(`/auth/email/login`, {
        ...formData,
        requiredRole: 'admin',
    });

    if (error) {
        return { error: getErrorMessage(error) };
    }


    // Set httpOnly cookies
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';

    if (data.accessToken) {
        cookieStore.set("accessToken", data.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 60 * 15, // 15 minutes
        });
    }

    if (data.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    return { success: true, user: data.user };
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("adminAccessToken"); // Cleanup legacy
    cookieStore.delete("adminRefreshToken"); // Cleanup legacy
    return { success: true };
}
