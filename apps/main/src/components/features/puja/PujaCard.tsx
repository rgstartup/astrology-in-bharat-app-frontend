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
import { useLanguageStore } from "@repo/store";
import { pujaTranslations, pujaContent } from "@/lib/translations/puja";
import { useRouter, usePathname } from "next/navigation";

const LikeButton = ({ pujaId, initialLikes, t, fontStyle }: { pujaId: string; initialLikes: number; t: any; fontStyle: any }) => {
    const { isAuthenticated } = useAuthStore();
    const { isPujaInWishlist } = useWishlistStore();
    const { toggleLike } = useWishlist();
    
    const router = useRouter();
    const pathname = usePathname();
    
    const isLiked = isPujaInWishlist(pujaId);
    const [currentLikes, setCurrentLikes] = React.useState(initialLikes);

    React.useEffect(() => {
        setCurrentLikes(initialLikes);
    }, [initialLikes]);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            toast.error(
                <span>
                    Please login to like this puja.{" "}
                    <span className="underline font-black">Login now →</span>
                </span>,
                {
                    onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#sacred-pujas' : pathname)}`),
                    style: { cursor: "pointer", ...fontStyle }
                }
            );
            return;
        }

        const newIsLiked = !isLiked;
        setCurrentLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
        toggleLike({ id: pujaId, type: "puja", isLiked });
    };

    return (
        <button 
            type="button"
            onClick={handleLike}
            className="absolute top-2 right-2 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-2xl px-2 py-1.5 min-w-[40px] flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95 hover:scale-105 z-20 cursor-pointer"
        >
            <Heart 
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-red-500"}`} 
            />
            <span className="text-[11px] font-medium text-gray-700 leading-none mt-0.5">
                {currentLikes > 0 ? (currentLikes >= 1000 ? (currentLikes / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : currentLikes) : 0}
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
    const content = (pujaContent[lang as "en" | "hi"] || pujaContent.en) as any;
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
            className="group flex flex-col bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer no-underline h-full p-3"
        >
            {/* Puja Image Container */}
            <div className="relative h-56 bg-gray-100 overflow-hidden shrink-0 rounded-2xl mb-4">
                 {puja.puja_image_url ? (
                    <Image 
                        src={puja.puja_image_url} 
                        alt={localizedName} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <Sparkles className="w-10 h-10 text-orange-200" />
                    </div>
                 )}
                 
                 {/* Availability Badges */}
                 <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                    {puja.is_online && (
                        <span className="px-2.5 py-1 bg-[#0055FF] text-white text-[11px] font-medium rounded-md w-max" style={fontStyle}>
                            Online
                        </span>
                    )}
                    {puja.is_home_visit && (
                        <span className="px-2.5 py-1 bg-[#00A82D] text-white text-[11px] font-medium rounded-md w-max" style={fontStyle}>
                            Home Visit
                        </span>
                    )}
                 </div>

                 {/* Like Button */}
                 <LikeButton pujaId={puja.id} initialLikes={Number(puja.total_likes || (puja as any).likes || (puja as any).likesCount || 0)} t={t} fontStyle={fontStyle} />
            </div>

            <div className="px-2 pb-2 flex flex-col grow">
                {/* Header: Name */}
                <h3 className="text-[20px] font-bold text-gray-900 mb-3 leading-tight" style={fontStyle}>
                    {localizedName}
                </h3>

                {/* Expert Info & Rating */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                        {puja.expert?.user?.avatar ? (
                            <Image src={puja.expert.user.avatar} alt="Pandit" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#301118]/80 text-white text-xs flex items-center justify-center font-bold">
                                {(puja.expert?.user?.name || "P").charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-gray-600 mb-0.5" style={fontStyle}>
                            {puja.expert?.user?.name || t.verifiedPandit}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <span className="text-[13px] font-bold text-gray-800 ml-1">
                                {puja.expert?.rating || "4.8"} <span className="text-gray-500 font-normal ml-0.5">({Math.floor(Math.random() * 200) + 50})</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-600 line-clamp-2 leading-relaxed mb-4" style={fontStyle}>
                    {localizedDescription}
                </p>

                {/* Footer: Price + Action */}
                <div className="mt-auto flex items-end justify-between pt-1">
                    <div className="flex flex-col">
                        <span className="text-[12px] text-gray-500 mb-0.5" style={fontStyle}>{lang === 'hi' ? 'शुरुआती कीमत' : 'Starting from'}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[22px] font-bold text-[#FF5500]">₹ {getMinCost(puja).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div className="border border-[#FF5500] text-[#FF5500] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FFF5F0] transition-colors" style={fontStyle}>
                        {t.ritualDetails}
                    </div>
                </div>
            </div>
        </Link>
    );
};
