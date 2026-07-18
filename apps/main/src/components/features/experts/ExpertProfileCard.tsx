"use client";

import React from "react";
import NextImage from "next/image";
import { Expert } from "@/lib/types";

const Image = NextImage as any;

interface ExpertProfileCardProps {
  expert: Expert;
  isAvailable?: boolean;
  onChatClick: () => void;
  onCallClick: () => void;
  onVideoCallClick: () => void;
  onVideoClick: (url: string) => void;
}

const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({
  expert,
  isAvailable = false,
  onChatClick,
  onCallClick,
  onVideoCallClick,
  onVideoClick,
}) => {
  return (
    <div className="w-full lg:w-[320px] xl:w-[360px] max-w-sm mx-auto lg:mx-0 shrink-0">
      <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[32px] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#daa23e] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 group">
        <div className="relative pt-6 pb-2 flex flex-col items-center">
          <div className="absolute top-4 left-6">
            <div className="bg-orange/10 text-orange px-3 py-1 rounded-full flex items-center gap-1 border border-orange/20">
              <i className="fa-solid fa-certificate text-[12px]"></i>
              <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-6">
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border ${
              isAvailable 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-gray-50 text-gray-500 border-gray-100'
            }`}>
               <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
               {isAvailable ? 'Online' : 'Offline'}
            </div>
          </div>

          <div className="relative">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-orange via-orange/40 to-transparent">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative shadow-inner">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            </div>
            <button
              onClick={() => onVideoClick(expert.video || "")}
              className="absolute bottom-1 right-1 bg-orange text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <i className="fa-solid fa-play text-[12px]"></i>
            </button>
          </div>

          <div className="mt-2 text-center px-6">
            <h2 className="text-xl font-bold text-[#1A2B47]">{expert.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{expert.expertise}</p>
          </div>
        </div>

        <div className="mx-6 p-3 bg-white/80 backdrop-blur-sm rounded-2xl flex justify-around items-center border border-slate-100 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Experience</p>
            <p className="text-sm font-semibold text-[#1A2B47]">{expert.experience} Years</p>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Rating</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold text-[#1A2B47]">{expert.ratings}</span>
              <i className="fa-solid fa-star text-orange text-[12px]"></i>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Likes</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-semibold text-[#1A2B47]">
                {((count: number) => {
                  if (count >= 1000) {
                    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                  }
                  return count;
                })(expert.total_likes || 0)}
              </span>
              <i className="fa-solid fa-heart text-[#ff4d4d] text-[12px]"></i>
            </div>
          </div>
          {expert.price > 0 ? (
            <>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Price</p>
                <p className="text-sm font-semibold text-emerald-600">₹{expert.price}/min</p>
              </div>
            </>
          ) : null}
        </div>

        <div className="px-8 py-4 space-y-2">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-language text-slate-400 text-[18px] w-5 text-center"></i>
            <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Languages:</span> {expert.language}</p>
          </div>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-brain text-slate-400 text-[18px] w-5 text-center"></i>
            <p className="text-sm text-slate-600"><span className="font-bold text-gray-900">Expertise:</span> {expert.expertise}</p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCallClick}
              className="flex flex-col items-center justify-center gap-0.5 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg font-semibold active:scale-95 transition-all hover:bg-green-100 shadow-sm"
            >
              <div className="flex items-center gap-1 text-xs">
                <i className="fa-solid fa-phone text-[11px]" />
                Call
              </div>
              {(() => { const p = expert.call_price && expert.call_price > 0 ? expert.call_price : expert.price > 0 ? expert.price : 0; return p > 0 ? <span className="text-[10px] font-bold opacity-80">₹{p}/min</span> : null; })()}
            </button>
            <button
              onClick={onVideoCallClick}
              className="flex flex-col items-center justify-center gap-0.5 bg-orange/10 text-orange border border-orange/20 py-2.5 rounded-lg font-semibold active:scale-95 transition-all hover:bg-orange/20 shadow-sm"
            >
              <div className="flex items-center gap-1 text-xs">
                <i className="fa-solid fa-video text-[11px]" />
                Video Call
              </div>
              {(() => { const p = expert.video_call_price && expert.video_call_price > 0 ? expert.video_call_price : expert.price > 0 ? expert.price * 2 : 0; return p > 0 ? <span className="text-[10px] font-bold opacity-80">₹{p}/min</span> : null; })()}
            </button>
          </div>
          <button
            onClick={onChatClick}
            className="w-full mt-3 flex flex-col items-center justify-center gap-0.5 bg-orange text-white border border-orange py-2.5 rounded-lg font-semibold active:scale-95 transition-all hover:bg-orange-hover shadow-sm"
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

export default ExpertProfileCard;
