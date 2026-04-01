"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { Loader2, Search, ChevronDown } from "lucide-react";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import { PujaCard } from "./PujaCard";
import { useLanguageStore } from "@/store/languageStore";
import { Swiper as SwiperComp, SwiperSlide as SwiperSlideComp } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Swiper = SwiperComp as any;
const SwiperSlide = SwiperSlideComp as any;

const PujaListSection = () => {
    const { lang } = useLanguageStore();
    const [pujas, setPujas] = useState<ExpertPuja[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPujaName, setSelectedPujaName] = useState("All Pujas");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPujasItems = async () => {
            setLoading(true);
            const [res, error] = await http.get<ExpertPuja[]>(API_ROUTES.EXPERT.GET_ALL_PUJAS);
            
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

    const uniquePujaNames = ["All Pujas", ...Array.from(new Set(pujas.map(p => p.name)))];

    const filteredPujas = pujas.filter(puja => {
        const matchesSearch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (puja.expert?.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (puja.districts?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesDropdown = selectedPujaName === "All Pujas" || puja.name === selectedPujaName;
        return matchesSearch && matchesDropdown;
    });

    return (
        <section
            className="py-[50px] relative overflow-hidden"
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
                <div className="relative mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-20">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Book Sacred Pujas
                        </h2>
                        <div className="w-48 h-1 bg-orange-600"></div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 relative">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500/50" />
                            <input 
                                type="text"
                                placeholder="Search puja or pandit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm placeholder:text-gray-500"
                            />
                        </div>

                        {/* Puja Category Dropdown */}
                        <div className="relative w-full sm:w-56" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-bold text-gray-300 transition-all"
                            >
                                <span className="truncate pr-2">{selectedPujaName}</span>
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
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                        <p className="text-orange-200/40 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Pujas</p>
                    </div>
                ) : filteredPujas.length === 0 ? (
                    <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">No Pujas Found</h2>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="relative puja-swiper-wrapper mt-4 md:px-12 mb-8 z-10">
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
                        className="py-4 !pb-8"
                      >
                        {filteredPujas.map((puja) => (
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
                    <div className="view-all mt-8 text-center">
                        <Link
                            href="/online-puja"
                            className="no-underline bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit active:scale-95 shadow-orange-900/40 hover:translate-y-[-2px]"
                        >
                            <i className="fa-solid fa-om text-lg"></i>
                            View All Sacred Rituals
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PujaListSection;
