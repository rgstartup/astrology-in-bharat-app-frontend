"use server";

import { cookies } from "next/headers";
import { API_CONFIG } from "../lib/api-config";

// ─────────────────────────────────────────────────────────
// LOGIN — Server Action
// Cookie names: unified "accessToken" / "refreshToken" for all roles.
// Role is embedded inside the JWT payload — no need for separate cookie names.
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

        // ✅ Unified cookie names — role is read from JWT, not from cookie name
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
// Clears unified cookie names
// ─────────────────────────────────────────────────────────
export async function agentLogoutAction() {
    const cookieStore = await cookies();

    // Clear unified cookie names
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
}
