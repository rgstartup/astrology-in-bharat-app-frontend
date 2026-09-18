"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  ProductGroup,
  ProductType,
  type Product,
} from "@repo/lib";
import { getProductImageUrl } from "@/utils/image-utils";
import { RemedyItem, RemedyTabKey } from "./types";
import { REMEDY_TABS_CONFIG } from "./remedies.data";
import { RemediesTabsHeader } from "./RemediesTabsHeader";
import { RemediesGrid } from "./RemediesGrid";

interface ExpertRemediesClientProps {
  expertId: string;
  expertName: string;
  initialProducts?: any[];
}

/**
 * Normalizes a raw backend Product or RemedyItem into a RemedyItem
 */
const normalizeBackendProduct = (item: any): RemedyItem => {
  if (item.productGroup && item.categoryName) {
    return item as RemedyItem;
  }

  const product: Product = item.product || item;
  const relationType = item.relation_type;
  const group = (product.product_group || item.product_group || ProductGroup.ITEM) as ProductGroup;
  const imageUrl = getProductImageUrl(product);
  const price = Number(
    product.price ??
      product.variants?.[0]?.pricing?.[0]?.amount ??
      0,
  );
  const originalPrice = Number(product.original_price ?? 0);
  const discountPercent =
    product.percentage_off ||
    (originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined);

  return {
    id: product.id || item.id || Math.random().toString(36).substring(7),
    name: product.name || "Astrological Remedy",
    slug: product.slug,
    categoryName:
      product.category?.toString() ||
      (group === ProductGroup.REPORT
        ? "Astrology Report"
        : group === ProductGroup.RITUAL
          ? "Puja & Ritual"
          : group === ProductGroup.BOOK
            ? "Sacred Text"
            : group === ProductGroup.SESSION
              ? "Specialized Consultation"
              : "Remedy & Yantra"),
    description:
      product.description ||
      "Energized astrological remedy prepared with sacred Vedic rituals.",
    shortDescription: product.short_description || undefined,
    productGroup: group,
    productType: product.type || ProductType.PHYSICAL,
    price: price > 0 ? price : 999,
    originalPrice: originalPrice > price ? originalPrice : undefined,
    discountPercent,
    rating: Number(product.rating || product.ratings || 4.9),
    reviewCount: Number(product.review_count || product.reviews_count || 10),
    imageUrl,
    relationType,
    inStock: product.is_active !== false,
  };
};

export const ExpertRemediesClient: React.FC<ExpertRemediesClientProps> = ({
  expertId,
  expertName,
  initialProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState<RemedyTabKey>("reports");

  // Group real API products by tab key
  const categorizedProducts = useMemo(() => {
    const map: Record<RemedyTabKey, RemedyItem[]> = {
      reports: [],
      rituals: [],
      gemstones: [],
      books: [],
      consultations: [],
    };

    if (Array.isArray(initialProducts)) {
      initialProducts.forEach((item) => {
        const normalized = normalizeBackendProduct(item);
        if (normalized.productGroup === ProductGroup.REPORT) {
          map.reports.push(normalized);
        } else if (normalized.productGroup === ProductGroup.RITUAL) {
          map.rituals.push(normalized);
        } else if (normalized.productGroup === ProductGroup.BOOK) {
          map.books.push(normalized);
        } else if (normalized.productGroup === ProductGroup.SESSION) {
          map.consultations.push(normalized);
        } else {
          map.gemstones.push(normalized);
        }
      });
    }

    return map;
  }, [initialProducts]);

  // Tab counts based purely on real API data
  const tabCounts = useMemo(() => {
    return {
      reports: categorizedProducts.reports.length,
      rituals: categorizedProducts.rituals.length,
      gemstones: categorizedProducts.gemstones.length,
      books: categorizedProducts.books.length,
      consultations: categorizedProducts.consultations.length,
    };
  }, [categorizedProducts]);

  const currentTabConfig = useMemo(() => {
    return (
      REMEDY_TABS_CONFIG.find((t) => t.key === activeTab) ||
      REMEDY_TABS_CONFIG[0]
    );
  }, [activeTab]);

  const currentItems = categorizedProducts[activeTab] || [];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2.5">
              <Sparkles className="size-3.5 text-orange" />
              <span>Prescribed Vedic Upayas & Spiritual Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Recommended Remedies & Services by {expertName}
            </h2>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1.5 leading-relaxed">
              Explore authentic horoscope reports, sacred rituals, certified gemstones, ancient scriptures, and 1-on-1 private sessions curated for your spiritual elevation.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange hover:text-[#d35400] transition-colors shrink-0 group self-start lg:self-end"
          >
            <span>Browse Full Spiritual Store</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5-Tab Header Navigation */}
        <div className="mb-6">
          <RemediesTabsHeader
            tabs={REMEDY_TABS_CONFIG}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            counts={tabCounts}
          />
        </div>

        {/* Active Tab Grid Content (Real API Data) */}
        <RemediesGrid
          tabConfig={currentTabConfig}
          items={currentItems}
          expertName={expertName}
          expertId={expertId}
        />

        {/* Trust & Guarantee Strip */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
            <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">100% Certified & Authentic</h4>
              <p className="text-[11px] text-gray-500">Govt. lab tested gems & genuine scriptures</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
            <div className="size-10 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Vedic Prana Pratishtha</h4>
              <p className="text-[11px] text-gray-500">Energized with sacred planetary mantras</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
            <div className="size-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Lock className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">100% Private & Confidential</h4>
              <p className="text-[11px] text-gray-500">Secure consultations & discreet packaging</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
