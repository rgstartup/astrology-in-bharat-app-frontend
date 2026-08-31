"use client";

import { PATHS } from "@repo/routes";
import { HeaderTranslations } from "@repo/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AuthCTA = (props: { t: HeaderTranslations; show: boolean }) => {
  const pathname = usePathname();

  const signInText = props.t.signIn;
  const signUpText = props.t.register;

  if (!props.show) return null;

  return (
    <div className="flex gap-1.5 sm:gap-3">
      <Link
        href={`${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname === "/" ? "/client/profile" : pathname)}`}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signInText}
      </Link>

      <Link
        href={`${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(pathname === "/" ? "/client/profile" : pathname)}`}
        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {signUpText}
      </Link>
    </div>
  );
};

export default AuthCTA;
