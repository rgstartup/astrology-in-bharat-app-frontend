"use client";

import { api } from "@/lib/api";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";
import { liveDarshanTranslations } from "@/lib/live-darshan-translations";
import { getYoutubeEmbedUrl } from "@/utils/video-utils";
import { useLanguageStore } from "@/store/languageStore";
import { DarshanSite } from "@/lib/types";

const LiveDarshanPage = () => {
    const { lang, toggleLang } = useLanguageStore();
    const t = liveDarshanTranslations[lang as keyof typeof liveDarshanTranslations] || liveDarshanTranslations.en;

    const [selectedSite, setSelectedSite] = useState<DarshanSite | null>(null);
    const [darshanSites, setDarshanSites] = useState<DarshanSite[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDarshanSites = async () => {
            try {
                // Use the Next.js proxy rewrite (/api/v1 → backend) so the request
                // stays on 'self' origin and doesn't violate CSP.
                const [result, fetchError] = await api.get<any>(`/live-darshan`);

                if (fetchError) {
                    throw new Error('Network response from backend was not ok');
                }

                if (result?.success && result?.data) {
                    setDarshanSites(result.data);
                } else {
                    console.error("Invalid response format from backend API", result);
                }
            } catch (error) {
                console.error("Failed to fetch Live Darshan sites from backend", error);

                // Fallback dummy data if backend server is not running locally yet
                const fallbackImg = "/images/kashi.jpg";
                const images = [
                    fallbackImg,
                    fallbackImg,
                    fallbackImg,
                    fallbackImg,
                    fallbackImg,
                    fallbackImg
                ];
                const vids = [
                    "https://www.youtube.com/embed/live?channel=UCdMj2twWfMHXrWgX5oVdoyA", // Kashi Vishwanath
                    "https://www.youtube.com/embed/live?channel=UCW6GqPknjYIgrgPBx1L9yKQ", // Mahakaleshwar
                    "https://www.youtube.com/embed/live?channel=UCT1egsvA08YcdMLiEu1DTRg", // Somnath
                    "https://www.youtube.com/embed/live?channel=UCA99DrZabMr0ZncelhO6TkQ", // Siddhivinayak
                    "https://www.youtube.com/embed/live?channel=UCKGvJDh7g_Kzocbwy7aKicA", // Shirdi Sai Baba
                    "https://www.youtube.com/embed/live?channel=UCAA6IsLVfbHrP1I_lzxv09Q"  // ISKCON Vrindavan
                ];

                const localizedSites: DarshanSite[] = t.sites.map((site, index) => ({
                    id: site.id,
                    name: site.name as string,
                    location: site.location as string,
                    description: site.description as string,
                    image: (images[index] || images[0]) as string,
                    status: t.statusLive as string,
                    videoUrl: (vids[index] || vids[0]) as string
                }));

                setDarshanSites(localizedSites);
            } finally {
                setLoading(false);
            }
        };

        fetchDarshanSites();
    }, [lang]);

    const filteredDarshanSites = darshanSites.filter(site => {
        const query = searchQuery.toLowerCase();
        return site.name.toLowerCase().includes(query) || site.location.toLowerCase().includes(query);
    });

    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-64 bg-slate-200"></div>
                    <div className="p-8">
                        <div className="w-24 h-6 bg-slate-200 rounded-full mb-4"></div>
                        <div className="w-3/4 h-8 bg-slate-200 rounded mb-2"></div>
                        <div className="w-1/2 h-4 bg-slate-200 rounded mb-6"></div>
                        <div className="w-full h-16 bg-slate-200 rounded mb-6"></div>
                        <div className="w-full h-12 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Hero Header */}
            <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-brown text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange rounded-full blur-[100px]"></div>
                </div>

                {/* Language Switcher — top right inside hero */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-sm hover:scale-105 active:scale-95"
                        title={t.switchLangLabel}
                    >
                        <span className="text-base">{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
                        {t.switchLang}
                    </button>
                </div>

                <div className="container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold uppercase tracking-widest mb-6 transition-all hover:bg-orange/20">
                        {t.badge}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-8 tracking-tight text-white leading-tight">
                        {t.heroTitle} <span className="text-orange drop-shadow-sm">{t.heroHighlight}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-body leading-relaxed mb-10">
                        {t.heroDesc}
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <i className="fa-solid fa-search text-orange"></i>
                        </div>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 rounded-full py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:bg-white/15 transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto py-20 px-4">
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDarshanSites.length > 0 ? (
                            filteredDarshanSites.map((site, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={site.image}
                                            alt={site.name}
                                            fill
                                            unoptimized
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as any;
                                                target.src = "/images/kashi.jpg";
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${site.status === "Live Now" || site.status === "अभी लाइव" ? "bg-red-500 text-white" : "bg-gray-500 text-white"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                {site.status}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <i className="fa-solid fa-location-dot text-orange text-xs"></i>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {site.location}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-brown mb-4 group-hover:text-orange transition-colors">
                                            {site.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-8 h-10 overflow-hidden text-ellipsis">
                                            {site.description}
                                        </p>
                                        <button
                                            onClick={() => setSelectedSite(site)}
                                            className="w-full bg-orange hover:bg-brown text-white py-4 rounded-2xl font-bold text-xs transition-all duration-300 uppercase tracking-widest shadow-lg shadow-orange/20 hover:shadow-brown/20 flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-solid fa-play text-[10px]"></i>
                                            {t.startViewing}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                                <div className="w-24 h-24 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className="fa-solid fa-search text-3xl text-orange"></i>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-brown mb-2">{t.noTemplesFound}</h3>
                                <p className="text-gray-500 font-body">{t.noTemplesDesc.replace("{query}", searchQuery)}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Video Modal */}
            {selectedSite && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}
                >
                    <div className="relative w-full max-w-5xl bg-brown rounded-[40px] overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up">
                        <button
                            onClick={() => setSelectedSite(null)}
                            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>

                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={`${getYoutubeEmbedUrl(selectedSite.videoUrl)}?autoplay=1`}
                                title={selectedSite.name}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-orange uppercase tracking-widest">
                                        {t.modal.liveFrom.replace("{location}", selectedSite.location)}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white">{selectedSite.name}</h2>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                    {t.modal.share}
                                </button>
                                <button className="px-8 py-3 bg-orange hover:bg-white text-white hover:text-brown rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                                    {t.modal.bookPuja}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <WhyChooseUs />
            <CTA />
        </div>
    );
};

export default LiveDarshanPage;
