"use server";

import { cookies } from "next/headers";
import safeFetch from "@packages/safe-fetch/safeFetch";

import { getApiUrl } from "@/src/utils/api-config";

const API_BASE_URL = getApiUrl();

export async function adminLoginAction(formData: any) {
    const [data, error] = await safeFetch<any>(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (error) {
        return { error: error.body?.message || error.message || "Login failed" };
    }

    // Admin role check on server
    const isAdmin = data?.user?.roles?.some(
        (r: any) => (typeof r === 'string' ? r : r.name).toUpperCase() === "ADMIN"
    );

    if (!isAdmin) {
        return { error: "Access denied: Not an administrator" };
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

    if (data.accessToken) {
        cookieStore.set("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    if (data.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success: true, user: data.user };
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}
