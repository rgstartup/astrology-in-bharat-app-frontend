"use client";

import React, { useState, useCallback, useRef } from "react";
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

// ─── Skeleton Blocks ─────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const ReviewSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2 w-16" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    ))}
  </div>
);

const GallerySkeleton = () => (
  <div className="grid grid-cols-3 gap-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="aspect-square rounded-lg" />
    ))}
  </div>
);

const VideosSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="aspect-video rounded-xl" />
    ))}
  </div>
);

const ExperienceSkeleton = () => (
  <div className="space-y-3">
    {[1, 2].map((i) => (
      <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-3 w-56 mb-1.5" />
        <Skeleton className="h-3 w-full" />
      </div>
    ))}
  </div>
);

// ─── Lazy Image Component ─────────────────────────────────────────────
const LazyGalleryImage = ({ src, index, onClick }: { src: string; index: number; onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded-lg" />}
      {visible && (
        <Image
          src={src}
          alt={`Gallery ${index + 1}`}
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <i className="fa-solid fa-magnifying-glass text-white text-xl" />
      </div>
    </div>
  );
};

// ─── Lazy Video Thumbnail ─────────────────────────────────────────────
const LazyVideoThumb = ({ vid, index, onClick }: { vid: string; index: number; onClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const ytId = getYoutubeId(vid);
  const isShort = vid.includes('shorts/');

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-black shadow-sm hover:shadow-md transition-all"
    >
      {!imgLoaded && <Skeleton className="absolute inset-0 rounded-xl" />}
      {visible && ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt="Video Thumbnail"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:opacity-50 pointer-events-none ${isShort ? 'scale-[1.35]' : ''} ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
        />
      ) : visible ? (
        <video
          src={vid}
          onLoadedData={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50 pointer-events-none ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
        />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-orange flex items-center justify-center text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
          <i className="fa-solid fa-play text-lg ml-1" />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
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
    { key: 'experience', label: 'Bio' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'videos', label: 'Videos' },
  ];

  // Track which tabs have been visited for lazy loading
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['about', 'experience']));

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    setVisitedTabs(prev => new Set([...prev, tab]));
  }, [setActiveTab]);

  return (
    <div className="w-full flex-1">
      <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[24px] border border-[#daa23e] p-6 lg:p-8 h-full shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1">
        <div className="flex items-center justify-between border-b border-orange/10 pb-4 mb-6">
          <h4 className="text-xl font-bold text-gray-900">Profile Details</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className={`text-xs font-semibold uppercase tracking-wide ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap gap-5 md:gap-6 border-b border-gray-100 mb-6 pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex-shrink-0 font-bold text-[15px] pb-2 px-1 transition-colors relative ${activeTab === tab.key ? 'text-gray-900 border-b-2 border-orange' : 'text-gray-500 hover:text-orange'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[160px] mb-8">

          {/* ── About ── */}
          <div className={activeTab === 'about' || !activeTab ? 'block' : 'hidden'}>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
              {expert.about ? (
                <p className="whitespace-pre-line">{expert.about}</p>
              ) : (
                <p className="text-sm italic text-gray-400">No custom about section added yet.</p>
              )}
            </div>
          </div>

          {/* ── Experience (Now Bio) ── */}
          <div className={activeTab === 'experience' ? 'block' : 'hidden'}>
            {!visitedTabs.has('experience') ? (
              <ExperienceSkeleton />
            ) : (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                {expert.bio ? (
                  <p className="whitespace-pre-line">{expert.bio}</p>
                ) : (
                  <p className="text-sm italic text-gray-400">No bio details added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Reviews ── */}
          <div className={activeTab === 'reviews' ? 'block' : 'hidden'}>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[400px] overflow-y-auto pr-1" data-lenis-prevent="true">
              {loadingReviews ? (
                <ReviewSkeleton />
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                          <Image
                            src={review.user?.avatar || (review as any).client?.avatar || (review as any).client?.user?.avatar || "/images/dummy-expert.jpg"}
                            alt={review.user?.name || (review as any).client?.name || "Anonymous"}
                            fill sizes="40px" className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-gray-900">{review.user?.name || (review as any).client?.name || "Anonymous"}</h5>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {(() => {
                              const dateStr = (review as any).createdAt || (review as any).created_at || (review as any).date;
                              const date = new Date(dateStr);
                              return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
                  <i className="fa-regular fa-comments text-4xl text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No reviews yet for this expert.</p>
                </div>
              )}
              {totalReviews > reviews.length && (
                <div className="text-center pt-2">
                  <button className="text-xs font-bold text-orange hover:underline">View All {totalReviews} Reviews</button>
                </div>
              )}
            </div>
          </div>

          {/* ── Gallery (Lazy) ── */}
          <div className={activeTab === 'gallery' ? 'block' : 'hidden'}>
            {!visitedTabs.has('gallery') ? (
              <GallerySkeleton />
            ) : (
              <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[360px] overflow-y-auto pr-1" data-lenis-prevent="true">
                {expert.gallery && expert.gallery.length > 0 ? (
                  expert.gallery.map((img, index) => (
                    <LazyGalleryImage key={index} src={img} index={index} onClick={() => onImageClick(img)} />
                  ))
                ) : (
                  <p className="col-span-3 text-sm text-gray-500 italic text-center py-4">No gallery images available.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Videos (Lazy) ── */}
          <div className={activeTab === 'videos' ? 'block' : 'hidden'}>
            {!visitedTabs.has('videos') ? (
              <VideosSkeleton />
            ) : (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[320px] overflow-y-auto pr-1" data-lenis-prevent="true">
                {expert.videos && expert.videos.length > 0 ? (
                  expert.videos.map((vid, index) => (
                    <LazyVideoThumb key={index} vid={vid} index={index} onClick={() => onVideoClick(vid)} />
                  ))
                ) : (
                  <p className="col-span-2 text-sm text-gray-500 italic text-center py-4 w-full">No videos available.</p>
                )}
              </div>
            )}
          </div>

        </div>



      </div>
    </div>
  );
};

export default ExpertContentSection;
