"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const AskExpertCTA = () => {
  const t = useTranslations("Header");

  return (
    <div className="flex-shrink-0 hidden md:block">
      <Link
        href="/our-experts"
        className="btn-ask-expert bg-orange text-white transition-all hover:scale-105 active:scale-95"
        style={{
          padding: "10px 20px",
          borderRadius: "25px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          whiteSpace: "nowrap",
        }}
      >
        <Image
          src="/images/chat.svg"
          className="chat-icon filter-white"
          alt="chat"
          width={20}
          height={20}
          style={{ width: "auto", filter: "brightness(0) invert(1)" }}
        />
        {t("askExpert")}
      </Link>
    </div>
  );
};

export default AskExpertCTA;
