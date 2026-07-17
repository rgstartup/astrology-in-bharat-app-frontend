"use client";

import React from "react";
import NextImage from "next/image";
import { Review } from "@/libs/api-experts";
import { Expert } from "@/lib/types";
import { renderStars } from "./renderStars";
import { Loading } from "@repo/ui";

import { getYoutubeId } from "@/utils/video-utils";

const Image = NextImage as any;

interface ExpertContentSectionProps {
  expert: Expert;
  isAvailable?: boolean;
  activeTab: 'about' | 'experience' | 'reviews' | 'gallery' | 'videos';
  setActiveTab: (tab: 'about' | 'experience' | 'reviews' | 'gallery' | 'videos') => void;
  reviews: Review[];
  loadingReviews: boolean;
  totalReviews: number;
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
}

const ExpertContentSection: React.FC<ExpertContentSectionProps> = ({
  expert,
  isAvailable = false,
  activeTab,
  setActiveTab,
  reviews,
  loadingReviews,
  totalReviews,
  onImageClick,
  onVideoClick,
}) => {
  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'experience', label: 'Experience' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'videos', label: 'Videos' },
  ];

  return (
    <div className="w-full flex-1">
      <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[24px] border border-orange/30 p-6 lg:p-8 h-full shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] hover:border-orange hover:-translate-y-1">
        <div className="flex items-center justify-between border-b border-orange/10 pb-4 mb-6">
          <h4 className="text-xl font-bold text-gray-900">Profile Details</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex overflow-x-auto whitespace-nowrap gap-5 md:gap-6 border-b border-gray-100 mb-6 pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === tab.key ? 'text-gray-900 border-b-2 border-orange' : 'text-gray-500 hover:text-orange'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[160px] mb-8">
          {activeTab === 'about' && (
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
              {expert.bio ? (
                <p className="whitespace-pre-line">{expert.bio}</p>
              ) : (
                <p>
                  <span className="font-bold text-gray-900">Acharya {expert.name}</span> is a distinguished expert with profound knowledge in
                  <span className="font-semibold text-orange"> {expert.expertise}</span>.
                  With over {expert.experience} years of dedicated practice, they have guided countless individuals towards clarity and success.
                </p>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[200px] overflow-y-auto pr-1" data-lenis-prevent="true">
              {expert.detailed_experience && expert.detailed_experience.length > 0 ? (
                expert.detailed_experience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex gap-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-orange shrink-0"></div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900">{exp.title || exp.role || "Expert"}</h5>
                        <p className="text-xs text-gray-500 font-medium">
                          <span className="text-gray-700 font-semibold">Experience:</span>{" "}
                          {exp.organization || exp.company || "Independent"}
                          {exp.duration ? ` • ${exp.duration}` : ""}
                        </p>
                        {exp.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No specific experience details added.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[400px] overflow-y-auto pr-1" data-lenis-prevent="true">
              {loadingReviews ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loading size="md" text="Loading authentic reviews..." />
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                          <Image
                            src={review.user?.avatar || (review as any).client?.avatar || (review as any).client?.profile_picture || (review as any).client?.user?.avatar || "/images/dummy-expert.jpg"}
                            alt={review.user?.name || (review as any).client?.name || (review as any).client?.user?.name || "Anonymous"}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-gray-900">{review.user?.name || (review as any).client?.name || (review as any).client?.user?.name || "Anonymous"}</h5>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {(() => {
                              const dateStr = (review as any).createdAt || (review as any).created_at || (review as any).date;
                              const date = new Date(dateStr);
                              return isNaN(date.getTime()) 
                                ? "Recently" 
                                : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-orange text-[10px] bg-orange/5 px-2 py-1 rounded-full gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-orange/20 pl-3 py-1">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <i className="fa-regular fa-comments text-4xl text-gray-300 mb-3"></i>
                  <p className="text-sm text-gray-500 font-medium">No reviews yet for this expert.</p>
                </div>
              )}
              {totalReviews > reviews.length && (
                <div className="text-center pt-2">
                  <button className="text-xs font-bold text-orange hover:underline">
                    View All {totalReviews} Reviews
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[360px] overflow-y-auto pr-1" data-lenis-prevent="true">
              {expert.gallery && expert.gallery.length > 0 ? (
                expert.gallery.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => onImageClick(img)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
                  >
                    <Image src={img} alt={`Gallery ${index + 1}`} fill sizes="(max-width: 768px) 33vw, 20vw" className="object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-sm text-gray-500 italic text-center py-4">No gallery images available.</p>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[320px] overflow-y-auto pr-1" data-lenis-prevent="true">
              {expert.videos && expert.videos.length > 0 ? (
                expert.videos.map((vid, index) => (
                  <div
                    key={index}
                    onClick={() => onVideoClick(vid)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-black shadow-sm hover:shadow-md transition-all"
                  >
                    {(() => {
                      const ytId = getYoutubeId(vid);
                      const isShort = vid.includes('shorts/');
                      if (ytId) {
                        return (
                          <img
                            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                            alt="Video Thumbnail"
                            className={`w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none ${isShort ? 'scale-[1.35]' : ''}`}
                          />
                        );
                      }
                      return (
                        <video
                          src={vid}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                        />
                      );
                    })()}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-orange flex items-center justify-center text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        <i className="fa-solid fa-play text-lg ml-1"></i>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-sm text-gray-500 italic text-center py-4 break-inside-avoid w-full">No videos available.</p>
              )}
            </div>
          )}
        </div>

        {!isAvailable && (
          <div className="flex flex-wrap gap-3 mb-5 animate-in fade-in duration-500">
            <button className="flex-1 min-w-[140px] px-6 py-3 bg-orange text-white rounded-xl hover:bg-orange-hover transition-colors font-semibold text-sm shadow-orange/20 shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <i className="fa-regular fa-bell"></i>
              Notify Me
            </button>
            <button className="flex-1 min-w-[140px] px-6 py-3 border border-orange text-orange rounded-xl hover:bg-orange/5 transition-colors font-semibold text-sm flex items-center justify-center gap-2 active:scale-95">
              <i className="fa-regular fa-envelope"></i>
              Message
            </button>
          </div>
        )}
        {!isAvailable && (
          <p className="text-[11px] text-orange flex items-center gap-2 py-2.5 px-4 bg-orange/5 rounded-xl border border-orange/20 animate-in fade-in duration-500">
            <i className="fa-solid fa-circle-info"></i>
            Get an email alert instantly when the expert comes online.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpertContentSection;
