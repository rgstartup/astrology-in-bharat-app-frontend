"use server";

import { cookies } from "next/headers";
import safeFetch from "@packages/safe-fetch/safeFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543";
// Clean the base URL to remove /api/v1 if it exists
const CLEAN_API_BASE = API_URL.replace(/\/api\/v1\/?$/, "");

export async function loginAction(formData: any) {
    console.log("[loginAction] Attempting login for:", formData.email);
    const [data, error] = await safeFetch<any>(`${CLEAN_API_BASE}/api/v1/auth/client/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (error) {
        console.error("[loginAction] Login failed:", error);
        return { error: error.body?.message || error.message || "Login failed" };
    }

    console.log("[loginAction] Login successful for:", formData.email);

    // Set httpOnly cookies
    const cookieStore = await cookies();

    if (data.accessToken) {
        cookieStore.set("clientAccessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        console.log("[loginAction] clientAccessToken cookie set.");
    }

    if (data.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        console.log("[loginAction] refreshToken cookie set.");
    }

    return { success: true, user: data.user };
}

export async function logoutAction() {
    console.log("[logoutAction] Attempting logout.");
    const cookieStore = await cookies();
    cookieStore.delete("clientAccessToken");
    cookieStore.delete("refreshToken");
    console.log("[logoutAction] Cookies deleted.");
    return { success: true };
}

export async function registerAction(registerData: any) {
    console.log("[registerAction] Attempting registration for:", registerData.email);
    const [data, error] = await safeFetch<any>(`${CLEAN_API_BASE}/api/v1/auth/email/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
    });

    if (error) {
        return { error: error.body?.message || error.message || "Registration failed" };
    }

    return { success: true, message: data.message };
}
