"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AstrologerList from "@/components/main/AstrologerList";
import AstrologerServices from "@/components/main/AstrologyServices";
import ChooseYourZodiac from "@/components/main/ChooseYourZodiac";
import AstrologyProduct from "@/components/main/AstrologyProduct";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import Testimonial from "@/components/main/Testimonial";
import CTA from "@/components/main/CTA";
import HeroSection from "@/components/main/HeroSection";




import AstrologerCard from "@/components/AstrologerCard";
import SearchBar from "@/components/SearchBar";
import ProductsCarousel from "@/components/ProductsCarousel";
import FilterModal from "@/components/FilterModal";
import SortModal from "@/components/SortModal";
import CompleteProfileModal from "@/components/CompleteProfileModal";
import SpecializationCarousel from "@/components/SpecializationCarousel";

interface FilterState {
  location: string;
  language: string;
  rating: number;
  price: number;
}

const Page: React.FC = () => {
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>(
    {}
  );
  const [appliedSort, setAppliedSort] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // Immediate input value
  const [searchQuery, setSearchQuery] = useState<string>(""); // Debounced search query
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  

  // Debounce search input with 0.8 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800); // 0.8 seconds

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleApplyFilters = (filters: FilterState) => {
    // store applied filters and reset pagination
    setAppliedFilters(filters);
    setOffset(0);
    setIsFilterOpen(false);
  };

  

  const handleApplySorts = (sorts: {
    experience: string;
    price: string;
    rating: string;
  }) => {
    // sorts is a SortState-like object with one field set

    // determine which sort is applied
    const sortKey =
      sorts.experience && sorts.experience !== "none"
        ? "experience"
        : sorts.rating && sorts.rating !== "none"
          ? "rating"
          : null;
    setAppliedSort(sortKey);
    setOffset(0);
    setIsSortOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchInput(query); // Update input immediately for responsive typing
    // Debounced search query will update after 0.8s via useEffect
  };

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setOffset(0); // Reset pagination when specialization changes
  };

  const buildQueryString = () => {
    const params: Record<string, any> = {};
    params.limit = limit;
    params.offset = offset;

    // Specialization from carousel (backend supports this)
    if (selectedSpecialization) params.specializations = selectedSpecialization;

    if (appliedFilters.location) params.location = appliedFilters.location;
    if (appliedFilters.language) params.languages = appliedFilters.language;
    if (appliedFilters.rating) params.minRating = appliedFilters.rating;
    if (appliedFilters.price) params.maxPrice = appliedFilters.price;
    if (appliedSort) params.sort = appliedSort;

    const esc = encodeURIComponent;
    return Object.keys(params)
      .map((k) => `${esc(k)}=${esc(params[k])}`)
      .join("&");
  };

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString();
      const url = `http://localhost:4000/api/v1/expert/profile/list?${qs}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      const data = json.data || [];
      setTotal(json.pagination?.total ?? null);

      // Map backend profile -> AstrologerCard shape
      const mapped = data.map((p: any) => ({
        image: p.user?.avatar || "/images/astro-img1.png",
        name: p.user?.name || p.name || "Unknown",
        expertise: p.specialization || p.expertise || "",
        experience: p.experience_in_years ?? p.experience ?? 0,
        language: Array.isArray(p.languages)
          ? p.languages.join(", ")
          : p.languages || p.user?.language || "",
        price: p.price_per_minute ?? p.price ?? 0,
        video: p.video || "",
        ratings: p.rating ?? p.ratings ?? 0,
      }));

      // If offset is zero replace list, otherwise append for "Load more" behavior
      setExperts((prev) => (offset === 0 ? mapped : [...prev, ...mapped]));
      console.log("Fetched experts:", mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch experts");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchExperts();
  }, [appliedFilters, appliedSort, limit, offset, selectedSpecialization]);
  return (
    <>
    {/* Hero Section  */}
    <HeroSection/>
     
{/* Astrologer list  */}
<AstrologerList/>
{/* Astrology Services  */}
<AstrologerServices/>
{/* choose your zodiac section  */}
<ChooseYourZodiac/>
{/* Astrology Product  */}

<AstrologyProduct/>

{/* Why Choose us Section  */}
<WhyChooseUs/>

{/* Testimonials  */}
<Testimonial/>


      {/* <!-- Astrology in Bharat : CTA Section --> */}
      <CTA/>
     
    </>
  );
};

export default Page;
