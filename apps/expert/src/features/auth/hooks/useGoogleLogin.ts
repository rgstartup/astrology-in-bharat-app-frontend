"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { API_ROUTES } from "@/utils/api.routes";

export interface UseGoogleLoginOptions {
  callback_url?: string;
  callbackUrl?: string;
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

  const callback_url =
    customCallbackUrl ||
    searchParams.get("callback_url") ||
    searchParams.get("callbackUrl") ||
    "/dashboard";

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const message =
        errorParam === "google_auth_failed"
          ? "Google login failed. Please try again."
          : decodeURIComponent(errorParam);

      if (onError) {
        onError(message);
      } else {
        toast.error(message);
      }

      // Clean up error query param from URL
      router.replace(pathname);
    }
  }, [searchParams, router, pathname, onError]);

  const handleGoogleLogin = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUri =
      typeof window !== "undefined"
        ? `${window.location.origin}${callback_url.startsWith("/") ? callback_url : `/${callback_url}`}`
        : "";

    const googleLoginUrl = `${baseUrl}${API_ROUTES.AUTH.LOGIN.GOOGLE}?redirect_uri=${encodeURIComponent(redirectUri)}`;

    if (typeof window !== "undefined") {
      window.location.href = googleLoginUrl;
    }
  }, [callback_url]);

  return {
    handleGoogleLogin,
  };
}

export default useGoogleLogin;
