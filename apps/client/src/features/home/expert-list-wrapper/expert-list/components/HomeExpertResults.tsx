"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import ExpertSlider from "./ExpertSlider";

export default function HomeExpertResults() {
  const t = useTranslations("Home");

  return (
    <>
      <ExpertSlider />
      <div className="view-all mt-4 md:mt-6">
        <Link
          href="/our-experts"
          className="no-underline bg-orange hover:opacity-90 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit"
        >
          <i className="fa-regular fa-user" />
          {t("expertSection.viewAllExperts")}
        </Link>
      </div>
    </>
  );
}
