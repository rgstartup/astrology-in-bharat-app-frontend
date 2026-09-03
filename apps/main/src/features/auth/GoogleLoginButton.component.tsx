"use client";

import React from "react";
import Image from "next/image";
import { useLanguageStore } from "@repo/store";
import { authTranslations } from "@/lib/translations/auth";
import {
  useGoogleLogin,
  UseGoogleLoginOptions,
} from "@/hooks/use-google-login";

export interface GoogleLoginButtonProps extends UseGoogleLoginOptions {
  text?: string;
  className?: string;
  disabled?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  callbackUrl,
  role = "client",
  onError,
  text,
  className,
  disabled = false,
}) => {
  const { lang } = useLanguageStore();
  const t =
    authTranslations[lang as keyof typeof authTranslations] ||
    authTranslations.en;

  const { handleGoogleLogin } = useGoogleLogin({
    callbackUrl,
    role,
    onError,
  });

  return (
    <button
      type="button"
      disabled={disabled}
      className={
        className ||
        "flex items-center justify-center gap-3 w-full border-2 border-gray-100 rounded-2xl py-3 px-6 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
      }
      onClick={handleGoogleLogin}
    >
      <Image
        src="/images/google-color-svgrepo-com.svg"
        alt="Google"
        height={20}
        width={20}
        className="group-hover:scale-110 transition-transform"
      />
      <span className="font-bold text-gray-600 text-sm">
        {text || t.signIn.google}
      </span>
    </button>
  );
};

export default GoogleLoginButton;
