"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Star } from "lucide-react";
import { ExpertPuja } from "@/lib/types/puja";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { useLanguageStore } from "@/store/languageStore";
import { pujaTranslations, pujaContent } from "@/lib/translations/puja";

const LikeButton = ({ pujaId, initialLikes, t, fontStyle }: { pujaId: number; initialLikes: number; t: any; fontStyle: any }) => {
    const { isClientAuthenticated } = useAuthStore();
    const { isPujaInWishlist } = useWishlistStore();
    const { toggleLike } = useWishlist();
    
    const isLiked = isPujaInWishlist(pujaId);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isClientAuthenticated) {
            toast.error(t.toastLike, { style: fontStyle });
            return;
        }

        toggleLike({ id: pujaId, type: "puja", isLiked });
    };

    return (
        <button 
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 transition-all active:scale-110 hover:opacity-80"
        >
            <Heart 
                className={`w-5 h-5 transition-all ${isLiked ? "fill-[#f54a00] text-[#f54a00]" : "text-gray-400 group-hover:text-gray-600"}`} 
            />
            <span className={`text-xs font-black ${isLiked ? "text-[#f54a00]" : "text-gray-400"}`}>
                {initialLikes + (isLiked ? 1 : 0)}
            </span>
        </button>
    );
};

interface PujaCardProps {
    puja: ExpertPuja;
}

export const PujaCard: React.FC<PujaCardProps> = ({ puja }) => {
    const { lang } = useLanguageStore();
    const translationSet = (pujaTranslations[lang as "en" | "hi"] || pujaTranslations.en) as any;
    const t = translationSet.card;
    const content: Record<string, string> = pujaContent[lang as "en" | "hi"] || pujaContent.en;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

    const localizedName = content[puja.name] || puja.name;
    const localizedDescription = content[puja.name + "_desc"] || puja.description || t.descriptionFallback;

    const getMinCost = (puja: ExpertPuja) => {
        const costs = [
            puja.online_cost,
            puja.home_visit_with_samagri_cost,
            puja.home_visit_without_samagri_cost
        ].filter(cost => cost > 0);
        return costs.length > 0 ? Math.min(...costs) : 0;
    };

    return (
        <Link 
            href={`/online-puja/${puja.id}`}
            className="group flex flex-col bg-white rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(251,146,60,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer no-underline h-full"
        >
            {/* Puja Image */}
            <div className="relative h-44 sm:h-48 bg-gray-100 overflow-hidden shrink-0">
                 {puja.puja_image_url ? (
                    <Image 
                        src={puja.puja_image_url} 
                        alt={localizedName} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105 duration-700"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <Sparkles className="w-10 h-10 text-orange-200" />
                    </div>
                 )}
                 
                 {/* Availability Badges */}
                 <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {puja.is_online && (
                        <span className="px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-wider rounded-md border border-blue-400/30" style={fontStyle}>
                            {t.online}
                        </span>
                    )}
                    {puja.is_home_visit && (
                        <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-wider rounded-md border border-emerald-400/30" style={fontStyle}>
                            {t.homeVisit}
                        </span>
                    )}
                 </div>
            </div>
            <div className="p-4 sm:p-5 flex flex-col grow">
                {/* Header: Name + Like */}
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight" style={fontStyle}>
                        {localizedName}
                    </h3>
                    <div className="pt-0.5">
                        <LikeButton pujaId={puja.id} initialLikes={puja.total_likes || 0} t={t} fontStyle={fontStyle} />
                    </div>
                </div>

                {/* Expert Info & Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <div className="relative w-5 h-5 rounded-md overflow-hidden ring-1 ring-gray-100 shrink-0">
                            {puja.expert?.user?.avatar ? (
                                <Image src={puja.expert.user.avatar} alt="Pandit" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#301118]/80 text-white text-[8px] flex items-center justify-center font-bold">
                                    P
                                </div>
                            )}
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide" style={fontStyle}>
                            {t.by} {puja.expert?.user?.name || t.verifiedPandit}
                        </span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-0.5 text-yellow-600">
                        <Star className="w-3 h-3 fill-yellow-600" />
                        <span className="text-[11px] font-black">{puja.expert?.rating || "4.8"}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-[40px] mb-4" style={fontStyle}>
                    {localizedDescription}
                </p>

                {/* Footer: Price + Action */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5" style={fontStyle}>{t.dakshina}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-gray-900">₹{getMinCost(puja)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all" style={fontStyle}>
                        {t.ritualDetails}
                    </div>
                </div>
            </div>
        </Link>
    );
};
