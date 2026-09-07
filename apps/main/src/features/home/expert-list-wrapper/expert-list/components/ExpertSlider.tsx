"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ExpertCard from "./expert-slider/expert-card";
import { SkeletonCard } from "./expert-slider/SkeletonCard";
import { useExpertListStore } from "@/store/useExpertListStore";

const ExpertSlider = () => {
  const { experts } = useExpertListStore();

  return (
    <div className="relative expert-swiper-wrapper mt-4 px-2 md:px-12">
      <Swiper
        modules={[Navigation, Autoplay]}
        speed={800}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: ".astro-next",
          prevEl: ".astro-prev",
        }}
        breakpoints={{
          480: { slidesPerView: 1.2, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          992: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="astro-swiper !py-4 !pb-0"
      >
        {experts.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`}>
                <SkeletonCard />
              </SwiperSlide>
            ))
          : experts.map((item) => (
              <SwiperSlide key={item.id}>
                <ExpertCard expertData={item} cardClassName="h-full" />
              </SwiperSlide>
            ))}
      </Swiper>

      <button className="astro-prev absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 hidden md:flex items-center justify-center text-orange bg-white shadow-lg rounded-full hover:scale-110 transition cursor-pointer z-10 p-0 border-0">
        <i className="fa-solid fa-chevron-left fa-lg"></i>
      </button>
      <button className="astro-next absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 hidden md:flex items-center justify-center text-orange bg-white shadow-lg rounded-full hover:scale-110 transition cursor-pointer z-10 p-0 border-0">
        <i className="fa-solid fa-chevron-right fa-lg"></i>
      </button>
    </div>
  );
};

export default ExpertSlider;
