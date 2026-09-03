"use client";

import Link from "next/link";
import ExpertList, { type ExpertListProps } from ".";
import ExpertSlider from "./components/ExpertSlider";

type HomeExpertListProps = Omit<ExpertListProps, "children">;

export default function HomeExpertList(props: HomeExpertListProps) {
  return (
    <ExpertList {...props}>
      {({ experts, loading, initialError, lang, t }) => (
        <>
          <ExpertSlider
            experts={experts}
            loading={loading}
            initialError={initialError}
            lang={lang}
          />
          <div className="view-all mt-4 md:mt-6">
            <Link
              href="/our-experts"
              className="no-underline bg-orange hover:opacity-90 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit"
            >
              <i className="fa-regular fa-user" />
              {t.expertSection.viewAllExperts}
            </Link>
          </div>
        </>
      )}
    </ExpertList>
  );
}
