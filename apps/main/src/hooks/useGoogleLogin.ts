"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";
import { API_ROUTES } from "@/actions";

export interface UseGoogleLoginOptions {
  callbackUrl?: string;
  role?: string;
  onError?: (error: string) => void;
}

export function useGoogleLogin(options: UseGoogleLoginOptions = {}) {
  const { callbackUrl: customCallbackUrl, onError } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
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

      const showErrorMessage = onError ?? toast.error;

      showErrorMessage(message);
      // Clean up URL
      router.replace(pathname);
    }
  }, [searchParams, router, t, onError]);

  const handleGoogleLogin = useCallback(() => {
    const safeCallback =
      !callbackUrl || callbackUrl === "undefined"
        ? "/client/profile"
        : callbackUrl;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const googleLoginUrl = `${baseUrl}${API_ROUTES.AUTH.CLIENT.GOOGLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`;

    router.push(googleLoginUrl);
  }, [callbackUrl]);

  return {
    handleGoogleLogin,
  };
}

export default useGoogleLogin;
