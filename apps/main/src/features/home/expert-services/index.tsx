import { getTranslations } from "next-intl/server";
import homepageData from "../data/services.data.json";
import ServiceCard from "./service-card";
import Link from "next/link";
import type HomeMessages from "@messages/en/home.json";

type ServiceTitle = keyof typeof HomeMessages.services.items;

type Service = {
  id: number;
  image: string;
  title: ServiceTitle;
};

const services = homepageData.astrologyServices as Service[];

const ExpertServices = async () => {
  const t = await getTranslations("Home");

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)] mt-4">
          <h2 className="section-heading-premium">
            <span>{t("services.title")}</span>
          </h2>
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1 pb-1">
              {services.map((service) => (
                <div key={service.id} className="mb-4">
                  <Link
                    href="/our-experts"
                    className="block h-full no-underline hover:text-inherit"
                  >
                    <ServiceCard
                      imageSrc={service.image}
                      displayTitle={t(`services.items.${service.title}`)}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertServices;
