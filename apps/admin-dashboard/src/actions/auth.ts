"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543/api/v1";
const API_BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export async function adminLoginAction(formData: any) {
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
    } catch (error) {
        console.error("Admin Login Action Error:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}
