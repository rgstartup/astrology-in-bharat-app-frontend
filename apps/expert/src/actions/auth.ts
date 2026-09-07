"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";

export async function expertLoginAction(formData: any) {
    const [data, error] = await api.post<any>('/auth/login', {
        ...formData,
        requiredRole: "expert"
    });

    if (error) {
        return { error: getErrorMessage(error) || "Login failed" };
    }

    // Token existence check
    if (!data?.accessToken) {
        return { error: "No access token received" };
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

export async function expertInitiateRegistrationAction(email: string) {
    const [data, error] = await api.post<any>('/auth/email/register/initiate', {
        email,
        role: "expert",
    });

    if (error) {
        return { error: getErrorMessage(error) || "Registration failed" };
    }

    return { success: true, message: "Verification email sent successfully." };
}

export async function expertCompleteRegistrationAction(formData: any) {
    const [data, error] = await api.post<any>('/auth/email/register/complete', formData);

    if (error) {
        return { error: getErrorMessage(error) || "Profile completion failed" };
    }

    // Set HttpOnly cookies on the server since they are now fully registered
    const cookieStore = await cookies();

    if (data?.tokens?.accessToken) {
        cookieStore.set("accessToken", data.tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    if (data?.tokens?.refreshToken) {
        cookieStore.set("refreshToken", data.tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success: true, user: data?.user, message: "Profile completed successfully" };
}

export async function expertLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
}

export async function expertVerifyEmailAction(token: string) {
    const [data, error] = await api.get<any>(`/auth/email/verify?token=${encodeURIComponent(token)}`);

    if (error) {
        return { error: getErrorMessage(error) || "Verification failed" };
    }

    // Set HttpOnly cookies on the server
    const cookieStore = await cookies();

    const isFullyRegistered = !!data?.user?.name;

    if (isFullyRegistered) {
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
    }

    return { success: true, user: data?.user, message: data?.message };
}

export async function expertForgotPasswordAction(email: string, origin: string) {
    const [data, error] = await api.post<any>(`/auth/forgot/password`, { email, origin });

    if (error) {
        return { error: getErrorMessage(error) || "Failed to send reset link" };
    }

    return { success: true, message: "Password reset link sent successfully" };
}

export async function expertResetPasswordAction(password: string, token: string) {
    const [data, error] = await api.post<any>(`/auth/reset/password?token=${token}`, { password });

    if (error) {
        return { error: getErrorMessage(error) || "Failed to reset password" };
    }

    return { success: true, message: "Password reset successful" };
}
