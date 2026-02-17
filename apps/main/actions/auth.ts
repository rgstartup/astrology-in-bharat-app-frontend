"use server";

import { cookies } from "next/headers";
import safeFetch from "@packages/safe-fetch/safeFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543";

export async function loginAction(formData: any) {
    const [data, error] = await safeFetch<any>(`${API_BASE_URL}/api/v1/auth/client/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (error) {
        return { error: error.body?.message || error.message || "Login failed" };
    }

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
    }

    if (data.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success: true, user: data.user };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("clientAccessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}

export async function registerAction(registerData: any) {
    const [data, error] = await safeFetch<any>(`${API_BASE_URL}/api/v1/auth/email/register`, {
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
