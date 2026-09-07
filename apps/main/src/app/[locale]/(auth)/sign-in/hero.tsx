import authContent from "@/features/auth/data/auth-content.json";
import React, { use } from "react";
import { getLocale, getTranslations } from "next-intl/server";
const HeroComponent = () => {
  const { signIn } = authContent;
  const t = use(getTranslations("Auth"));
  const lang = use(getLocale());

  return (
    <div className="mb-8">
      <h3
        className="text-[20px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-extrabold leading-tight mb-4 whitespace-nowrap tracking-tight md:tracking-normal"
        style={{
          fontFamily:
            lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
        }}
      >
        <span className="text-[#301118]">{t("signIn.brandTitle")}</span>{" "}
        {t("signIn.brandTo")}{" "}
        <span className="text-orange">{t("signIn.brandName")}</span>
      </h3>
      <p
        className="text-black text-base md:text-lg leading-relaxed font-medium"
        style={{
          fontFamily:
            lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
        }}
      >
        {signIn.description1} {signIn.description2}
      </p>
    </div>
  );
};

export default HeroComponent;
