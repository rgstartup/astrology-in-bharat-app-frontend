"use client";

import React from "react";
import NextImage from "next/image";
import { Swiper as Sw, SwiperSlide as Ss } from "swiper/react";
const Swiper = Sw as any;
const SwiperSlide = Ss as any;
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="w-full lg:w-1/2">
      <div className="relative group">
        {/* Main Swiper */}
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
          className="rounded-[2.5rem] overflow-hidden shadow-premium mb-6 border border-gray-100 bg-gray-50/50 transition-all group-hover:shadow-2xl duration-500"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                <NextImage
                  src={img}
                  fill
                  className="object-contain mix-blend-multiply drop-shadow-xl"
                  alt={`Product Image ${idx + 1}`}
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-white shadow-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-orange hover:text-white">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="gallery-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-orange hover:text-white">
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* Thumbnail Swiper */}
        <Swiper
          spaceBetween={12}
          slidesPerView={images.length > 4 ? 4 - 0.2 : images.length}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbnail-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:border-orange transition-all duration-300 bg-gray-50 flex items-center justify-center">
                <NextImage
                  src={img}
                  fill
                  className="object-contain mix-blend-multiply p-2"
                  alt={`Thumbnail ${idx + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style jsx global>{`
        .thumbnail-swiper .swiper-slide-thumb-active .relative {
          border-color: #f97316 !important;
          background: white !important;
          box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Gallery;
