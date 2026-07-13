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
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import FamousPlacesSeoContent from "./famous-places-seo.component";

// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_PLACES: Place[] = [
  {
    title: "Kashi Vishwanath Temple",
    slug: "kashi-vishwanath",
    address: "Varanasi, Uttar Pradesh",
    rating: 4.9,
    thumbnailUrl: "/images/kashi.jpg",
    description: "One of the most famous Hindu temples dedicated to Lord Shiva."
  } as any,
  {
    title: "Mata Vaishno Devi",
    slug: "vaishno-devi",
    address: "Katra, Jammu and Kashmir",
    rating: 4.8,
    thumbnailUrl: "/images/famous-temples-banner.png",
    description: "A manifestation of the Hindu Mother Goddess."
  } as any,
  {
    title: "Golden Temple",
    slug: "golden-temple",
    address: "Amritsar, Punjab",
    rating: 4.9,
    thumbnailUrl: "/images/temple-categories-banner.png",
    description: "The preeminent spiritual site of Sikhism."
  } as any,
  {
    title: "Tirupati Balaji",
    slug: "tirupati-balaji",
    address: "Tirumala, Andhra Pradesh",
    rating: 4.8,
    thumbnailUrl: "/images/online-puja-banner.png",
    description: "Dedicated to Lord Venkateswara, a form of Vishnu."
  } as any
];

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
        setTemples(t?.length > 0 ? t : DUMMY_PLACES);
        setPilgrimages(p?.length > 0 ? p : DUMMY_PLACES);
      } catch (err) {
        console.warn("⚠️ Failed to fetch places:", err);
        setTemples(DUMMY_PLACES);
        setPilgrimages(DUMMY_PLACES);
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
      setSearchResults(results?.length > 0 ? results : DUMMY_PLACES);
    } catch (err) {
      console.warn("⚠️ Search failed:", err);
      setSearchResults(DUMMY_PLACES);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = async (cat: typeof TEMPLE_CATEGORIES[number]) => {
    setActiveCategory(cat.label);
    setIsCategoryLoading(true);
    try {
      const results = await fetchPlaces(cat.query, "India");
      setCategoryResults(results?.length > 0 ? results : DUMMY_PLACES);
    } catch (err) {
      console.warn("⚠️ Category search failed:", err);
      setCategoryResults(DUMMY_PLACES);
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
        <GuidanceCTA 
          className="mt-12"
          subtitle="Personalized Guidance"
          title="Want to know which temple is best for you?"
          description="Talk to our Astrology Experts and get personalized temple recommendations."
          buttonText="Talk to Expert"
          buttonLink="/chat"
          buttonIcon="fa-solid fa-comments"
        />
        {/* 6. SEO Content */}
        <FamousPlacesSeoContent />
      </div>

      {/* Global loading overlay */}
      {(isSearching || isCategoryLoading) && <Loading fullScreen />}
    </div>
  );
};

export default FamousPlacesPage;
