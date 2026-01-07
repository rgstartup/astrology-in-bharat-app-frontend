"use client";

import React, { useEffect, useState } from "react";
import { fetchPlaces, Place } from "@/libs/serp-api";
import PlaceCard from "@/components/features/famous-places/PlaceCard";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";

const FamousPlacesPage = () => {
  const [temples, setTemples] = useState<Place[]>([]);
  const [pilgrimages, setPilgrimages] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch Mohali/Chandigarh Temples
        const mohaliTemples = await fetchPlaces(
          "Best Temples in Mohali and Chandigarh",
          "Mohali, Punjab, India"
        );
        setTemples(mohaliTemples);

        // Fetch Holy Pilgrimages in India
        const indianPilgrimages = await fetchPlaces(
          "Famous Holy Pilgrimage sites in India",
          "India"
        );
        setPilgrimages(indianPilgrimages);
      } catch (err) {
        console.error("Failed to fetch places", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-border-light"
        >
          <div className="h-56 bg-gray-200"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Hero Header */}
      <section className="banner-part back-img text-white py-20 px-4 relative overflow-hidden">
        <div className="overlay-hero">
          <div className="container relative z-10 text-center">
            <span className="aib-trust-badge mb-4 mx-auto inline-block">
              ॐ Spiritual Guide & Local Directory
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">
              Divine Destinations &{" "}
              <span className="italic text-[#F25E0A]">Famous Places</span>
            </h1>
            <p className="text-lg text-white max-w-3xl mx-auto font-body leading-relaxed drop-shadow-lg">
              Unlock the spiritual energy of Bharat. Explore sacred temples in
              Mohali and Chandigarh, or embark on a life-changing pilgrimage
              across the holiest sites in India.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-16 px-4 space-y-24">
        {/* Mohali/Chandigarh Temples Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="title-line text-black mb-4">
              <span>Sacred Temples in Mohali & Chandigarh</span>
            </h2>
            <p className="text-text-sub-dark max-w-xl mx-auto">
              Discover peace and tranquility in the finest local temples, known
              for their architectural beauty and spiritual significance.
            </p>
          </div>

          {loading ? (
            <Skeleton />
          ) : temples.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {temples.map((place, idx) => (
                <PlaceCard key={idx} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#1e0b0f6e] rounded-3xl border border-dashed border-[#fd641054]">
              <p className="text-gray-400 italic">
                No divine results found at the moment. Please try again.
              </p>
            </div>
          )}
        </section>

        {/* Holy Pilgrimage Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="title-line text-black mb-4">
              <span>Holy Pilgrimage Across India</span>
            </h2>
            <p className="text-text-sub-dark max-w-xl mx-auto">
              Explore the widely revered pilgrimage sites that define
              India&apos;s rich spiritual heritage and tradition.
            </p>
          </div>

          {loading ? (
            <Skeleton />
          ) : pilgrimages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pilgrimages.map((place, idx) => (
                <PlaceCard key={idx} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#1e0b0f6e] rounded-3xl border border-dashed border-[#fd641054]">
              <p className="text-gray-400 italic">
                Exploring India&apos;s pilgrimage sites... please check back
                shortly.
              </p>
            </div>
          )}
        </section>
      </main>
      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default FamousPlacesPage;
