"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";

export interface UseGoogleLoginOptions {
  callbackUrl?: string;
  role?: string;
  onError?: (error: string) => void;
}

export function useGoogleLogin(options: UseGoogleLoginOptions = {}) {
  const { callbackUrl: customCallbackUrl, role = "client", onError } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguageStore();

  const t =
    authTranslations[lang as keyof typeof authTranslations] ||
    authTranslations.en;

  const callbackUrl =
    customCallbackUrl || searchParams.get("callbackUrl") || "/client/profile";

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const message =
        errorParam === "google_auth_failed"
          ? t.signIn.errors.googleFailed
          : decodeURIComponent(errorParam);
      if (onError) {
        onError(message);
      } else {
        toast.error(message);
      }
      // Clean up URL
      router.replace(window.location.pathname);
    }
  }, [searchParams, router, t, onError]);

  const handleGoogleLogin = useCallback(() => {
    const safeCallback =
      !callbackUrl || callbackUrl === "undefined"
        ? "/client/profile"
        : callbackUrl;

    const redirectUri = new URL(
      safeCallback,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000",
    ).toString();

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
    const googleLoginUrl = `${baseUrl}/auth/google/login?role=${encodeURIComponent(role)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    console.log(
      "[DEBUG] NEXT_PUBLIC_API_URL:",
      process.env.NEXT_PUBLIC_API_URL,
    );
    console.log("[DEBUG] redirectUri:", redirectUri);
    console.log("[DEBUG] Redirecting to:", googleLoginUrl);

    router.push(googleLoginUrl);
  }, [callbackUrl, role]);

  return {
    handleGoogleLogin,
  };
}

export default useGoogleLogin;
