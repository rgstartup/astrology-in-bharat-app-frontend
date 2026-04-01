"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";

export async function astrologerLoginAction(formData: any) {
    const [data, error] = await api.post<any>('/auth/login', formData);

    if (error) {
        return { error: error.body?.message || error.message || "Login failed" };
    }

    // Token existence check
    if (!data?.accessToken) {
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
    const [data, error] = await api.post<any>('/auth/email/register', {
        ...formData,
        roles: ["expert"],
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

export async function astrologerVerifyEmailAction(token: string) {
    const [data, error] = await api.get<any>(`/auth/email/verify?token=${encodeURIComponent(token)}`);

    if (error) {
        return { error: error.body?.message || error.message || "Verification failed" };
    }

    // Set HttpOnly cookies on the server
    const cookieStore = await cookies();

    if (data?.accessToken) {
        cookieStore.set("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    if (data?.refreshToken) {
        cookieStore.set("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success: true, user: data?.user, message: data?.message };
}
