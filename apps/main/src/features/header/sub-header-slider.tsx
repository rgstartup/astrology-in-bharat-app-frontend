"use client";

import { PATHS } from "@repo/routes";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { headerTranslations, useLanguageStore } from "@repo/store";

// Swiper styles are imported in the root layout.tsx to avoid resolution issues in the shared package.
const SERVICES_DATA_KEYS = [
  {
    id: 1,
    key: "serviceMatchmaking",
    icon: "images/top-icon1.png",
    href: PATHS.MARRIAGE_AGE_CALCULATOR,
    isInternal: true,
  },
  {
    id: 2,
    key: "serviceGunaMilan",
    icon: "images/top-icon2.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 3,
    key: "serviceOnlinePuja",
    icon: "images/top-icon3.png",
    href: PATHS.ONLINE_PUJA,
    isInternal: true,
  },
  {
    id: 4,
    key: "serviceLoveMatch",
    icon: "images/top-icon4.png",
    href: "/love-calculator",
    isInternal: true,
  },
  {
    id: 7,
    key: "serviceMatchAnalysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
];

const SubHeaderSlider = () => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t =
    headerTranslations[lang as keyof typeof headerTranslations] ||
    headerTranslations.en;

  return (
    <header className="bg-orange shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10 relative">
      <div className="max-w-[1320px] mx-auto px-2 lg:px-4 py-[5px]">
        <div className="flex items-center gap-2">
          <div className="custom-swiper-prev flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ce4c04] cursor-pointer transition-all duration-300 shadow-md hover:bg-[#301118] hover:text-white hover:scale-110">
            <i className="fa-solid fa-chevron-left text-xs" />
          </div>

          <div className="flex-1 overflow-hidden">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: ".custom-swiper-prev",
                nextEl: ".custom-swiper-next",
              }}
              spaceBetween={10}
              slidesPerView={2}
              grabCursor={true}
              loop={SERVICES_DATA_KEYS.length > 5}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 25 },
              }}
              className="w-full relative"
            >
              {SERVICES_DATA_KEYS.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="flex justify-center w-full p-[2px] sm:p-[5px]">
                    <a
                      href={service.href}
                      onClick={(e) => {
                        if (
                          service.isInternal &&
                          (service.href as any) !== "#"
                        ) {
                          e.preventDefault();
                          router.push(service.href);
                        }
                      }}
                      className="flex items-center justify-center bg-[#301118] border border-[#fd9d69] px-2 sm:px-3 py-1.5 sm:py-[10px] rounded-lg sm:rounded-xl text-white w-full h-[40px] sm:h-[52px] transition-all duration-300 hover:bg-[#4a1923] hover:border-white hover:-translate-y-0.5 hover:shadow-lg no-underline cursor-pointer"
                    >
                      <Image
                        src={`/${service.icon}`}
                        className="w-[20px] sm:w-[30px] mr-1 flex-shrink-0"
                        alt={(t as any)[service.key] || service.key}
                        width={40}
                        height={40}
                      />
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.3px] text-[10px] sm:text-sm font-bold sm:font-semibold">
                        {(t as any)[service.key] || service.key}
                      </span>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="custom-swiper-next flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ce4c04] cursor-pointer transition-all duration-300 shadow-md hover:bg-[#301118] hover:text-white hover:scale-110">
            <i className="fa-solid fa-chevron-right text-xs" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SubHeaderSlider;
