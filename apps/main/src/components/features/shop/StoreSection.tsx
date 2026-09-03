"use client";

import React, { useState, useMemo, useRef } from "react";
import { StoreCard } from "./StoreCard";
import {
  Store as StoreIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  Swiper as SwiperComp,
  SwiperSlide as SwiperSlideComp,
} from "swiper/react";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import { useAllMerchants } from "@/hooks/useAllMerchants";
import { useMerchantCities } from "@/hooks/useMerchantCities";
import { useDebounce } from "@/hooks/use-debounce";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import { StoreSkeletonCard } from "./StoreSkeletonCard";

import "swiper/css";
import "swiper/css/navigation";

const Swiper = SwiperComp as any;
const SwiperSlide = SwiperSlideComp as any;

const DUMMY_STORES = [
  {
    id: "dummy-store-1",
    name: "my shop",
    address: "MOHALI",
    city: "MOHALI",
    pinCode: "160062",
    contactNumber: "6239408982",
    shopLogo: "/images/dummy-shop.png",
    rating: 0,
    reviewCount: 0,
    is_available: false,
    products: [],
  },
  {
    id: "dummy-store-2",
    name: "Premium Spirituals",
    address: "Delhi",
    city: "Delhi",
    pinCode: "110001",
    contactNumber: "9876543210",
    shopLogo: "/images/dummy-shop.png",
    rating: 4.5,
    reviewCount: 15,
    is_available: true,
    products: [],
  },
  {
    id: "dummy-store-3",
    name: "Vedic Roots Store",
    address: "Mumbai",
    city: "Mumbai",
    pinCode: "400001",
    contactNumber: "9876543211",
    shopLogo: "/images/dummy-shop.png",
    rating: 4.8,
    reviewCount: 22,
    is_available: true,
    products: [],
  },
];

const StoreSection = () => {
  const { lang, t: translationSet } = useHomeTranslations();
  const t = translationSet.storeSection;
  const fontStyle =
    lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: citiesData = [] } = useMerchantCities();
  const uniqueCities = useMemo(
    () => ["all", ...(Array.isArray(citiesData) ? citiesData : [])],
    [citiesData],
  );

  const { data: stores = [], isLoading: isStoresLoading } = useAllMerchants({
    search: debouncedSearch,
    city: selectedCity === "all" ? undefined : selectedCity,
    limit: 10,
  });

  // Use dummy stores if API returns empty (backend down or no stores)
  const displayStores = stores?.length > 0 ? stores : DUMMY_STORES;

  return (
    <section
      id="astrology-store"
      className="pt-6 pb-10 relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 z-20">
          <div
            className="text-white w-full md:w-auto"
            style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
          >
            <h2
              className="section-heading-premium uppercase mb-0"
              style={fontStyle}
            >
              <span>{t.title}</span>
            </h2>
            <p className="text-gray-300 font-medium text-sm mt-4 md:mt-2 max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 relative">
            <div className="relative w-full sm:w-[280px] lg:w-[320px] group">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#1f0b10]/80 border border-[#d95a00] rounded-full text-white placeholder:text-gray-500 hover:border-[#ff6b00] focus:outline-none focus:border-orange-500/50 focus:bg-[#1f0b10] focus:ring-4 focus:ring-[#d95a00]/30 transition-all duration-300 text-sm backdrop-blur-md"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>

            <div className="relative w-full sm:w-[180px]" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-5 py-3.5 bg-[#1f0b10]/80 border border-[#d95a00] rounded-full text-white hover:border-[#ff6b00] focus:outline-none focus:border-orange-500/50 focus:bg-[#1f0b10] focus:ring-4 focus:ring-[#d95a00]/30 transition-all duration-300 text-sm font-medium flex items-center justify-between backdrop-blur-md"
              >
                <span className="truncate mr-2">
                  {selectedCity === "all" ? t.allCities : selectedCity}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-orange-500" : "text-gray-400"}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f0b10] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                    {uniqueCities.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${
                          selectedCity === city
                            ? "bg-orange-500/10 text-orange-500 font-bold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {city === "all" ? t.allCities : city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative group px-2 md:px-12">
          {isStoresLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
              {[1, 2, 3].map((i) => (
                <StoreSkeletonCard key={`store-skeleton-${i}`} />
              ))}
            </div>
          ) : displayStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <StoreIcon className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-white/50 text-lg font-medium">
                No stores found
              </p>
              <p className="text-white/30 text-sm mt-1">
                Check back later for nearby stores
              </p>
            </div>
          ) : (
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Navigation, Autoplay, Mousewheel]}
              spaceBetween={30}
              slidesPerView={1}
              speed={800}
              mousewheel={{
                forceToAxis: false,
                releaseOnEdges: true,
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation={{
                nextEl: ".store-next",
                prevEl: ".store-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="py-6 !pb-2"
            >
              {displayStores.map((store) => (
                <SwiperSlide
                  key={store.id || (store as any)._id}
                  className="h-auto"
                >
                  <StoreCard store={store} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {!isStoresLoading && (
            <>
              <button className="store-prev absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-white shadow-xl hidden md:flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 z-20 active:scale-90 group-hover:scale-110">
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </button>
              <button className="store-next absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 rounded-full bg-white shadow-xl hidden md:flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 z-20 active:scale-90 group-hover:scale-110">
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </>
          )}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <button
            className="inline-flex items-center gap-4 px-12 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-[2rem] font-bold text-sm tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40"
            style={fontStyle}
          >
            <StoreIcon className="w-5 h-5" />
            <span>{t.btnDiscoverAll}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
