"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ExpertSlider from "./ExpertSlider";

export default function HomeExpertResults() {
  const t = useTranslations("Home");

  return (
    <>
      <ExpertSlider />
      <div className="view-all mt-6 md:mt-8 text-center">
        <Link
          href="/consultants"
          className="btn-primary !rounded-full !px-8 !py-3.5 !text-sm font-bold shadow-xl shadow-orange/20 transition-all inline-flex items-center gap-2.5"
        >
          <i className="fa-regular fa-user" />
          <span>
            {t("expertSection.viewAllExperts") || "Explore All Experts"}
          </span>
        </Link>
      </div>
    </>
  );
}
