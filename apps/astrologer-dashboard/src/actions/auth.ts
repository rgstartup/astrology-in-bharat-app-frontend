"use server";

import { cookies } from "next/headers";
import safeFetch from "@packages/safe-fetch/safeFetch";

import { CLIENT_API_URL, BACKEND_URL } from "@/lib/config";
const API_URL = CLIENT_API_URL;
const API_BASE_URL = BACKEND_URL;

export async function astrologerLoginAction(formData: any) {
    const [data, error] = await safeFetch<any>(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (error) {
        return { error: error.body?.message || error.message || "Login failed" };
    }

    // Token existence check
    if (!data.accessToken) {
        return { error: "No access token received" };
    }

    // Role check - Ensure user is an EXPERT (Astrologer)
    const isExpert = data?.user?.roles?.some(
        (r: any) => (typeof r === 'string' ? r : r.name).toUpperCase() === "EXPERT"
    );

    if (!isExpert) {
        return { error: "Access denied: Not an expert account" };
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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

export async function astrologerRegisterAction(formData: any) {
    const [data, error] = await safeFetch<any>(`${API_BASE_URL}/api/v1/auth/email/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...formData,
            roles: ["expert"],
        }),
    });

    if (error) {
        return { error: error.body?.message || error.message || "Registration failed" };
    }

    return { success: true, message: "Registration successful. Please verify your email." };
}

export async function astrologerLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}
