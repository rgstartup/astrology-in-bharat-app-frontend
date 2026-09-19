"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { API_ROUTES } from "@/actions";
import { useTranslations } from "next-intl";
import { stripLocale } from "@/utils/getPathnameOrDefault";

export interface UseGoogleLoginOptions {
  callback_url?: string;
  callbackUrl?: string;
  role?: string;
  onError?: (error: string) => void;
}

export function useGoogleLogin(options: UseGoogleLoginOptions = {}) {
  const {
    callback_url: customCallbackUrlSnake,
    callbackUrl: customCallbackUrlCamel,
    onError,
  } = options;
  const customCallbackUrl = customCallbackUrlSnake || customCallbackUrlCamel;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const t = useTranslations("Auth");

  const callback_url = stripLocale(
    customCallbackUrl ||
      searchParams.get("callback_url") ||
      searchParams.get("callbackUrl") ||
      "/client/profile",
  );

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const message =
        errorParam === "google_auth_failed"
          ? t("signIn.errors.googleFailed")
          : decodeURIComponent(errorParam);

      const showErrorMessage = onError ?? toast.error;

      showErrorMessage(message);
      // Clean up URL
      router.replace(pathname);
    }
  }, [searchParams, router, t, onError]);

  const handleGoogleLogin = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const googleLoginUrl = `${baseUrl}${API_ROUTES.AUTH.CLIENT.GOOGLE_LOGIN}?redirect_uri=${encodeURIComponent(callback_url)}`;

    router.push(googleLoginUrl);
  }, [callback_url]);

  return {
    handleGoogleLogin,
  };
}

export default useGoogleLogin;
