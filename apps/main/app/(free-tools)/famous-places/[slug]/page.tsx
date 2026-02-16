"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPlaceImages, getPlaceBySlug, Place } from "@/libs/serp-api";
import Image from "next/image";
import Link from "next/link";

const PlaceDetailPage = () => {
  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getPlaceBySlug(slug as string);
    if (!data) {
      setLoading(false);
      return;
    }

    setPlace(data);

    const loadImages = async () => {
      const imgs = await fetchPlaceImages(data.title);
      setImages(imgs);
      setLoading(false);
    };

    loadImages();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center p-6 bg-white rounded-lg border border-slate-200 max-w-sm">
          <h2 className="text-base font-bold text-[#301118] mb-1">Not Found</h2>
          <Link
            href="/famous-places"
            className="text-xs font-bold text-primary"
          >
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const mainImage: string =
    (images && images.length > 0 && images[0] ? images[0] : "") ||
    (place.thumbnailUrl ? place.thumbnailUrl : "/images/image-not-found.png");

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* 1. Full-Width Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={place.title}
          fill
          className="object-cover"
          priority
        />
        {/* Black Overlay to darken image */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#301118]/80 via-transparent to-transparent"></div>

        {/* Navigation Over Hero */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link
              href="/famous-places"
              className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 no-underline"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Directory
            </Link>
            <div className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest">
              {place.category}
            </div>
          </div>
        </div>

        {/* Hero Title Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <div className="flex items-center text-primary">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[11px] font-bold ml-1">
                  {place.rating || "4.8"}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/40"></div>
              <span className="text-[10px] font-bold uppercase tracking-tight">
                Verified Sacred Site
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight tracking-tight drop-shadow-sm">
              {place.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Content Details Section */}
      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          <div className="flex-1 space-y-12">
            {/* Address Block - Prominent yet compact */}
            <div className="inline-flex items-start gap-3.5 p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm w-full max-w-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Location
                </span>
                <p className="text-[13px] text-[#301118] leading-relaxed font-semibold">
                  {place.address}
                </p>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Divine Visuals
                </span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <Image
                      src={img}
                      alt={`${place.title} visual ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Significance Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Divine Heritage
                </span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Explore the profound architectural marvel and spiritual
                    significance of {place.title}. Known for its historical
                    depth, this sacred site offers a sanctuary for peace and
                    meditation.
                  </p>
                </div>
                <div className="md:col-span-2 bg-slate-50/50 rounded-lg p-5 border border-slate-100/50">
                  <div className="space-y-3">
                    {[
                      "Ideal Visit: Brahma Muhurta",
                      "Media: Limited zones",
                      "Attire: Traditional preferred",
                      "Offerings: Local essentials",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-[11px] font-bold text-[#301118]/70"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Integrated & Sticky */}
          <div className="w-full md:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Timing Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                <div className="bg-[#301118] px-6 py-3.5 flex justify-between items-center text-white">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">
                    Plan Your Visit
                  </h4>
                  <svg
                    className="w-3 h-3 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3.5 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Darshan Timings
                      </span>
                      <span className="text-[12px] font-bold text-[#301118]">
                        05:00 - 21:00
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Special Aarti
                      </span>
                      <span className="text-[12px] font-bold text-[#301118]">
                        06:30 & 19:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Entry Fee
                      </span>
                      <span className="text-[12px] font-bold text-green-600">
                        Free Darshan
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + " " + place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary hover:bg-[#301118] text-white py-3 rounded-xl font-bold text-[11px] text-center no-underline transition-all uppercase tracking-widest"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-[#FFF9F5] p-6 rounded-2xl border border-primary/10 border-dashed">
                <h4 className="text-[10px] font-bold text-[#301118] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Need Guidance?
                </h4>
                <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">
                  Book a personalized spiritual consultation for your visit.
                </p>
                <button className="w-full bg-white border border-[#301118] text-[#301118] hover:bg-[#301118] hover:text-white py-2.5 rounded-lg font-bold text-[11px] transition-all uppercase tracking-widest">
                  Consult Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceDetailPage;
