"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Monitor, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import { PujaCard } from "@/components/features/puja/PujaCard";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";

const OnlinePujaPage = () => {
    const [pujas, setPujas] = useState<ExpertPuja[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'home_visit'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPujaName, setSelectedPujaName] = useState("All Pujas");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { isClientAuthenticated } = useAuthStore();
    const { fetchWishlist } = useWishlistStore();

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

    useEffect(() => {
        fetchWishlist(isClientAuthenticated);
    }, [isClientAuthenticated, fetchWishlist]);

    const uniquePujaNames = ["All Pujas", ...Array.from(new Set(pujas.map(p => p.name)))];

    const filteredPujas = pujas.filter(puja => {
        const matchesType = typeFilter === 'all' || 
                            (typeFilter === 'online' && puja.is_online) || 
                            (typeFilter === 'home_visit' && puja.is_home_visit);
        const matchesSearch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (puja.expert?.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (puja.districts?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesDropdown = selectedPujaName === "All Pujas" || puja.name === selectedPujaName;
        return matchesType && matchesSearch && matchesDropdown;
    });

    return (
        <div className="min-h-screen bg-[#301118]">
            {/* Header Section */}
            <div className="bg-[#301118] pt-24 pb-12 px-4 border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-full text-sm font-bold mb-6 animate-fade-in border border-orange-500/20">
                        <Sparkles className="w-4 h-4" />
                        Sacred Vedic Rituals
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Experience the Divine with <span className="text-orange-500">Sacred Pujas</span>
                    </h1>
                    <p className="text-orange-100/60 max-w-2xl mx-auto text-lg font-medium">
                        Connect with highly experienced Vedic pandits for personalized rituals at your home or online.
                    </p>
                </div>
            </div>

            {/* Sticky Filters Section */}
            <div className="sticky top-20 z-40 bg-[#301118]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-4 px-4 transition-all">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6">
                    
                    {/* Toggle Switch */}
                    <div className="flex bg-black/30 p-1.5 rounded-2xl w-full lg:w-auto shadow-inner border border-white/5">
                        <button 
                            onClick={() => setTypeFilter('all')}
                            className={`flex-1 lg:flex-none lg:px-6 py-2 rounded-xl text-sm font-bold transition-all ${typeFilter === 'all' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 transform scale-[1.02]' : 'text-gray-400 hover:text-white'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setTypeFilter('online')}
                            className={`flex-1 lg:flex-none lg:px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${typeFilter === 'online' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 transform scale-[1.02]' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Monitor className="w-4 h-4" />
                            Online
                        </button>
                        <button 
                            onClick={() => setTypeFilter('home_visit')}
                            className={`flex-1 lg:flex-none lg:px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${typeFilter === 'home_visit' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 transform scale-[1.02]' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MapPin className="w-4 h-4" />
                            Home Visit
                        </button>
                    </div>

                    {/* Search & Dropdown Group */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full grow">
                        {/* Search Bar */}
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/50" />
                            <input 
                                type="text"
                                placeholder="Search by puja, pandit, or district..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 text-white rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium placeholder:text-gray-500 shadow-2xl"
                            />
                        </div>

                        {/* Puja Dropdown */}
                        <div className="relative w-full sm:w-64">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-black/40 border border-white/10 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none font-bold text-gray-300 shadow-2xl transition-all"
                            >
                                <span className="truncate">{selectedPujaName}</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-full bg-[#301118] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                    {uniquePujaNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setSelectedPujaName(name);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 hover:text-white transition-colors ${selectedPujaName === name ? 'text-orange-500 bg-black/20' : 'text-gray-400'}`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto py-12 px-4 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                        <p className="text-orange-200/40 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Invoking Divine Blessings</p>
                    </div>
                ) : filteredPujas.length === 0 ? (
                    <div className="text-center py-32 bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">No Pujas Found</h2>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => {
                                setTypeFilter('all');
                                setSearchQuery("");
                                setSelectedPujaName("All Pujas");
                            }}
                            className="mt-6 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-900/40 hover:translate-y-[-2px]"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {filteredPujas.map((puja) => (
                            <PujaCard key={puja.id} puja={puja} />
                        ))}
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .animate-spin-slow { animation: spin 3s linear infinite; }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OnlinePujaPage;
