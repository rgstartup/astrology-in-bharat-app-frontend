"use client";

import React from "react";
import Image from "next/image";
import {
  useGoogleLogin,
  UseGoogleLoginOptions,
} from "@/hooks/use-google-login";
import { useTranslations } from "next-intl";

export interface GoogleLoginButtonProps extends UseGoogleLoginOptions {
  callback_url?: string;
  callbackUrl?: string;
  text?: string;
  className?: string;
  disabled?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  callback_url,
  callbackUrl,
  role = "client",
  onError,
  text,
  className,
  disabled = false,
}) => {
  const t = useTranslations("Auth");

  const { handleGoogleLogin } = useGoogleLogin({
    callback_url: callback_url || callbackUrl,
    role,
    onError,
  });

  return (
    <button
      type="button"
      disabled={disabled}
      className={
        className ||
        "flex items-center justify-center gap-2.5 w-full border border-stone-200 hover:border-stone-300 rounded-full h-11 px-4 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all duration-200 cursor-pointer text-xs sm:text-sm group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs"
      }
      onClick={handleGoogleLogin}
    >
      <Image
        src="/images/google-color-svgrepo-com.svg"
        alt="Google"
        height={18}
        width={18}
        className="group-hover:scale-105 transition-transform"
      />
      <span className="font-semibold text-foreground text-xs sm:text-sm">
        {text || t("signIn.google")}
      </span>
    </button>
  );
};

export default GoogleLoginButton;
