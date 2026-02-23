"use server";

import { cookies } from "next/headers";
import { API_CONFIG } from "../lib/api-config";

// ─────────────────────────────────────────────────────────
// LOGIN — Server Action
// Cookie names: standard "accessToken" / "refreshToken".
// ─────────────────────────────────────────────────────────
export async function agentLoginAction(data: any) {
    try {
        const response = await fetch(API_CONFIG.AUTH.LOGIN.url, {
            method: API_CONFIG.AUTH.LOGIN.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.message || result.error || "Invalid credentials or server error"
            };
        }

        // Backend response: { accessToken, refreshToken, agent }
        const agent = result.agent || result.user;
        const accessToken = result.accessToken;
        const refreshToken = result.refreshToken;

        if (!accessToken) {
            return { success: false, error: "Login failed — no token in response" };
        }

        // ✅ Standard cookie names — matches backend
        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        if (refreshToken) {
            cookieStore.set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return { success: true, user: agent };

    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Network error"
        };
    }
}

// ─────────────────────────────────────────────────────────
// LOGOUT — Server Action
// Clears standard cookie names
// ─────────────────────────────────────────────────────────
export async function agentLogoutAction() {
    const cookieStore = await cookies();

    // Clear standard cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // Clear legacy role-specific cookies (cleanup)
    cookieStore.delete("agentAccessToken");
    cookieStore.delete("agentRefreshToken");

    return { success: true };
}
