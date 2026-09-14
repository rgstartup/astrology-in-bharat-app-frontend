"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import {
  Star,
  MessageSquare,
  Phone,
  Video,
  Heart,
  ShieldCheck,
  Globe,
  Sparkles,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useExpertListStore } from "@/store/useExpertListStore";
import { toast } from "@/hooks/use-toast";
import type { Expert } from "@repo/lib";

interface ExploreExpertCardProps {
  expert: Expert;
}

export function ExploreExpertCard({ expert }: ExploreExpertCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isExpertInWishlist } = useWishlistStore();
  const { toggleLike } = useWishlist();
  const { setPreloadedExpert } = useExpertListStore();

  const [currentLikes, setCurrentLikes] = useState(expert.total_likes || 0);

  const expertId = expert.id;
  const isLiked = expertId ? isExpertInWishlist(expertId) : false;

  const chatPrice =
    expert.pricing?.chat_price ?? expert.chat_price ?? expert.price ?? 25;
  const callPrice =
    expert.pricing?.call_price ?? expert.call_price ?? expert.price ?? 30;
  const videoPrice =
    expert.pricing?.video_call_price ??
    expert.video_call_price ??
    (chatPrice ? chatPrice * 2 : 50);

  const specializationsList: string[] = Array.isArray(expert.specializations)
    ? expert.specializations
        .map(
          (s: any) =>
            s?.specialization?.title ||
            s?.title ||
            (typeof s === "string" ? s : ""),
        )
        .filter(Boolean)
    : expert.specialization
      ? expert.specialization.split(",").map((s: string) => s.trim())
      : ["Vedic Astrology"];

  const languagesDisplay = Array.isArray(expert.languages)
    ? expert.languages.join(", ")
    : expert.languages || "Hindi, English";

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to like this expert.");
      return;
    }

    setCurrentLikes((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
    toggleLike({ id: expertId, type: "expert", isLiked });
  };

  const handleConsult = (
    e: React.MouseEvent,
    type: "chat" | "audio" | "video",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expertId) {
      toast.error("Expert profile not found.");
      return;
    }

    if (type === "chat") {
      router.push(`/chat/prep/${expertId}`);
    } else {
      router.push(`/call/prep/${expertId}?type=${type}`);
    }
  };

  const handleCardClick = () => {
    setPreloadedExpert(expert as any);
  };

  const isOnline = expert.is_available ?? true;
  const isBusy = Boolean(expert.is_busy);

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-gray-300 hover:border-gray-800 bg-white hover:shadow-2xl hover:shadow-black/10 transition-all duration-300">
      {/* Top Banner Accent with astrological pattern & gradient */}
      <div className="relative h-20 bg-linear-to-r from-[#301118] via-[#5c1c28] to-[#FF6B00] overflow-hidden p-3 flex items-start justify-between">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center gap-1.5">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-sm backdrop-blur-xs">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              <span>{isBusy ? "In Consultation" : "Online Now"}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/40 text-gray-200 backdrop-blur-xs">
              <span>Offline</span>
            </span>
          )}

          {expert.rating && expert.rating >= 4.8 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37] text-black shadow-xs">
              <Sparkles className="size-2.5" />
              <span>Top Rated</span>
            </span>
          )}
        </div>

        {/* Wishlist Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className="relative z-10 size-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
          title={isLiked ? "Unlike" : "Like guru"}
        >
          <Heart
            className={`size-4 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Card Body */}
      <Link
        href={`/expert/${expertId}`}
        onClick={handleCardClick}
        className="flex-1 px-5 pt-0 pb-4 block cursor-pointer select-none"
      >
        {/* Avatar & Floating Verified Badge */}
        <div className="relative -mt-10 flex items-end justify-between mb-3">
          <div className="relative">
            <div className="size-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-50 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={expert.avatar || "/images/dummy-expert.jpg"}
                alt={expert.name}
                width={80}
                height={80}
                className="size-full object-cover"
                unoptimized
              />
            </div>
            {/* Verified icon on avatar corner */}
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-linear-to-r from-orange to-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white">
              <ShieldCheck className="size-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex flex-col items-end">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs shadow-xs">
              <Star className="size-3.5 fill-[#FF6B00] text-[#FF6B00]" />
              <span>
                {expert.rating ? Number(expert.rating).toFixed(1) : "4.9"}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                ({expert.total_reviews || 85})
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 mt-0.5">
              {currentLikes} {currentLikes === 1 ? "follower" : "followers"}
            </span>
          </div>
        </div>

        {/* Expert Name & Headline */}
        <div className="mb-3">
          <h4 className="text-lg font-black text-gray-900 group-hover:text-orange transition-colors font-display tracking-tight flex items-center gap-1.5">
            <span>{expert.name}</span>
          </h4>

          <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">
            {expert.about ||
              "Celebrated Vedic Astrologer providing profound insights on horoscope, love compatibility, and career."}
          </p>
        </div>

        {/* Specialization Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {specializationsList.slice(0, 3).map((spec, i) => {
            const variants: Array<"saffron" | "gold" | "emerald" | "purple"> = [
              "saffron",
              "gold",
              "purple",
              "emerald",
            ];
            const variant = variants[i % variants.length];
            return (
              <Badge
                key={spec}
                variant={variant}
                className="text-[11px] py-0.5 px-2 font-bold"
              >
                {spec}
              </Badge>
            );
          })}
          {specializationsList.length > 3 && (
            <span className="text-[11px] font-bold text-gray-400 self-center">
              +{specializationsList.length - 3} more
            </span>
          )}
        </div>

        {/* Experience & Languages Info Row */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200 font-medium">
          <div className="flex items-center gap-1.5">
            <Award className="size-3.5 text-orange" />
            <span className="font-bold text-gray-800">
              {expert.experience_in_years || 5}+ yrs
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 max-w-[55%] truncate">
            <Globe className="size-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{languagesDisplay}</span>
          </div>
        </div>
      </Link>

      {/* Card Footer: Pricing & Action Buttons */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-200 rounded-b-3xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              Consultation Starts At
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900">
                ₹{chatPrice}
              </span>
              <span className="text-[11px] font-semibold text-gray-500">
                /min
              </span>
            </div>
          </div>

          <Link
            href={`/expert/${expertId}`}
            onClick={handleCardClick}
            className="text-xs font-bold text-orange hover:text-[#e65100] transition-colors underline underline-offset-2"
          >
            View Profile →
          </Link>
        </div>

        {/* Bold Direct Action CTA Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Chat Button */}
          <button
            type="button"
            onClick={(e) => handleConsult(e, "chat")}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-orange/5 hover:bg-orange/15 border-2 border-orange/40 hover:border-orange text-orange transition-all active:scale-95 shadow-xs group/btn cursor-pointer"
          >
            <div className="flex items-center gap-1 text-orange">
              <MessageSquare className="size-3.5 stroke-[2.5]" />
              <span className="text-xs font-black">Chat</span>
            </div>
            <span className="text-[11px] font-extrabold text-gray-900 mt-0.5 tracking-tight">
              ₹{chatPrice}/min
            </span>
          </button>

          {/* Audio Call Button */}
          <button
            type="button"
            onClick={(e) => handleConsult(e, "audio")}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border-2 border-emerald-500/40 hover:border-emerald-600 text-emerald-700 transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-1 text-emerald-700">
              <Phone className="size-3.5 stroke-[2.5]" />
              <span className="text-xs font-black">Call</span>
            </div>
            <span className="text-[11px] font-extrabold text-gray-900 mt-0.5 tracking-tight">
              ₹{callPrice}/min
            </span>
          </button>

          {/* Video Call Button */}
          <button
            type="button"
            onClick={(e) => handleConsult(e, "video")}
            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-linear-to-r from-orange to-amber-500 hover:from-[#e65100] hover:to-amber-600 text-white font-black shadow-md shadow-orange/20 transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-1 text-white">
              <Video className="size-3.5 stroke-[2.5]" />
              <span className="text-xs font-black">Video</span>
            </div>
            <span className="text-[11px] font-extrabold text-white mt-0.5 tracking-tight drop-shadow-xs">
              ₹{videoPrice}/min
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
