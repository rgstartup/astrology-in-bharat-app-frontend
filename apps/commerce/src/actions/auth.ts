"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";

export async function merchantLoginAction(formData: any) {
    const [data, error] = await api.post<any>('/auth/merchant/login', formData);

    if (error) {
        return { error: getErrorMessage(error) || "Login failed" };
    }

    // Token existence check
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;

    if (!accessToken) {
        return { error: "No access token received" };
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (refreshToken) {
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success: true, user: data.user };
}

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
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
    
    return { success: true };
}

export async function merchantInitiateRegistrationAction(email: string) {
    const [data, error] = await api.post<any>('/auth/email/register/initiate', {
        email,
        role: "merchant",
    });

    if (error) {
        return { error: getErrorMessage(error) || "Registration failed" };
    }

    return { success: true, message: data?.message || "Verification email sent successfully." };
}

export async function merchantCompleteRegistrationAction(payload: any) {
    const [data, error] = await api.post<any>('/auth/email/register/complete', payload);

    if (error) {
        return { error: getErrorMessage(error) || "Profile completion failed" };
    }

    const accessToken = data?.accessToken || data?.token;
    const refreshToken = data?.refreshToken;

    if (accessToken) {
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
    }

    return { success: true, user: data?.user, message: data?.message };
}

export async function merchantLogoutAction() {
    try {
        await api.post<any>('/auth/merchant/logout');
    } catch (err) {
        console.error("Backend logout failed, proceeding with local cleanup:", err);
    }
    
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}

export async function merchantForgotPasswordAction(email: string) {
    const [data, error] = await api.post<any>(`/auth/merchant/forgot-password`, { email });

    if (error) {
        return { error: getErrorMessage(error) || "Failed to send reset link" };
    }

    return { success: true, message: data.message || "Password reset link sent successfully" };
}
