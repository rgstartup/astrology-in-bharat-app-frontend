"use client";

import React from "react";
import Image from "next/image";
import { usePreloadExpertStore } from "@/store/usePreloadExpertStore";

// ─── Skeleton Components ─────────────────────────────────────────────
const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const ContentSectionSkeleton = () => (
  <div className="w-full flex-1">
    <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[24px] border border-[#daa23e] p-6 lg:p-8 h-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange/10 pb-4 mb-6">
        <SkeletonBlock className="h-6 w-36" />
        <SkeletonBlock className="h-4 w-16 rounded-full" />
      </div>
      {/* Tabs */}
      <div className="flex gap-5 border-b border-gray-100 mb-6 pb-1">
        {["About", "Experience", "Reviews", "Gallery", "Videos"].map((tab) => (
          <SkeletonBlock key={tab} className="h-5 w-16" />
        ))}
      </div>
      {/* Content */}
      <div className="space-y-3 mb-8">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-4/6" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
      </div>
      <SkeletonBlock className="h-10 w-full mt-3 rounded-xl" />
    </div>
  </div>
);

const ProfileCardSkeleton = () => (
  <div className="w-full lg:w-[320px] xl:w-[360px] max-w-sm mx-auto lg:mx-0 shrink-0">
    <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[32px] overflow-hidden shadow-lg border border-slate-100 p-6">
      <div className="flex flex-col items-center gap-3">
        <SkeletonBlock className="w-28 h-28 rounded-full" />
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="h-4 w-56" />
      </div>
      <div className="mt-4 flex justify-around p-3 bg-white/80 rounded-2xl border border-slate-100">
        {[1,2,3,4].map(i => (
          <SkeletonBlock key={i} className="h-8 w-12" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-10 rounded-lg" />
        <SkeletonBlock className="h-10 rounded-lg" />
      </div>
      <SkeletonBlock className="mt-3 h-10 w-full rounded-lg" />
    </div>
  </div>
);

// ─── Preloaded Expert Profile Card (renders instantly) ───────────────
const InstantProfileCard = ({ expert }: { expert: any }) => {
  const isAvailable = expert.is_available;
  const allServices = [expert.expertise, ...(Array.isArray(expert.custom_services) ? expert.custom_services.map((s: any) => s.name) : [])].filter(Boolean);

  return (
    <div className="w-full lg:w-[320px] xl:w-[360px] max-w-sm mx-auto lg:mx-0 shrink-0">
      <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[32px] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-[#daa23e]">
        <div className="relative pt-6 pb-2 flex flex-col items-center">
          {/* Top-rated badge */}
          <div className="absolute top-4 left-6">
            <div className="bg-orange/10 text-orange px-3 py-1 rounded-full flex items-center gap-1 border border-orange/20">
              <i className="fa-solid fa-certificate text-[12px]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
            </div>
          </div>
          {/* Online/Offline badge */}
          <div className="absolute top-4 right-6">
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border ${isAvailable ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isAvailable ? 'Online' : 'Offline'}
            </div>
          </div>
          {/* Profile Image */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-orange via-orange/40 to-transparent">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative shadow-inner">
                <Image src={expert.image || '/images/dummy-expert.jpg'} alt={expert.name || 'Expert'} fill sizes="112px" className="object-cover" />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 bg-orange text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-play text-[12px]" />
            </button>
          </div>
          <div className="mt-2 text-center px-6">
            <h2 className="text-xl font-bold text-[#1A2B47]">{expert.name}</h2>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{allServices.slice(0, 3).join(', ')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-6 p-3 bg-white/80 backdrop-blur-sm rounded-2xl flex justify-around items-center border border-slate-100 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Experience</p>
            <p className="text-sm font-semibold text-[#1A2B47]">{expert.experience} Years</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Rating</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold text-[#1A2B47]">{expert.ratings || 0}</span>
              <i className="fa-solid fa-star text-orange text-[12px]" />
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Likes</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold text-[#1A2B47]">{expert.total_likes || 0}</span>
              <i className="fa-solid fa-heart text-[#ff4d4d] text-[12px]" />
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Price</p>
            <p className="text-sm font-semibold text-emerald-600">₹{expert.price}/min</p>
          </div>
        </div>

        {/* Info */}
        <div className="px-8 py-4 space-y-2">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-language text-slate-400 text-[18px] w-5 text-center" />
            <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Languages:</span> {expert.language}</p>
          </div>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-brain text-slate-400 text-[18px] w-5 text-center" />
            <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Expertise:</span> {expert.expertise}</p>
          </div>
        </div>

        {/* Action Buttons — disabled during loading */}
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled
              className="flex flex-col items-center justify-center gap-0.5 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg font-semibold opacity-70 cursor-wait shadow-sm"
            >
              <div className="flex items-center gap-1 text-xs">
                <i className="fa-solid fa-phone text-[11px]" />
                Call
              </div>
              {(() => { const p = expert.call_price && expert.call_price > 0 ? expert.call_price : expert.price > 0 ? expert.price : 0; return p > 0 ? <span className="text-[10px] font-bold opacity-80">₹{p}/min</span> : null; })()}
            </button>
            <button
              disabled
              className="flex flex-col items-center justify-center gap-0.5 bg-orange/10 text-orange border border-orange/20 py-2.5 rounded-lg font-semibold opacity-70 cursor-wait shadow-sm"
            >
              <div className="flex items-center gap-1 text-xs">
                <i className="fa-solid fa-video text-[11px]" />
                Video Call
              </div>
              {(() => { const p = expert.video_call_price && expert.video_call_price > 0 ? expert.video_call_price : expert.price > 0 ? expert.price * 2 : 0; return p > 0 ? <span className="text-[10px] font-bold opacity-80">₹{p}/min</span> : null; })()}
            </button>
          </div>
          <button
            disabled
            className="w-full mt-3 flex flex-col items-center justify-center gap-0.5 bg-orange text-white border border-orange py-2.5 rounded-lg font-semibold opacity-70 cursor-wait shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs">
              <i className="fa-solid fa-comments text-[13px]" />
              Chat Now
            </div>
            {(() => { const p = expert.chat_price && expert.chat_price > 0 ? expert.chat_price : expert.price > 0 ? expert.price : 0; return p > 0 ? <span className="text-[10px] font-bold opacity-90">₹{p}/min</span> : null; })()}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Loading Component ──────────────────────────────────────────
export default function Loading() {
  const { preloadedExpert } = usePreloadExpertStore();

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 mt-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Show real expert data instantly if available, else skeleton */}
        {preloadedExpert ? (
          <InstantProfileCard expert={preloadedExpert} />
        ) : (
          <ProfileCardSkeleton />
        )}
        {/* Right: Always show skeleton for content section (needs server data) */}
        <ContentSectionSkeleton />
      </div>
    </div>
  );
}
