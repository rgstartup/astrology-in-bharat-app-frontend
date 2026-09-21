"use client";

import React from "react";
import { PATHS } from "@repo/routes";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getPathnameOrDefault, withCallbackUrl } from "@/utils/getPathnameOrDefault";

const AuthCTA = (props: { show: boolean }) => {
  const pathname = usePathname();
  const t = useTranslations("Header");

  const signInText = t("signIn");
  const signUpText = t("register");

  if (!props.show) return null;

  const callback = getPathnameOrDefault(pathname, "/client/profile");

  return (
    <div className="flex gap-1.5 sm:gap-3">
      <Link
        href={withCallbackUrl(PATHS.LOGIN, callback)}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signInText}
      </Link>

      <Link
        href={withCallbackUrl(PATHS.REGISTER, callback)}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signUpText}
      </Link>
    </div>
  );
};

export default AuthCTA;
