"use client";

import React from "react";
import Image from "next/image";
import { Award, CheckCircle2, Play, Heart } from "lucide-react";
import { ProfileHeroBannerProps } from "./types";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/__useAuthStore";
import { toast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

export const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({
  expertId,
  name,
  avatar,
  primaryProfession,
  isOnline,
  currentBusy,
  videoUrl,
  onVideoClick,
}) => {
  const { isExpertInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleLike, isPending } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const isFavorite = expertId ? isExpertInWishlist(expertId) : false;

  const handleFavoriteToggle = () => {
    if (!expertId) return;

    if (!isAuthenticated) {
      toast.info("Please sign in to save this astrologer to your favorites.", {
        action: {
          label: "Sign In",
          onClick: () =>
            router.push(
              `/sign-in?callbackUrl=${encodeURIComponent(pathname || window.location.pathname)}`,
            ),
          style: { cursor: "pointer" },
        },
      });
      return;
    }

    toggleLike({ id: String(expertId), type: "expert", isLiked: isFavorite });
    toast.success(
      isFavorite ? "Removed from your favorites." : "Added to your favorites!",
    );
  };
  return (
    <div>
      {/* Top Banner with Single Orange Wave SVG */}
      <div className="relative h-24 sm:h-28 w-full rounded-2xl bg-white p-3.5 flex items-start justify-between overflow-hidden shadow-xs border border-orange-200/40">
        <svg
          className="absolute inset-0 size-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 900 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="single-orange-wave-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <rect width="900" height="300" fill="#ffffff" />
          <path
            d="M0,0 L900,0 L900,165 C740,235 590,145 410,215 C230,280 90,180 0,225 Z"
            fill="url(#single-orange-wave-grad)"
          />
        </svg>

        {/* Top Astrologer Badge */}
        <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-slate-800 border border-white/80 shadow-2xs backdrop-blur-md transition-colors">
          <Award className="size-3.5 text-amber-500 fill-amber-500/20" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
            Top Astrologer
          </span>
        </div>

        {/* Real-time Status Badge */}
        <div
          className={`relative z-10 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-2xs transition-all ${
            currentBusy
              ? "bg-white/95 text-amber-800 border border-amber-200/80"
              : isOnline
                ? "bg-white/95 text-emerald-800 border border-emerald-200/80"
                : "bg-white/90 text-slate-600 border border-slate-200/80"
          }`}
        >
          {currentBusy ? (
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-amber-500" />
            </span>
          ) : isOnline ? (
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
          ) : (
            <span className="size-2 rounded-full bg-slate-400 shrink-0" />
          )}
          <span className="text-[11px] sm:text-xs font-bold leading-none">
            {currentBusy ? "Busy" : isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Avatar & Top Action Row */}
      <div className="flex items-end justify-between px-2 sm:px-3 -mt-12 sm:-mt-14">
        {/* Left-Aligned Profile Avatar */}
        <div className="relative size-24 sm:size-28 rounded-full p-0.5 bg-white ring-1 ring-black/[0.08] shadow-sm shrink-0 group/avatar">
          <div className="relative size-full rounded-full overflow-hidden bg-slate-100">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="112px"
              className="object-cover object-top transition-transform duration-500 group-hover/avatar:scale-105"
              priority
            />
          </div>

          {/* Video Intro Play Button */}
          {videoUrl && (
            <button
              type="button"
              onClick={() => onVideoClick(videoUrl)}
              className="absolute bottom-0.5 right-0.5 bg-slate-900/90 hover:bg-slate-900 text-white size-7 sm:size-8 rounded-full border border-white shadow-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
              title="Watch Intro Video"
            >
              <Play className="size-3 sm:size-3.5 fill-white ml-0.5" />
            </button>
          )}
        </div>

        {/* Favorite Icon Toggle (shadcn) */}
        <Toggle
          variant="heart"
          size="icon"
          pressed={isFavorite}
          disabled={isPending}
          onPressedChange={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          title={isFavorite ? "Favorited" : "Add to favorites"}
          className="relative z-10 mb-1 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 group/heart"
        >
          <Heart
            className={cn(
              "size-4 transition-transform duration-200",
              isFavorite
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-slate-400 group-hover/heart:text-rose-500",
            )}
          />
        </Toggle>
      </div>

      {/* Consultant Name & Primary Profession */}
      <div className="text-left px-1 mt-2.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {name}
          </h2>
          <CheckCircle2 className="size-4.5 text-orange shrink-0 fill-orange/10" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
          {primaryProfession}
        </p>
      </div>
    </div>
  );
};
