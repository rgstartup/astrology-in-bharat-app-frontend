import Link from "next/link";
import ConsultationCard from "@/components/features/services/ConsultationCard";
import { getTranslations } from "next-intl/server";
import homepageData from "./data/homepage.json";
import type Home from "@messages/en/home.json";

type TConsultationServiceTitle = keyof typeof Home.consultant.items;

const ExpertConsultant = async () => {
  const t = await getTranslations("Home");

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-black mb-[35px] relative pb-[15px] text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#a9a9a92b] after:w-full">
            <span className="relative after:content-[''] after:bg-orange after:w-full after:h-[2px] after:absolute after:left-0 after:bottom-[-15px]">
              {t("consultant.title")}
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {homepageData.consultationServices.map((service) => (
              <div key={service.id}>
                <Link
                  href={`/our-experts?specializations=${encodeURIComponent(service.title)}`}
                  className="block no-underline hover:text-inherit"
                >
                  <ConsultationCard
                    item={{
                      ...service,
                      id: String(service.id),
                      title: service.title as TConsultationServiceTitle,
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertConsultant;
