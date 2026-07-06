"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
    Search, MapPin, Monitor, ChevronDown, Loader2, 
    ShieldCheck, Sparkles, Star, Users, BookOpen, 
    ThumbsUp, PhoneCall, MessageCircle, HeartHandshake, CheckCircle2
} from "lucide-react";
import OnlinePujaSeoContent from "./online-puja-seo.component";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import { PujaCard } from "@/components/features/puja/PujaCard";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@repo/store";
import { pujaTranslations } from "@/lib/translations/puja";
import Link from "next/link";

const OnlinePujaPage = () => {
    const { lang } = useLanguageStore();
    const t = (pujaTranslations[lang as "en" | "hi"] || pujaTranslations.en);
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

    const [pujas, setPujas] = useState<ExpertPuja[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'home_visit'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPujaName, setSelectedPujaName] = useState(t.filters.allPujas);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { isAuthenticated } = useAuthStore();
    const { fetchWishlist } = useWishlistStore();

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

    useEffect(() => {
        fetchWishlist(isAuthenticated);
    }, [isAuthenticated, fetchWishlist]);

    const uniquePujaNames = [t.filters.allPujas, ...Array.from(new Set(pujas.map(p => p.name)))];

    const filteredPujas = pujas.filter(puja => {
        const matchesType = typeFilter === 'all' || 
                            (typeFilter === 'online' && puja.is_online) || 
                            (typeFilter === 'home_visit' && puja.is_home_visit);
        const matchesSearch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (puja.expert?.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (puja.districts?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesDropdown = selectedPujaName === t.filters.allPujas || puja.name === selectedPujaName;
        return matchesType && matchesSearch && matchesDropdown;
    });

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-['Inter',sans-serif]">
            
            {/* Top Banner Section */}
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-8">
                <div className="relative w-full h-[220px] sm:h-[300px] md:h-[420px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image 
                        src="/images/online-puja-banner.png" 
                        alt="Online Puja Banner" 
                        fill 
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            {/* Filters Section */}
            <div className="max-w-7xl mx-auto px-4 mb-10 z-30 relative">
                <div className="bg-white rounded-2xl border border-[#FF5500] shadow-sm overflow-hidden">
                    
                    {/* Row 1 on mobile: Mode Toggle */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 md:border-b-0 md:border-r md:w-auto">
                        <span className="text-sm font-bold text-gray-800 shrink-0">Mode</span>
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1 flex-1 md:flex-none">
                            <button 
                                onClick={() => setTypeFilter('all')}
                                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${typeFilter === 'all' ? 'bg-[#FF5500] text-white shadow-sm' : 'text-gray-900 hover:text-black'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setTypeFilter('online')}
                                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-all ${typeFilter === 'online' ? 'bg-[#FF5500] text-white shadow-sm' : 'text-gray-900 hover:text-black'}`}
                            >
                                Online
                            </button>
                            <button 
                                onClick={() => setTypeFilter('home_visit')}
                                className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-bold transition-all ${typeFilter === 'home_visit' ? 'bg-[#FF5500] text-white shadow-sm' : 'text-gray-900 hover:text-black'}`}
                            >
                                Home Visit
                            </button>
                        </div>
                    </div>

                    {/* Row 2 on mobile: Search + Dropdown side by side */}
                    <div className="flex flex-col sm:flex-row md:flex-row md:flex-1">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-100">
                        <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/20 transition-colors">
                            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-3" />
                            <input 
                                type="text"
                                placeholder="Search Puja, Pandit or City"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Select Dropdown */}
                    <div className="relative flex-1 min-w-0 px-4 py-3" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-gray-700">
                                <Sparkles className="w-4 h-4 text-[#FF5500]" />
                                <span className="font-bold text-sm truncate">{selectedPujaName}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto">
                                {uniquePujaNames.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => {
                                            setSelectedPujaName(name);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-orange-50 transition-colors ${selectedPujaName === name ? 'text-[#FF5500] bg-orange-50/50' : 'text-gray-700'}`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    </div> {/* end Row 2 flex */}
                </div> {/* end filter container */}
            </div> {/* end filters section */}



            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900 border-b-2 border-transparent" style={fontStyle}>Popular Puja</h2>
                    <span className="text-sm font-bold text-gray-500 mb-1">{pujas.length}+ Puja Available</span>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-[#FF5500] animate-spin" />
                        <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Loading Pujas...</p>
                    </div>
                ) : filteredPujas.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Pujas Found</h2>
                        <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria.</p>
                        <button 
                            onClick={() => {
                                setTypeFilter('all');
                                setSearchQuery("");
                                setSelectedPujaName(t.filters.allPujas);
                            }}
                            className="mt-6 px-6 py-2.5 bg-[#FF5500] text-white font-bold rounded-xl hover:bg-[#E64D00] transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredPujas.map((puja) => (
                            <PujaCard key={puja.id} puja={puja} />
                        ))}
                    </div>
                )}
            </div>

            {/* Why Choose Our Online Puja */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Image 
                    src="/images/why-choose-puja-banner.png" 
                    alt="Why Choose Our Online Puja" 
                    width={1280}
                    height={256}
                    className="w-full h-auto"
                />
            </div>

            {/* Bottom CTA Banner */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <section className="bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
                    </div>
                    <div className="relative z-10 w-full text-center md:text-left">
                        <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
                        <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
                            Need Help in Choosing Right Puja?
                        </h3>
                        <p className="text-white/60 text-sm mt-1">
                            Talk to our expert astrologers and get personalized recommendation for your needs.
                        </p>
                    </div>
                    <Link
                        href="/our-experts"
                        className="relative z-10 flex-shrink-0 bg-[#F26500] hover:bg-[#D95A00] text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm"
                    >
                        <MessageCircle className="w-4 h-4" /> Talk to Astrologer
                    </Link>
                </section>
            </div>

            {/* SEO Content */}
            <OnlinePujaSeoContent />

        </div>
    );
};

export default OnlinePujaPage;
