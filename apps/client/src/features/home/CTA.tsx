import GuidanceCTA from "@/components/ui/GuidanceCTA";
import { getTranslations } from "next-intl/server";

const CTA = async () => {
  const t = await getTranslations("Home.cta");
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <GuidanceCTA
          subtitle=""
          title={t("title")}
          description={t("subtitle")}
          buttonText={t("btn")}
          buttonLink="/our-experts"
          buttonIcon="fa-solid fa-comments"
        />
      </div>
    </section>
  );
};

export default CTA;
