import React from "react";
import { getTranslations } from "next-intl/server";
import homepageData from "../data/services.data.json";
import ServiceCard from "./service-card";
import { Link } from "@/i18n/navigation";
import { api, API_ROUTES } from "@/actions";
import {
  AstrologyServiceItem,
  PaginatedAstrologyServiceResponse,
} from "@repo/lib";

interface FallbackService {
  id: number | string;
  image: string;
  title: string;
  description?: string;
  link?: string;
  slug?: string;
}

const FALLBACK_SERVICES: FallbackService[] =
  homepageData.astrologyServices || [];

const ExpertServices = async () => {
  const t = await getTranslations("Home");

  // Fetch astrology services from API
  let services: AstrologyServiceItem[] = [];
  try {
    const [res, error] = await api.get<PaginatedAstrologyServiceResponse>(
      `${API_ROUTES.ASTROLOGY.SERVICES}?limit=12&is_active=true&sort_by=sort_order&order=ASC`,
    );
    if (!error && res?.data && res.data.length > 0) {
      services = res.data;
    }
  } catch (err) {
    console.warn(
      "Failed to fetch astrology services from API, using fallback data:",
      err,
    );
  }

  // If no services from API, use fallback data
  const hasApiServices = services.length > 0;

  return (
    <section
      className="py-10 md:py-16 overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/white-background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div
          className="bg-[#f7f3ec] p-5 md:p-6 rounded-[20px] shadow-[0_4px_9px_0_rgba(0,0,0,0.06)]"
          style={{ border: "solid 1px rgba(242,107,0,0.17)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading-premium mb-0 flex">
              <span>{t("services.title")}</span>
            </h2>
            <Link
              href="/free-services"
              className="hidden sm:flex items-center gap-1.5  text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>Explore All Services</span>
              <span>→</span>
            </Link>
          </div>

          <div className="overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-1 pb-1">
              {hasApiServices
                ? services.map((service) => (
                    <div key={service.id} className="mb-2">
                      <Link
                        href="/our-experts"
                        className="block h-full no-underline hover:text-inherit"
                      >
                        <ServiceCard
                          imageSrc={service.image_url}
                          displayTitle={service.title}
                          description={service.description}
                          deliveryType={service.delivery_type}
                          durationMins={service.suggested_duration_mins}
                          icon={service.icon}
                        />
                      </Link>
                    </div>
                  ))
                : FALLBACK_SERVICES.map((service) => {
                    let localizedTitle = service.title;
                    try {
                      localizedTitle = t.has(
                        `services.items.${service.title}` as any,
                      )
                        ? t(`services.items.${service.title}` as any)
                        : service.title;
                    } catch {
                      localizedTitle = service.title;
                    }
                    return (
                      <div key={service.id} className="mb-2">
                        <Link
                          href={service.link || "/our-experts"}
                          className="block h-full no-underline hover:text-inherit"
                        >
                          <ServiceCard
                            imageSrc={service.image}
                            displayTitle={localizedTitle}
                            description={service.description}
                          />
                        </Link>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertServices;
