"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchPlaces, Place } from "@/libs/serp-api";
import { Loading } from "@repo/ui";

// ── Local components (feature-specific) ──────────────────────────────────────
import FamousPlacesHero from "@/components/features/famous-places/FamousPlacesHero";
import FamousPlacesSearch from "@/components/features/famous-places/FamousPlacesSearch";
import PlacesSection from "@/components/features/famous-places/PlacesSection";
import TempleCategories from "@/components/features/famous-places/TempleCategories";
import {
  WhyVisitSidebar,
  ZodiacRecommendationSidebar,
  TodaysSpecialSidebar,
  AskExpertSidebar,
} from "@/components/features/famous-places/SidebarWidgets";
import { DEFAULT_QUERIES, TEMPLE_CATEGORIES } from "@/components/features/famous-places/constants";
import PlaceCard from "@/components/features/famous-places/PlaceCard";

// ─────────────────────────────────────────────────────────────────────────────

const FamousPlacesPage = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [temples, setTemples] = useState<Place[]>([]);
  const [pilgrimages, setPilgrimages] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [showAllTemples, setShowAllTemples] = useState(false);
  const [showAllPilgrimages, setShowAllPilgrimages] = useState(false);

  // ── Search state ────────────────────────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Place[]>([]);

  // ── Category state ───────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<Place[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // ── Initial data load ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [t, p] = await Promise.all([
          fetchPlaces(DEFAULT_QUERIES.temples.q, DEFAULT_QUERIES.temples.location),
          fetchPlaces(DEFAULT_QUERIES.pilgrimages.q, DEFAULT_QUERIES.pilgrimages.location),
        ]);
        setTemples(t);
        setPilgrimages(p);
      } catch (err) {
        console.error("Failed to fetch places:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = async (query: string, location?: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const results = await fetchPlaces(query, location || "India");
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = async (cat: typeof TEMPLE_CATEGORIES[number]) => {
    setActiveCategory(cat.label);
    setIsCategoryLoading(true);
    try {
      const results = await fetchPlaces(cat.query, "India");
      setCategoryResults(results);
    } catch (err) {
      console.error("Category search failed:", err);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const clearCategory = () => {
    setActiveCategory(null);
    setCategoryResults([]);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      
      {/* 1. Hero Banner */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 pt-2 pb-6 md:pt-4 md:pb-8">
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <FamousPlacesHero />
        </div>
      </div>

      {/* 2. Search Bar */}
      <FamousPlacesSearch onSearch={handleSearch} isSearching={isSearching} />

      {/* 3. Main content */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10">

        {/* 3a. Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900">
                Search Results <span className="text-orange-500">({searchResults.length})</span>
              </h2>
              <button onClick={clearSearch} className="text-sm text-gray-400 hover:text-orange-500 flex items-center gap-1 font-medium">
                <i className="fa-solid fa-xmark" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((place, idx) => (
                <PlaceCard key={place.id || `sr-${idx}`} place={place} />
              ))}
            </div>
          </section>
        )}

        {/* 3b. Two-column layout: listings + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Place Listings ── */}
          <div className="lg:col-span-2 space-y-10">
            <PlacesSection
              idPrefix="temples"
              title="Popular Temples Near You"
              subtitle="Showing results near your selected location"
              places={temples}
              loading={loading}
              showAll={showAllTemples}
              onToggleShowAll={() => setShowAllTemples((p) => !p)}
              emptyIcon="fa-place-of-worship"
              headerIcon={
                <Image src="/images/temple-icon-header.png" alt="Popular Temples" width={40} height={40} className="object-contain" />
              }
            />
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="space-y-6">
            <WhyVisitSidebar />
            <ZodiacRecommendationSidebar />
            <TodaysSpecialSidebar />
          </aside>
        </div>

        {/* 4. Explore by Categories */}
        <TempleCategories
          activeCategory={activeCategory}
          loading={isCategoryLoading}
          results={categoryResults}
          onSelect={handleCategorySelect}
          onClear={clearCategory}
        />

        {/* 5. Bottom CTA Banner */}
        <section className="mt-12 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-orange-400 font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto">
              Want to know which temple is best for you?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get personalized temple recommendations.
            </p>
          </div>
          <Link
            href="/chat"
            className="relative z-10 flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <i className="fa-solid fa-comments" /> Talk to Expert
          </Link>
        </section>
      </div>

      {/* Global loading overlay */}
      {(isSearching || isCategoryLoading) && <Loading fullScreen />}
    </div>
  );
};

export default FamousPlacesPage;
