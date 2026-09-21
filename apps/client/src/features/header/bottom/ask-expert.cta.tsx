"use client";

import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { PATHS } from "@repo/routes";

const AskExpertCTA = () => {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const isConsultantProfile = /^\/consultants\/[^/]+/.test(pathname || "");

  return (
    <div className="flex-shrink-0 hidden md:block">
      <Link
        href={PATHS.CONSULTANTS.ROOT}
        className={`btn-ask-expert inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 no-underline shadow-xs whitespace-nowrap ${
          isConsultantProfile
            ? "border border-orange/60 text-orange bg-orange/5 hover:bg-orange hover:text-white"
            : "bg-orange text-white"
        }`}
      >
        <Image
          src="/images/chat.svg"
          className={`chat-icon size-3.5 sm:size-4 ${isConsultantProfile ? "" : "filter-white"}`}
          alt="chat"
          width={16}
          height={16}
          style={{ width: "auto", filter: isConsultantProfile ? "none" : "brightness(0) invert(1)" }}
        />
        {t("askExpert")}
      </Link>
    </div>
  );
};

export default AskExpertCTA;
