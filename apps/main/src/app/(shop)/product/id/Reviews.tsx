"use client";

import React from "react";
import NextImage from "next/image";
import { Swiper as Sw, SwiperSlide as Ss } from "swiper/react";
const Swiper = Sw as any;
const SwiperSlide = Ss as any;
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";

interface ReviewStat {
  stars: number;
  count: number;
}

interface ReviewsProps {
  avgRating: number;
  totalRatings: number;
  reviewStats: ReviewStat[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) =>
  Array.from({ length: 5 }, (_, i) => (
    <i
      key={i}
      className={`fas fa-star text-xs ${i < rating ? "text-orange" : "text-gray-200"}`}
    ></i>
  ));

const Reviews: React.FC<ReviewsProps> = ({
  avgRating,
  totalRatings,
  reviewStats,
}) => {
  return (
    <section className="py-24 space-y-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Customer Feedback
          </h2>
          <div className="w-24 h-1.5 bg-orange rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Summary Stats */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <h1 className="text-7xl font-black text-gray-900 tracking-tighter italic">
                {avgRating}
              </h1>
              <div className="flex justify-center lg:justify-start gap-1.5 scale-125 origin-left">
                <StarRating rating={avgRating} />
              </div>
              <p className="text-gray-400 font-bold text-sm tracking-wide pt-2">
                Based on {totalRatings.toLocaleString()} verified ratings
              </p>
            </div>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange transition-all shadow-xl hover:shadow-orange/20">
              Share Your Story
            </button>
          </div>

          {/* Progress Bars */}
          <div className="lg:col-span-8 space-y-4 bg-gray-50/50 p-8 md:p-12 rounded-[3rem] border border-gray-100">
            {reviewStats.map((r, idx) => (
              <div className="flex items-center gap-6" key={idx}>
                <div className="flex items-center gap-2 w-16 shrink-0">
                  <span className="text-sm font-black text-gray-900">{r.stars}</span>
                  <i className="fa-solid fa-star text-[10px] text-orange"></i>
                </div>
                <div className="flex-grow h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className="h-full bg-orange rounded-full transition-all duration-1000"
                    style={{ width: `${(r.count / totalRatings) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-400 w-20 text-right">
                  {r.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-widest">
            Recent Stories
          </h3>
          <p className="text-gray-400 font-bold">Real experiences from our global community</p>
        </div>
        
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              nextEl: ".rev-next",
              prevEl: ".rev-prev",
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {[
              {
                name: "Amit Sharma",
                img: "/images/dummy-expert.jpg",
                rating: 5,
                text: "The moment I put on this bracelet, I felt a shift in my energy. It's beautiful and powerful. Fast delivery and excellent quality.",
              },
              {
                name: "Priya Verma",
                img: "/images/dummy-expert.jpg",
                rating: 4,
                text: "A truly beautiful product. The packaging was exquisite, and the positive vibes were immediate. Highly recommend to anyone seeking balance.",
              },
              {
                name: "Rohit Mehta",
                img: "/images/dummy-expert.jpg",
                rating: 5,
                text: "Impeccable quality and authenticity. The design is so elegant, it feels like it was made just for me. A must-have for daily wear.",
              },
              {
                name: "Sneha Patel",
                img: "/images/dummy-expert.jpg",
                rating: 5,
                text: "I've been wearing it for a month, and I've noticed a significant improvement in my focus and overall well-being. Thank you for this magical piece!",
              },
            ].map((review, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-full p-8 md:p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group/card">
                  <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden mb-8 border-4 border-white shadow-xl group-hover/card:scale-110 transition-transform duration-500">
                    <NextImage
                      src={review.img}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-center gap-1">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-500 font-bold italic leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="pt-4">
                      <h5 className="text-lg font-black text-gray-900 mb-1 leading-none uppercase tracking-widest">
                        {review.name}
                      </h5>
                      <p className="text-[10px] font-black text-orange uppercase tracking-[0.2em]">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Nav for Testimonials */}
          <button className="rev-prev absolute left-0 top-[40%] -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-gray-900 border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 transition-all duration-300 hover:bg-orange hover:text-white">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="rev-next absolute right-0 top-[40%] -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-gray-900 border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 transition-all duration-300 hover:bg-orange hover:text-white">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
