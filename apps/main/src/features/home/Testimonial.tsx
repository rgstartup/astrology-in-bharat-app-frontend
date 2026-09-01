"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api as http } from "@/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslations } from "next-intl";
const dummyReviews = [
  {
    id: "d1",
    user: { name: "Rahul Sharma", avatar: "" },
    rating: 5,
    comment:
      "The consultation was eye-opening. The astrologer was very accurate about my past and gave practical remedies for my career.",
    tags: ["Career", "Accurate Predictions"],
  },
  {
    id: "d2",
    user: { name: "Priya Desai", avatar: "" },
    rating: 5,
    comment:
      "I booked a Vastu visit for my new home. The expert was very knowledgeable and suggested simple changes without breaking anything.",
    tags: ["Vastu", "Helpful"],
  },
  {
    id: "d3",
    user: { name: "Amit Verma", avatar: "" },
    rating: 4,
    comment:
      "Got my Kundali matched here. The process was smooth and the pandit ji explained everything in detail.",
    tags: ["Kundali", "Detailed"],
  },
  {
    id: "d4",
    user: { name: "Neha Singh", avatar: "" },
    rating: 5,
    comment:
      "The online puja experience was truly divine. I felt the positive energy even from miles away. Highly recommended!",
    tags: ["Online Puja", "Divine Experience"],
  },
];

const Testimonial = () => {
  const t = useTranslations("Home");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [data, err] = await http.get(
          "/reviews/platform/approved?limit=6",
        );
        console.log("[Testimonial] API Response:", { data, err });
        if (!err && Array.isArray(data)) {
          setReviews(data.length > 0 ? data : dummyReviews);
          data.forEach((r: any, i: number) => {
            console.log(`[Testimonial] Review ${i} User:`, r.user);
          });
        } else {
          setReviews(dummyReviews);
        }
      } catch (error) {
        console.warn("⚠️ Failed to fetch testimonials:", error);
        setReviews(dummyReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <h2 className="text-xl md:text-[32px] font-semibold mb-[35px] relative pb-[15px] text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#a9a9a92b] after:w-full">
            <span className="relative after:content-[''] after:bg-orange after:w-full after:h-[2px] after:absolute after:left-0 after:bottom-[-15px]">
              {t("testimonials.title")}
            </span>
          </h2>
          <div className="py-2">
            {loading ? (
              // Loading Skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-full">
                    <div className="bg-white rounded-[18px] p-6 border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] animate-pulse">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                        <div className="ml-4 space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-5/6 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                speed={800}
                grabCursor={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="!pb-10 !pt-4"
              >
                {reviews.map((testi, index) => (
                  <SwiperSlide key={testi.id || index} className="h-auto">
                    <div className="group bg-white rounded-[18px] p-6 transition-all duration-300 border border-orange/30 shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-orange hover:bg-orange hover:-translate-y-1.5 flex flex-col h-full mx-1 mt-1">
                      <div className="flex items-center mb-4">
                        {testi.user?.avatar ? (
                          <Image
                            src={testi.user.avatar}
                            alt={testi.user.name}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover border-2 border-orange p-0.5"
                            onError={(e) =>
                              console.error(
                                `[Testimonial] Image Load Error for ${testi.user.name}:`,
                                testi.user.avatar,
                              )
                            }
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange text-orange font-bold text-xl uppercase shrink-0">
                            {testi.user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="ml-4">
                          <h5 className="text-lg font-bold text-[#32131a] group-hover:text-white transition-colors duration-300 m-0">
                            {testi.user?.name}
                          </h5>
                          <span className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 font-medium">
                            Verified User
                          </span>
                        </div>
                      </div>
                      <div className="text-orange group-hover:text-white transition-colors duration-300 text-2xl mb-2 tracking-[2px]">
                        {"★".repeat(testi.rating)}
                      </div>
                      {testi.tags && testi.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {testi.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-orange/5 group-hover:bg-white/20 text-orange group-hover:text-white text-[10px] font-bold rounded-full border border-orange/20 group-hover:border-white/30 transition-colors duration-300 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-[15px] leading-relaxed italic mb-4 flex-grow">
                        "{testi.comment || testi.text}"
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400 font-medium italic">
                Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
