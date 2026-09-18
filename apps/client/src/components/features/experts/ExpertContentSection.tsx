"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Review } from "@/libs/api-experts";
import type { Expert } from "@repo/lib";
import { renderStars } from "./renderStars";
import { getYoutubeId } from "@/utils/video-utils";
import {
  User,
  Award,
  Star,
  Image as ImageIcon,
  Video as VideoIcon,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Compass,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import {
  extractSpecializationNames,
  getSpecializationBadgeStyle,
  extractProfessionNames,
} from "@/utils/expert-utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import { cn } from "@/lib/utils";

interface ExpertContentSectionProps {


  expert: Expert;
  isAvailable?: boolean;
  activeTab: "about" | "experience" | "reviews" | "gallery" | "videos";
  setActiveTab: (
    tab: "about" | "experience" | "reviews" | "gallery" | "videos",
  ) => void;
  reviews: Review[];
  loadingReviews: boolean;
  totalReviews: number;
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
}

// ─── Skeleton Blocks ─────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const ReviewSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs"
      >
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    ))}
  </div>
);

const GallerySkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="aspect-square rounded-2xl" />
    ))}
  </div>
);

const VideosSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="aspect-video rounded-2xl" />
    ))}
  </div>
);

// ─── Lazy Image Component ─────────────────────────────────────────────
const LazyGalleryImage = ({
  src,
  index,
  onClick,
}: {
  src: string;
  index: number;
  onClick: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group cursor-pointer shadow-xs hover:shadow-md transition-all"
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded-2xl" />}
      {visible && (
        <Image
          src={src}
          alt={`Gallery ${index + 1}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="size-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
          <ImageIcon className="size-5" />
        </div>
      </div>
    </div>
  );
};

// ─── Lazy Video Thumbnail ─────────────────────────────────────────────
const LazyVideoThumb = ({
  vid,
  index,
  onClick,
}: {
  vid: string;
  index: number;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const ytId = getYoutubeId(vid);
  const isShort = vid.includes("shorts/");

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group cursor-pointer bg-slate-900 shadow-sm hover:shadow-md transition-all"
    >
      {!imgLoaded && <Skeleton className="absolute inset-0 rounded-2xl" />}
      {visible && ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt="Video Thumbnail"
          onLoad={() => setImgLoaded(true)}
          className={`size-full object-cover transition-all duration-300 group-hover:opacity-60 pointer-events-none ${
            isShort ? "scale-[1.35]" : ""
          } ${imgLoaded ? "opacity-90" : "opacity-0"}`}
        />
      ) : visible ? (
        <video
          src={vid}
          onLoadedData={() => setImgLoaded(true)}
          className={`size-full object-cover transition-opacity duration-300 group-hover:opacity-60 pointer-events-none ${
            imgLoaded ? "opacity-90" : "opacity-0"
          }`}
        />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="size-14 rounded-full bg-orange flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
          <VideoIcon className="size-6 ml-0.5" />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const ExpertContentSection: React.FC<ExpertContentSectionProps> = ({
  expert,
  activeTab,
  setActiveTab,
  reviews,
  loadingReviews,
  totalReviews,
  onImageClick,
  onVideoClick,
}) => {
  const tabs = [
    {
      key: "about" as const,
      label: "About",
      shortLabel: "About",
      icon: User,
    },
    {
      key: "experience" as const,
      label: "Experience & Bio",
      shortLabel: "Experience",
      icon: Award,
    },
    {
      key: "reviews" as const,
      label: "Client Reviews",
      shortLabel: "Reviews",
      icon: Star,
      count: totalReviews || reviews.length,
    },
    {
      key: "gallery" as const,
      label: "Photo Gallery",
      shortLabel: "Gallery",
      icon: ImageIcon,
      count: expert.gallery?.length || 0,
    },
    {
      key: "videos" as const,
      label: "Video Library",
      shortLabel: "Videos",
      icon: VideoIcon,
      count: expert.videos?.length || (expert.video ? 1 : 0),
    },
  ];

  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set(["about", "experience"]),
  );

  const {
    containerRef: tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    handleScroll,
    scrollToElement,
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
    wasDragged,
  } = useDraggableScroll<HTMLDivElement>({
    dragSpeed: 1.3,
    scrollStepRatio: 0.65,
    dragThreshold: 6,
  });

  const handleTabChange = useCallback(
    (tab: typeof activeTab, tabElement?: HTMLElement | null) => {
      // Ignore click if it was a drag gesture
      if (wasDragged()) return;

      setActiveTab(tab);
      setVisitedTabs((prev) => new Set([...prev, tab]));

      // Smoothly bring active tab into view if partially hidden
      scrollToElement(tabElement);
    },
    [setActiveTab, wasDragged, scrollToElement],
  );


  // Parse specializations, professions, languages from API response
  const specializationNames = extractSpecializationNames(
    expert.specializations || expert.specialization,
  );
  const professionNames = extractProfessionNames(expert);
  const languagesList = Array.isArray(expert.languages)
    ? expert.languages
    : typeof expert.languages === "string"
      ? expert.languages
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  // Parse custom services if string or array
  let customServicesList: any[] = [];
  if (Array.isArray(expert.custom_services)) {
    customServicesList = expert.custom_services;
  } else if (typeof expert.custom_services === "string") {
    try {
      customServicesList = JSON.parse(expert.custom_services);
    } catch {
      customServicesList = [];
    }
  }

  // Parse astrology services from API
  if (Array.isArray(expert.astrology_services)) {
    expert.astrology_services.forEach((svc: any) => {
      if (!customServicesList.some((s) => s.name === svc.name)) {
        customServicesList.push(svc);
      }
    });
  }

  const expertName = expert.name || expert.user?.name || "Astrologer";
  const ratingScore = Number(expert.ratings ?? expert.rating ?? 4.9);
  const expYears = expert.experience_in_years ?? expert.experience;

  return (
    <div className="w-full flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <Tabs
          value={activeTab}
          onValueChange={(val) => handleTabChange(val as any)}
          className="w-full"
        >
          {/* ─────────────────────────────────────────────────────────────
              1. DESKTOP VIEW: 5-Pill Unified Segmented Control Track
              ───────────────────────────────────────────────────────────── */}
          <TabsList className="hidden sm:grid sm:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs mb-7 w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const TabIcon = tab.icon;
              const count = tab.count;

              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  onClick={(e) => handleTabChange(tab.key, e.currentTarget)}
                  className={cn(
                    "group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer select-none outline-none border",
                    isActive
                      ? "bg-orange text-white border-transparent shadow-xs font-bold"
                      : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent font-medium",
                  )}
                >
                  {/* Icon & Label */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/80 text-slate-600 group-hover:bg-orange/10 group-hover:text-orange",
                      )}
                    >
                      <TabIcon className="size-3.5 lg:size-4" />
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={cn(
                          "text-xs lg:text-sm leading-tight truncate",
                          isActive
                            ? "text-white font-bold"
                            : "text-slate-700 group-hover:text-slate-900 font-semibold",
                        )}
                      >
                        <span className="hidden xl:inline">{tab.label}</span>
                        <span className="xl:hidden">{tab.shortLabel}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Count Badge */}
                  {typeof count === "number" && count > 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1",
                        isActive
                          ? "bg-white text-orange"
                          : "bg-slate-200 text-slate-600 group-hover:bg-slate-300",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* ─────────────────────────────────────────────────────────────
              2. MOBILE VIEW: Horizontally Scrollable Segmented Track with Edge Fade Masks
              ───────────────────────────────────────────────────────────── */}
          <div className="relative block sm:hidden mb-6">
            {/* Left Fade Mask */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-10 rounded-l-2xl" />
            )}

            {/* Right Fade Mask */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-10 rounded-r-2xl" />
            )}

            {/* Segmented Track */}
            <TabsList
              ref={tabsContainerRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
              className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing scroll-smooth w-full border-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const TabIcon = tab.icon;
                const count = tab.count;

                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    onClick={(e) => handleTabChange(tab.key, e.currentTarget)}
                    className={cn(
                      "shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-center outline-none border",
                      isActive
                        ? "bg-orange text-white font-bold border-transparent shadow-xs"
                        : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border-transparent font-medium",
                    )}
                  >
                    <TabIcon
                      className={cn(
                        "size-3.5 shrink-0",
                        isActive ? "text-white" : "text-slate-500",
                      )}
                    />
                    <span className="text-xs leading-tight truncate whitespace-nowrap font-semibold">
                      {tab.shortLabel}
                    </span>
                    {typeof count === "number" && count > 0 && (
                      <span
                        className={cn(
                          "text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0",
                          isActive
                            ? "bg-white text-orange"
                            : "bg-slate-200 text-slate-600",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[280px]">
            {/* ── 1. About Tab ── */}
            <TabsContent value="about" className="outline-none">
              <div className="space-y-6">
                {/* Introduction Box */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Compass className="size-5 text-orange" />
                    <span>About {expertName}</span>
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70">
                    {expert.about || expert.bio ? (
                      expert.about || expert.bio
                    ) : (
                      <p className="text-slate-400 italic">
                        No detailed description provided yet by this consultant.
                      </p>
                    )}
                  </div>
                </div>

                {/* Specializations from API */}
                {specializationNames.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <Sparkles className="size-4 text-orange" />
                      <span>Specializations & Areas of Guidance</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specializationNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 bg-gradient-to-r from-[#d9eff4] via-[#e6f6f9] to-[#f4fcfe] border-2 border-white shadow-[0_2px_6px_rgba(15,23,42,0.06)] hover:shadow-sm hover:scale-[1.02] transition-all cursor-default"
                        >
                          <Sparkles className="size-3.5 text-slate-700 shrink-0" />
                          <span>{name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Professions & Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {professionNames.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-orange" />
                        <span>Verified Professions</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {professionNames.map((prof, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs"
                          >
                            {prof}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {languagesList.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Compass className="size-4 text-orange" />
                        <span>Languages for Consultation</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {languagesList.map((lang, lIdx) => (
                          <span
                            key={lIdx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Specialized Advisory Services from API (if present) */}
                {customServicesList.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Layers className="size-5 text-orange" />
                      <span>Specialized Advisory Consultations</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {customServicesList.map((service, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs hover:border-orange/40 transition-colors"
                        >
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">
                              {service.name ||
                                service.title ||
                                "Consultation Service"}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {service.unit || service.duration || "per session"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-emerald-600">
                              ₹{service.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── 2. Experience & Bio Tab ── */}
            <TabsContent value="experience" className="outline-none">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="size-5 text-orange" />
                    <span>Astrological Lineage & Background</span>
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70">
                    {expert.bio || expert.about ? (
                      expert.bio || expert.about
                    ) : (
                      <p className="text-slate-400 italic">
                        No detailed biography provided yet by this consultant.
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience Summary */}
                {typeof expYears === "number" && expYears > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-orange text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                      {expYears}+
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {expYears} Years of Astrological Practice
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Providing guidance in Vedic predictions, Kundli analysis,
                        and spiritual counseling.
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Experience Milestones from API */}
                {Array.isArray(expert.detailed_experience) &&
                  expert.detailed_experience.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Key Career Milestones
                      </h4>
                      <div className="space-y-3">
                        {expert.detailed_experience.map((exp: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70"
                          >
                            <Calendar className="size-4 text-orange shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {exp.title || exp.role || `Milestone ${i + 1}`}
                              </span>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {exp.description || exp.details || exp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>

            {/* ── 3. Reviews Tab ── */}
            <TabsContent value="reviews" className="outline-none">
              <div className="space-y-6">
                {/* Rating Summary Header */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="size-16 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center shadow-md">
                      <span className="text-2xl font-black">
                        {ratingScore.toFixed(1)}
                      </span>
                      <div className="flex text-white text-[9px] gap-0.5">
                        <Star className="size-2.5 fill-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        Overall Client Rating
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Based on verified consultations and feedback
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="block text-xl font-extrabold text-slate-900">
                      {totalReviews || reviews.length}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Verified Reviews
                    </span>
                  </div>
                </div>

                {/* Reviews List */}
                <div
                  className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1"
                  data-lenis-prevent="true"
                >
                  {loadingReviews ? (
                    <ReviewSkeleton />
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                              <Image
                                src={
                                  review.user?.avatar ||
                                  (review as any).client?.avatar ||
                                  "/images/dummy-expert.jpg"
                                }
                                alt={
                                  review.user?.name ||
                                  (review as any).client?.name ||
                                  "Seeker"
                                }
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-bold text-sm text-slate-900">
                                  {review.user?.name ||
                                    (review as any).client?.name ||
                                    "Seeker"}
                                </h5>
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                                  <CheckCircle2 className="size-2.5" />
                                  Verified
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {(() => {
                                  const dateStr =
                                    (review as any).createdAt ||
                                    (review as any).created_at ||
                                    (review as any).date;
                                  const date = new Date(dateStr);
                                  return isNaN(date.getTime())
                                    ? "Recently"
                                    : date.toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      });
                                })()}
                              </p>
                            </div>
                          </div>

                          <div className="flex text-amber-500 text-xs bg-amber-50 px-2.5 py-1 rounded-full gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic border-l-2 border-orange/40 pl-3 py-0.5 font-normal">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Star className="size-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">
                        No reviews yet for this consultant.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Be the first to leave a review after your consultation
                        session.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

          {/* ── 4. Gallery Tab ── */}
          <TabsContent value="gallery" className="outline-none">
            {!visitedTabs.has("gallery") ? (
              <GallerySkeleton />
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[400px] overflow-y-auto pr-1"
                data-lenis-prevent="true"
              >
                {expert.gallery && expert.gallery.length > 0 ? (
                  expert.gallery.map((img: string, index: number) => (
                    <LazyGalleryImage
                      key={index}
                      src={img}
                      index={index}
                      onClick={() => onImageClick(img)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ImageIcon className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      No gallery photos uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ── 5. Videos Tab ── */}
          <TabsContent value="videos" className="outline-none">
            {!visitedTabs.has("videos") ? (
              <VideosSkeleton />
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1"
                data-lenis-prevent="true"
              >
                {expert.videos && expert.videos.length > 0 ? (
                  expert.videos.map((vid: string, index: number) => (
                    <LazyVideoThumb
                      key={index}
                      vid={vid}
                      index={index}
                      onClick={() => onVideoClick(vid)}
                    />
                  ))
                ) : expert.video ? (
                  <LazyVideoThumb
                    vid={expert.video}
                    index={0}
                    onClick={() => onVideoClick(expert.video!)}
                  />
                ) : (
                  <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <VideoIcon className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      No video clips uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </div>
  );
};

export default ExpertContentSection;

