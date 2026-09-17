"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

const AskExpertCTA = () => {
  const t = useTranslations("Header");

  return (
    <div className="flex-shrink-0 hidden md:block">
      <Link
        href="/our-experts"
        className="btn-ask-expert inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orange text-white text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 no-underline shadow-xs whitespace-nowrap"
      >
        <Image
          src="/images/chat.svg"
          className="chat-icon filter-white size-3.5 sm:size-4"
          alt="chat"
          width={16}
          height={16}
          style={{ width: "auto", filter: "brightness(0) invert(1)" }}
        />
        {t("askExpert")}
      </Link>
    </div>
  );
};

export default AskExpertCTA;
