"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";
const API_BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export async function astrologerLoginAction(formData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Login failed" };
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
    } catch (error) {
        console.error("Astrologer Login Action Error:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function astrologerRegisterAction(formData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/email/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formData,
                roles: ["expert"],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Registration failed" };
        }

        return { success: true, message: "Registration successful. Please verify your email." };
    } catch (error) {
        console.error("Astrologer Register Action Error:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function astrologerLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}
