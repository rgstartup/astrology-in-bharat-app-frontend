"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export interface TestimonialReview {
  id?: string;
  user?: { name?: string; avatar?: string };
  rating?: number;
  comment?: string;
  text?: string;
  tags?: string[];
}

export default function TestimonialCarousel({
  reviews,
  emptyMessage,
}: {
  reviews: TestimonialReview[];
  emptyMessage: string;
}) {
  if (reviews.length === 0) {
    return (
      <div className="col-span-full py-10 text-center text-gray-400 font-medium italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      speed={800}
      grabCursor
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      }}
      className="!pb-10 !pt-4"
    >
      {reviews.map((testimonial, index) => (
        <SwiperSlide key={testimonial.id ?? index} className="h-auto">
          <div className="group bg-white rounded-[18px] p-6 transition-all duration-300 border border-orange/30 shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-orange hover:bg-orange hover:-translate-y-1.5 flex flex-col h-full mx-1 mt-1">
            <div className="flex items-center mb-4">
              {testimonial.user?.avatar ? (
                <Image
                  src={testimonial.user.avatar}
                  alt={testimonial.user.name ?? "User"}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange p-0.5"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange text-orange font-bold text-xl uppercase shrink-0">
                  {testimonial.user?.name?.charAt(0) ?? "U"}
                </div>
              )}
              <div className="ml-4">
                <h5 className="text-lg font-bold text-[#32131a] group-hover:text-white transition-colors duration-300 m-0">
                  {testimonial.user?.name}
                </h5>
                <span className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 font-medium">
                  Verified User
                </span>
              </div>
            </div>
            <div className="text-orange group-hover:text-white transition-colors duration-300 text-2xl mb-2 tracking-[2px]">
              {"★".repeat(testimonial.rating ?? 0)}
            </div>
            {testimonial.tags && testimonial.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {testimonial.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange/5 group-hover:bg-white/20 text-orange group-hover:text-white text-[10px] font-bold rounded-full border border-orange/20 group-hover:border-white/30 transition-colors duration-300 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-[15px] leading-relaxed italic mb-4 flex-grow">
              “{testimonial.comment ?? testimonial.text}”
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
