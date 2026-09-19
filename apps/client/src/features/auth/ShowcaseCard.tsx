"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Star,
  ShieldCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TOP_EXPERT_AVATARS = [
  { src: "/images/Expert.png", name: "Swami Krishnadev", fallback: "SK" },
  { src: "/images/Expert-h.png", name: "Acharya Rajesh", fallback: "AR" },
  { src: "/images/astro.png", name: "Ananya Iyer", fallback: "AI" },
  { src: "/images/dummy-expert.jpg", name: "Pt. Rameshwar", fallback: "PR" },
];

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  initials: string;
  location: string;
  tag: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Got absolute clarity on my career switch within a 15-min call. The planetary transit analysis and remedy suggested were spot on!",
    author: "Priya M.",
    initials: "PM",
    location: "Bengaluru • Career Astrology",
    tag: "Verified Consultation",
    rating: 5.0,
  },
  {
    id: "2",
    quote:
      "Kundli Milan & Guna score analysis was deeply insightful. Acharya ji guided us with immense patience through the Manglik dosha remedies.",
    author: "Rahul & Sneha",
    initials: "RS",
    location: "Mumbai • Kundli Matching",
    tag: "Verified Matchmaking",
    rating: 5.0,
  },
  {
    id: "3",
    quote:
      "Ordered the energized gemstone after consultation. Within 3 weeks, major obstacles in my business cleared up. Truly grateful!",
    author: "Vikram S.",
    initials: "VS",
    location: "Delhi • Business & Remedies",
    tag: "Verified Remedy",
    rating: 5.0,
  },
  {
    id: "4",
    quote:
      "Accurate Sade Sati predictions and practical daily remedies. The astrologer was deeply knowledgeable, compassionate, and attentive.",
    author: "Dr. Ananya K.",
    initials: "AK",
    location: "Hyderabad • Vedic Consultation",
    tag: "Verified Consultation",
    rating: 5.0,
  },
];

export const ShowcaseCard: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col justify-between h-full gap-5 sm:gap-6">
      {/* Top Hero Content */}
      <div>
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>India&apos;s Premier Vedic Platform</span>
        </div>

        {/* Main Title */}
        <h3 className="text-lg sm:text-xl text-stone-900 leading-snug tracking-tight mb-2">
          Connect with Verified Vedic Astrologers
        </h3>

        {/* Subtitle */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
          Unlock accurate Kundli predictions, love compatibility, career timing,
          and authentic Vedic remedies.
        </p>

        {/* AvatarGroup with Live Online Indicator */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50/70 border border-stone-200/80">
          {/* Overlapping AvatarGroup */}
          <div className="flex -space-x-2.5 overflow-hidden p-0.5 shrink-0">
            {TOP_EXPERT_AVATARS.map((expert, idx) => (
              <Avatar
                key={idx}
                className="size-9 border-2 border-white shadow-2xs ring-1 ring-stone-200/60"
              >
                <AvatarImage src={expert.src} alt={expert.name} />
                <AvatarFallback className="bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {expert.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
            <div className="size-9 rounded-full bg-amber-50 border-2 border-white text-amber-900 text-[10px] font-bold flex items-center justify-center shadow-2xs ring-1 ring-stone-200/60">
              +500
            </div>
          </div>

          {/* Live Indicator Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-stone-900 leading-none">
                120+ Astrologers Online Now
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate leading-none">
              Instant response via audio, video & chat
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Shadcn Infinite Draggable Testimonial Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full select-none"
        >
          <CarouselContent className="-ml-0">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-0 basis-full cursor-grab active:cursor-grabbing"
              >
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-4.5 bg-gradient-to-br from-amber-50/40 via-stone-50/60 to-orange-50/30 border border-amber-200/60 shadow-2xs min-h-[168px] flex flex-col justify-between">
                  <Quote className="absolute right-3.5 top-3.5 size-7 text-amber-500/15 pointer-events-none z-0" />

                  {/* Rating Stars + Verified Tag */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3.5 fill-amber-500 text-amber-500"
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-900 ml-1">
                        {testimonial.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold">
                      <ShieldCheck className="size-3 text-emerald-600" />
                      {testimonial.tag}
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p className="relative z-10 text-xs sm:text-[13px] text-stone-700 leading-relaxed italic mb-3">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author Row */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-gradient-to-br from-amber-500 to-orange text-white text-[11px] font-bold flex items-center justify-center shadow-2xs shrink-0">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 leading-none mb-0.5">
                          {testimonial.author}
                        </p>
                        <p className="text-[10px] text-stone-500 leading-none">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>

                    {/* Carousel Navigation Arrows */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          api?.scrollPrev();
                        }}
                        aria-label="Previous review"
                        className="size-6 rounded-full bg-white/80 hover:bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          api?.scrollNext();
                        }}
                        aria-label="Next review"
                        className="size-6 rounded-full bg-white/80 hover:bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {Array.from({ length: count || TESTIMONIALS.length }).map(
            (_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? "w-5 bg-orange"
                    : "w-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ),
          )}
        </div>
      </div>

      {/* Bottom: Trust Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-200/90 text-center">
        <div>
          <p className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
            500+
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-stone-500">
            Verified Gurus
          </p>
        </div>
        <div>
          <p className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
            100k+
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-stone-500">
            Consultations
          </p>
        </div>
        <div>
          <p className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
            4.9★
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-stone-500">
            50k+ Reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCard;
