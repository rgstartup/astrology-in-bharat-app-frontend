"use client";

import React from "react";
import { PATHS } from "@repo/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getPathnameOrDefault } from "@/utils/getPathnameOrDefault";

const AuthCTA = (props: { show: boolean }) => {
  const pathname = usePathname();
  const t = useTranslations("Header");

  const signInText = t("signIn");
  const signUpText = t("register");

  if (!props.show) return null;

  return (
    <div className="flex gap-1.5 sm:gap-3">
      <Link
        href={`${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(getPathnameOrDefault(pathname, "/client/profile"))}`}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signInText}
      </Link>

      <Link
        href={`${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(getPathnameOrDefault(pathname, "/client/profile"))}`}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signUpText}
      </Link>
    </div>
  );
};

export default AuthCTA;
