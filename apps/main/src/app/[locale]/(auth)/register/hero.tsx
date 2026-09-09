import authContent from "@/features/auth/data/auth-content.json";
import { getTranslations } from "next-intl/server";
import React from "react";

const HeroComponent = async () => {
  const t = await getTranslations("Auth");
  const { signUp } = authContent;

  return (
    <div className="mb-8">
      <h3 className="text-[20px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-extrabold leading-tight mb-4 whitespace-nowrap tracking-tight md:tracking-normal">
        <span className="text-[#301118]">{t("signUp.title")}</span>{" "}
        {t("signIn.brandTo")}{" "}
        <span className="text-orange">{t("signIn.brandName")}</span>
      </h3>
      <p className="text-black text-base md:text-lg leading-relaxed font-medium">
        {signUp.description}
      </p>
      <p className="text-gray-800 mt-4 font-medium">{t("signUp.subtitle")}</p>
    </div>
  );
};

export default HeroComponent;
