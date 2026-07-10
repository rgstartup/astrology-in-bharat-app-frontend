"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { Loader2, Search, ChevronDown } from "lucide-react";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import { PujaCard } from "./PujaCard";
import { useLanguageStore } from "@repo/store";
import { pujaTranslations, pujaContent } from "@/lib/translations/puja";
import { Swiper as SwiperComp, SwiperSlide as SwiperSlideComp } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { PujaSkeletonCard } from "./PujaSkeletonCard";

const Swiper = SwiperComp as any;
const SwiperSlide = SwiperSlideComp as any;

const DUMMY_PUJAS: any[] = [
    {
        id: "dummy-puja-1",
        expert_id: "dummy-1",
        puja_id: "p1",
        price: 199,
        name: "Hanuman Chalisa Path",
        description: "Hanuman Chalisa Path for peace, prosperity and protection from evil eyes.",
        puja_mode: "Online, Offline",
        districts: ["All India"],
        image: "/images/pooja/pooja1.png",
        expert: {
            user: {
                name: "Astrology Ravi Rai",
                avatar: "/images/dummy-expert.jpg"
            },
            experience_in_years: 5,
            rating: 4.8
        }
    },
    {
        id: "dummy-puja-2",
        expert_id: "dummy-2",
        puja_id: "p2",
        price: 501,
        name: "Navgraha Shanti Puja",
        description: "Pacify the nine planets and remove obstacles from your life.",
        puja_mode: "Online",
        districts: ["All India"],
        image: "/images/pooja/pooja2.png",
        expert: {
            user: {
                name: "Pandit Sharma",
                avatar: "/images/dummy-expert.jpg"
            },
            experience_in_years: 12,
            rating: 4.9
        }
    },
    {
        id: "dummy-puja-3",
        expert_id: "dummy-3",
        puja_id: "p3",
        price: 251,
        name: "Saraswati Puja",
        description: "Seek blessings of Goddess Saraswati for knowledge and wisdom.",
        puja_mode: "Offline",
        districts: ["Delhi", "Mumbai"],
        image: "/images/pooja/pooja1.png",
        expert: {
            user: {
                name: "Acharya Vivek",
                avatar: "/images/dummy-expert.jpg"
            },
            experience_in_years: 8,
            rating: 4.7
        }
    }
];

const PujaListSection = () => {
    const { lang } = useLanguageStore();
    const t = pujaTranslations[lang as "en" | "hi"] || pujaTranslations.en;
    const content = (pujaContent[lang as "en" | "hi"] || pujaContent.en) as any;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};
    
    const [pujas, setPujas] = useState<ExpertPuja[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPujaName, setSelectedPujaName] = useState(t.filters.allPujas);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPujasItems = async () => {
            setLoading(true);
            const [res, error] = await http.get<ExpertPuja[]>(API_ROUTES.EXPERT.GET_ALL_PUJAS) as any;
            
            if (error) {
                console.error("Failed to fetch pujas:", error);
                setPujas([]);
            } else {
                setPujas(res || []);
            }
            setLoading(false);
        };
        fetchPujasItems();
    }, []);

    // Reset selectedPujaName when language changes to ensure it shows "All Pujas" in correct language
    useEffect(() => {
        setSelectedPujaName(t.filters.allPujas);
    }, [lang, t.filters.allPujas]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const uniquePujaNames = [t.filters.allPujas, ...Array.from(new Set(pujas.map(p => p.name)))];

    const filteredPujas = pujas.filter(puja => {
        const matchesSearch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (puja.expert?.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (puja.districts?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesDropdown = selectedPujaName === t.filters.allPujas || puja.name === selectedPujaName;
        return matchesSearch && matchesDropdown;
    });

    const displayPujas = !loading && filteredPujas.length > 0 && filteredPujas.length < 3
        ? [...filteredPujas, ...DUMMY_PUJAS.slice(0, 3 - filteredPujas.length)]
        : !loading && filteredPujas.length === 0 && searchQuery === "" && selectedPujaName === t.filters.allPujas
            ? DUMMY_PUJAS
            : filteredPujas;

    return (
        <section
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
                <div className="relative mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 z-20">
                    <div className="text-white mb-0 md:mb-2 w-full md:w-auto" style={{ '--heading-border-color': 'rgba(255,255,255,0.2)' } as any}>
                        <h2 className="section-heading-premium mb-0" style={fontStyle}>
                            <span>{t.page.title} <span className="text-orange-600">{t.page.titleHighlight}</span></span>
                        </h2>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 relative">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                            <input 
                                type="text"
                                placeholder={t.filters.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#d95a00] text-white rounded-xl focus:ring-2 focus:ring-[#d95a00]/30 hover:border-[#ff6b00] outline-none transition-all text-sm placeholder:text-gray-300"
                                style={fontStyle}
                            />
                        </div>

                        {/* Puja Category Dropdown */}
                        <div className="relative w-full sm:w-48 md:w-56" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-[#d95a00] rounded-xl focus:ring-2 focus:ring-[#d95a00]/30 hover:border-[#ff6b00] outline-none text-sm font-bold text-white transition-all"
                                style={fontStyle}
                            >
                                <span className="truncate pr-2">{selectedPujaName === t.filters.allPujas ? t.filters.allPujas : (content[selectedPujaName] || selectedPujaName)}</span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180 text-orange-500' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-full md:w-64 bg-[#301118] border border-white/10 rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto animate-in fade-in z-50">
                                    {uniquePujaNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setSelectedPujaName(name);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-600 hover:text-white transition-colors ${selectedPujaName === name ? 'text-orange-500 bg-black/20 font-bold' : 'text-gray-400 font-medium'}`}
                                            style={fontStyle}
                                        >
                                            {name === t.filters.allPujas ? t.filters.allPujas : (content[name] || name)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading && pujas.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={`puja-skeleton-${i}`} className="w-full h-full">
                                <PujaSkeletonCard />
                            </div>
                        ))}
                    </div>
                ) : filteredPujas.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={`empty-puja-skeleton-${i}`} className="w-full h-full">
                                <PujaSkeletonCard />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative puja-swiper-wrapper mt-4 md:px-12 mb-0 z-10">
                      <Swiper
                        modules={[Navigation, Autoplay]}
                        speed={800}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation={{
                          nextEl: ".puja-next",
                          prevEl: ".puja-prev",
                        }}
                        breakpoints={{
                          480: { slidesPerView: 1.2, spaceBetween: 15 },
                          640: { slidesPerView: 2, spaceBetween: 20 },
                          992: { slidesPerView: 3, spaceBetween: 20 },
                          1200: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                        className="py-4 !pb-2"
                      >
                        {displayPujas.map((puja) => (
                           <SwiperSlide key={puja.id} className="h-auto">
                               <PujaCard puja={puja} />
                           </SwiperSlide>
                        ))}
                      </Swiper>
                      
                      <button className="puja-prev absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 hidden md:flex items-center justify-center text-orange-600 bg-white shadow-lg rounded-full hover:scale-110 transition cursor-pointer z-10 p-0 border-0">
                        <i className="fa-solid fa-chevron-left fa-lg"></i>
                      </button>
                      <button className="puja-next absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 hidden md:flex items-center justify-center text-orange-600 bg-white shadow-lg rounded-full hover:scale-110 transition cursor-pointer z-10 p-0 border-0">
                        <i className="fa-solid fa-chevron-right fa-lg"></i>
                      </button>
                    </div>
                )}

                {!loading && (
                    <div className="view-all mt-6 md:mt-8 text-center">
                        <Link
                            href="/online-puja"
                            className="no-underline bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit active:scale-95 shadow-orange-900/40 hover:translate-y-[-2px]"
                            style={fontStyle}
                        >
                            <i className="fa-solid fa-om text-lg"></i>
                            {t.page.viewAll}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PujaListSection;
