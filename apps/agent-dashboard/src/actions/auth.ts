"use server";

import { cookies } from "next/headers";
import { API_CONFIG } from "../lib/api-config";

// ─────────────────────────────────────────────────────────
// LOGIN — Server Action
// Backend High-Standard: cookie name = "agentAccessToken"
// Updated to prevent collision with User/Admin tokens.
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

        // Backend response: { success, token, agent }
        const agent = result.agent || result.user;
        const accessToken = result.token || result.accessToken;
        const refreshToken = result.refreshToken || result.refresh_token;

        if (!accessToken) {
            return { success: false, error: "Login failed — no token in response" };
        }

        // ✅ Set cookies with BOTH names for safety during migration
        const cookieStore = await cookies();

        // 🟢 New Standard
        cookieStore.set("agentAccessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        // 🟡 Legacy Fallback (Wait for backend to catch up)
        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        if (refreshToken) {
            cookieStore.set("agentRefreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
            });
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
// Clears the correct cookie names
// ─────────────────────────────────────────────────────────
export async function agentLogoutAction() {
    const cookieStore = await cookies();

    // Clear exact cookie names for Agent
    cookieStore.delete("agentAccessToken");
    cookieStore.delete("agentRefreshToken");
    cookieStore.delete("accessToken"); // Cleanup legacy
    cookieStore.delete("refreshToken"); // Cleanup legacy

    return { success: true };
}
