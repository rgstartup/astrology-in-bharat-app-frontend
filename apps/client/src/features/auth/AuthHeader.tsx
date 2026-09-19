"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface AuthHeaderProps {
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ subtitle }) => {
  const t = useTranslations("Auth");

  return (
    <div className="mb-6 sm:mb-7">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Image
            src="/images/Expert.png"
            alt="Astrology in Bharat"
            width={44}
            height={44}
            className="size-10 sm:size-11 object-contain"
            priority
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
            {subtitle}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange to-[#EA580C] tracking-tight leading-tight">
            {t("signIn.brandName")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
