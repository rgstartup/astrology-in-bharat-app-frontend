"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { api as http, API_ROUTES } from "@/actions";
import {
  DevotionalRitualItem,
  PaginatedDevotionalRitualResponse,
} from "@repo/lib";
import { DevotionalRitualCard } from "./DevotionalRitualCard";
import { usePujaTranslations } from "@/i18n/usePujaTranslations";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { PujaSkeletonCard } from "./PujaSkeletonCard";
import { ChevronDown, Search, Sparkles } from "lucide-react";

const DUMMY_RITUALS: DevotionalRitualItem[] = [
  {
    id: "rudrabhishek-puja-1",
    slug: "rudrabhishek-puja",
    title: "Rudrabhishek Puja",
    deity: "Lord Shiva",
    description:
      "Sacred abhishekam of Shiva Linga with Panchamrit and Gangajal while chanting Sri Rudram to eradicate negative karmas and invoke peace and good health.",
    significance:
      "Destroys sins, cures prolonged illnesses, and brings spiritual peace and mental clarity.",
    default_samagri_list: [
      { item: "Gangajal", quantity: "500 ml" },
      { item: "Cow Milk", quantity: "1 litre" },
      { item: "Curd (Dahi)", quantity: "250 gm" },
      { item: "Honey (Madhu)", quantity: "100 gm" },
      { item: "Ghee", quantity: "250 gm" },
      { item: "Belpatra", quantity: "21 pcs" },
      { item: "Dhatura & Bhasma", quantity: "1 packet" },
      { item: "Camphor (Karpuram)", quantity: "50 gm" },
    ],
    suggested_duration_hours: 2.5,
    icon: "fa-solid fa-om",
    image_url: "/images/pooja/pooja1.png",
    sort_order: 1,
    is_active: true,
    created_at: "2026-09-15T11:56:37.000Z",
    updated_at: "2026-09-15T11:56:37.000Z",
  },
  {
    id: "navgraha-shanti-puja-2",
    slug: "navgraha-shanti-puja",
    title: "Navagraha Shanti Puja & Havan",
    deity: "Navagraha",
    description:
      "Comprehensive Vedic havan to appease the nine planetary deities and neutralize adverse planetary dashas and doshas.",
    significance:
      "Removes doshas, brings prosperity, success in career and business, and shields from negative cosmic influences.",
    default_samagri_list: [
      { item: "Navadhanya (9 Grains)", quantity: "1 set" },
      { item: "Havan Samagri", quantity: "500 gm" },
      { item: "Pure Desi Ghee", quantity: "500 gm" },
      { item: "Navagraha Samidha Wood", quantity: "1 bundle" },
      { item: "Dry Coconut (Gola)", quantity: "2 pcs" },
    ],
    suggested_duration_hours: 3.0,
    icon: "fa-solid fa-fire-flame-curved",
    image_url: "/images/pooja/pooja2.png",
    sort_order: 2,
    is_active: true,
    created_at: "2026-09-15T11:56:37.000Z",
    updated_at: "2026-09-15T11:56:37.000Z",
  },
  {
    id: "mahalakshmi-puja-3",
    slug: "mahalakshmi-puja",
    title: "Maha Lakshmi Kuber Puja",
    deity: "Goddess Lakshmi",
    description:
      "Auspicious invocation of Goddess Lakshmi and Lord Kuber to attract unending wealth, prosperity, and financial stability.",
    significance:
      "Clears debts, invites abundance, unlocks stagnant finances, and brings harmony to the household.",
    default_samagri_list: [
      { item: "Kamalgatta Mala & Seeds", quantity: "1 set" },
      { item: "Gulab Jal & Attar", quantity: "1 bottle" },
      { item: "Kesar (Saffron)", quantity: "1 gm" },
      { item: "Panchamrit Samagri", quantity: "1 set" },
    ],
    suggested_duration_hours: 2.0,
    icon: "fa-solid fa-coins",
    image_url: "/images/pooja/pooja1.png",
    sort_order: 3,
    is_active: true,
    created_at: "2026-09-15T11:56:37.000Z",
    updated_at: "2026-09-15T11:56:37.000Z",
  },
  {
    id: "ganesh-ganapathi-homam-4",
    slug: "ganapathi-homam",
    title: "Ganapathi Homam",
    deity: "Lord Ganesha",
    description:
      "Powerful Vedic ritual invoking Lord Ganesha to remove obstacles (Vighnaharta) before new ventures, weddings, or housewarmings.",
    significance:
      "Removes roadblocks in career, education, and business, and blesses with intellect and wisdom.",
    default_samagri_list: [
      { item: "Modak & Ladoo", quantity: "21 pcs" },
      { item: "Durva Grass", quantity: "21 bundles" },
      { item: "Red Flowers", quantity: "1 bunch" },
      { item: "Havan Samagri & Ghee", quantity: "1 kg" },
    ],
    suggested_duration_hours: 2.0,
    icon: "fa-solid fa-hand-holding-heart",
    image_url: "/images/pooja/pooja2.png",
    sort_order: 4,
    is_active: true,
    created_at: "2026-09-15T11:56:37.000Z",
    updated_at: "2026-09-15T11:56:37.000Z",
  },
];

const ALL_DEITIES_LABEL = "All Deities";

const PujaListSection = () => {
  const { lang, translations } = usePujaTranslations();
  const t = translations;

  const [rituals, setRituals] = useState<DevotionalRitualItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeity, setSelectedDeity] = useState(ALL_DEITIES_LABEL);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRituals = async () => {
      setLoading(true);
      const [res, error] = (await http.get<PaginatedDevotionalRitualResponse>(
        `${API_ROUTES.DEVOTION.RITUALS}?page=1&limit=20&is_active=true&sort_by=sort_order&order=ASC`,
      )) as any;

      if (error || !res?.data || res.data.length === 0) {
        if (error) {
          console.warn(
            "⚠️ Failed to fetch devotional rituals, using fallback data.",
            error,
          );
        }
        setRituals(DUMMY_RITUALS);
      } else {
        setRituals(res.data);
      }
      setLoading(false);
    };
    fetchRituals();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute unique deities for filter dropdown
  const uniqueDeities = [
    ALL_DEITIES_LABEL,
    ...Array.from(
      new Set(
        rituals
          .map((r) => r.deity)
          .filter((d): d is string => Boolean(d && d.trim() !== "")),
      ),
    ),
  ];

  const filteredRituals = rituals.filter((ritual) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      ritual.title.toLowerCase().includes(query) ||
      (ritual.description || "").toLowerCase().includes(query) ||
      (ritual.significance || "").toLowerCase().includes(query) ||
      (ritual.deity || "").toLowerCase().includes(query);

    const matchesDeity =
      selectedDeity === ALL_DEITIES_LABEL || ritual.deity === selectedDeity;

    return matchesSearch && matchesDeity;
  });

  const displayRituals =
    !loading && filteredRituals.length > 0 && filteredRituals.length < 3
      ? [
          ...filteredRituals,
          ...DUMMY_RITUALS.filter(
            (d) => !filteredRituals.some((fr) => fr.id === d.id),
          ).slice(0, 3 - filteredRituals.length),
        ]
      : !loading && filteredRituals.length === 0 && searchQuery === ""
        ? DUMMY_RITUALS
        : filteredRituals;

  return (
    <section
      id="sacred-pujas"
      className="pt-8 pb-12 relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 z-20">
          <div
            className="text-white mb-0 md:mb-2 w-full md:w-auto"
            style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
          >
            <h2 className="section-heading-premium mb-0">
              <span>
                Devotional Rituals &amp;{" "}
                <span className="text-orange-600">Pujas</span>
              </span>
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 relative">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
              <input
                type="text"
                placeholder={
                  t.filters.searchPlaceholder || "Search rituals or deity..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#d95a00] text-white rounded-xl focus:ring-2 focus:ring-[#d95a00]/30 hover:border-[#ff6b00] outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>

            {/* Deity Category Dropdown */}
            <div className="relative w-full sm:w-48 md:w-56" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-[#d95a00] rounded-xl focus:ring-2 focus:ring-[#d95a00]/30 hover:border-[#ff6b00] outline-none text-sm font-bold text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{selectedDeity}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${isDropdownOpen ? "rotate-180 text-orange-500" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-full md:w-64 bg-[#301118] border border-white/10 rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto animate-in fade-in z-50">
                  {uniqueDeities.map((deity) => (
                    <button
                      key={deity}
                      type="button"
                      onClick={() => {
                        setSelectedDeity(deity);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-600 hover:text-white transition-colors cursor-pointer ${
                        selectedDeity === deity
                          ? "text-orange-400 bg-black/30 font-bold"
                          : "text-gray-300 font-medium"
                      }`}
                    >
                      {deity}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && rituals.length === 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`ritual-skeleton-${i}`} className="w-full h-full">
                <PujaSkeletonCard />
              </div>
            ))}
          </div>
        ) : filteredRituals.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/10 mt-4">
            <p className="text-white text-base font-semibold mb-2">
              No rituals found matching your selection
            </p>
            <p className="text-gray-400 text-xs mb-4">
              Try changing the search query or deity filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDeity(ALL_DEITIES_LABEL);
              }}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative mt-6 md:px-10 mb-0 z-10">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-5 py-2">
                {displayRituals.map((ritual) => (
                  <CarouselItem
                    key={ritual.id}
                    className="pl-4 md:pl-5 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-auto flex"
                  >
                    <div className="w-full h-full">
                      <DevotionalRitualCard ritual={ritual} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:flex -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white text-orange-600 hover:bg-orange-50 border-orange-200 shadow-xl size-10 z-20 cursor-pointer" />
              <CarouselNext className="hidden md:flex -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white text-orange-600 hover:bg-orange-50 border-orange-200 shadow-xl size-10 z-20 cursor-pointer" />
            </Carousel>
          </div>
        )}

        {!loading && (
          <div className="view-all mt-6 md:mt-8 text-center">
            <Link
              href="/astrology/online-puja"
              className="no-underline bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit active:scale-95 shadow-orange-900/40 hover:translate-y-[-2px]"
            >
              <i className="fa-solid fa-om text-lg"></i>
              {t.page.viewAll || "View All Rituals & Pujas"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PujaListSection;
