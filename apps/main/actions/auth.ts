"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";

export async function loginAction(formData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/client/login`, {
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
    } catch (error) {
        console.error("Login Action Error:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("clientAccessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}

export async function registerAction(registerData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/email/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Registration failed" };
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error("Register Action Error:", error);
        return { error: "An unexpected error occurred" };
    }
}
