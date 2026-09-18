"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import {
  ProductGroup,
  ProductType,
  DiscountType,
  ExpertProductRelationType,
  type Product,
  ExpertProduct,
} from "@repo/lib";
import { getProductImageUrl } from "@/utils/image-utils";
import { fetchExpertProducts } from "@/actions/expert-products";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { cn } from "@/lib/utils";
import { RemedyItem, RemedyTabConfig, RemedyTabKey } from "./types";
import { REMEDY_TABS_CONFIG } from "./remedies.data";
import { RemediesTabsHeader } from "./RemediesTabsHeader";
import { RemediesGrid } from "./RemediesGrid";

interface ExpertRemediesClientProps {
  expertId: string;
  expertName?: string;
  initialProducts?: (ExpertProduct | Product | RemedyItem)[];
  initialTab?: RemedyTabKey;
}

/**
 * Mapping of RemedyTabKey to backend ProductGroup enum
 */
export const TAB_PRODUCT_GROUP_MAP: Record<RemedyTabKey, ProductGroup> = {
  reports: ProductGroup.REPORT,
  rituals: ProductGroup.RITUAL,
  gemstones: ProductGroup.ITEM,
  books: ProductGroup.BOOK,
  consultations: ProductGroup.SESSION,
};

/**
 * Fallback category names per ProductGroup
 */
export const GROUP_CATEGORY_LABEL_MAP: Record<ProductGroup, string> = {
  [ProductGroup.REPORT]: "Astrology Report",
  [ProductGroup.RITUAL]: "Puja & Ritual",
  [ProductGroup.BOOK]: "Sacred Text",
  [ProductGroup.SESSION]: "Specialized Consultation",
  [ProductGroup.ITEM]: "Mala & Gemstone",
};

/**
 * Contextual CTA definitions per ProductGroup
 */
export const GROUP_CTA_MAP: Record<
  ProductGroup,
  { text: string; getLink: (id: string | number) => string }
> = {
  [ProductGroup.REPORT]: {
    text: "Get Report",
    getLink: (id) => `/shop/${id}`,
  },
  [ProductGroup.RITUAL]: {
    text: "Book Puja",
    getLink: (id) => `/astrology/online-puja/${id}`,
  },
  [ProductGroup.ITEM]: {
    text: "Order Now",
    getLink: (id) => `/shop/${id}`,
  },
  [ProductGroup.BOOK]: {
    text: "Buy Book",
    getLink: (id) => `/shop/${id}`,
  },
  [ProductGroup.SESSION]: {
    text: "Book Session",
    getLink: (id) => `/consultants/${id}`,
  },
};

/**
 * Normalizes a raw backend Product or RemedyItem into a typed RemedyItem
 */
const normalizeBackendProduct = (
  item: ExpertProduct | Product | RemedyItem,
  currentTab?: RemedyTabKey,
): RemedyItem => {
  if ("productGroup" in item && "categoryName" in item && item.price !== undefined) {
    return item;
  }

  const isExpertProduct = "product" in item && Boolean(item.product);
  const product: Product = isExpertProduct
    ? (item as ExpertProduct).product
    : (item as Product);
  const relationType = isExpertProduct
    ? (item as ExpertProduct).relation_type || ExpertProductRelationType.PROVIDER
    : ExpertProductRelationType.PROVIDER;

  const group = (
    product.product_group ||
    (currentTab
      ? TAB_PRODUCT_GROUP_MAP[currentTab]
      : TAB_PRODUCT_GROUP_MAP.reports)
  ) as ProductGroup;

  // Extract primary variant and its active pricing & promotions
  const primaryVariant =
    product.variants?.find((v) => v.is_default) || product.variants?.[0];

  const pricingList = primaryVariant?.pricing || [];
  const activePricing =
    pricingList.find((p) => p.is_active !== false) || pricingList[0];
  const price = Number(activePricing?.amount ?? 0);

  // Calculate original price and discount percentage purely from promotions
  const promotionsList = primaryVariant?.promotions || [];
  const activePromotion =
    promotionsList.find((p) => p.is_active !== false) || promotionsList[0];

  let discountPercent: number | undefined;
  let originalPrice: number | undefined;

  if (activePromotion) {
    if (activePromotion.discount_type === DiscountType.PERCENTAGE) {
      discountPercent = Number(activePromotion.discount_value);
      originalPrice =
        discountPercent > 0 && price > 0
          ? Math.round(price / (1 - discountPercent / 100))
          : undefined;
    } else if (activePromotion.discount_type === DiscountType.FIXED) {
      const discountVal = Number(activePromotion.discount_value);
      originalPrice = price + discountVal;
      discountPercent =
        originalPrice > price
          ? Math.round((discountVal / originalPrice) * 100)
          : undefined;
    }
  }

  const imageUrl = getProductImageUrl(product);
  const targetId = product.id || ("id" in item ? item.id : "");

  // Extract category name from categories array or fallback to group name
  const categoryName =
    product.categories?.[0]?.name ||
    GROUP_CATEGORY_LABEL_MAP[group] ||
    "Astrology Remedy";

  // Contextual CTA Text & Link based on product group
  const ctaConfig = GROUP_CTA_MAP[group];
  const ctaText = ctaConfig?.text || "View";
  const ctaLink = ctaConfig ? ctaConfig.getLink(targetId) : `/shop/${targetId}`;

  return {
    id: targetId || Math.random().toString(36).substring(7),
    name: product.name || "Astrological Remedy",
    slug: product.categories?.[0]?.slug,
    categoryName,
    description:
      product.description ||
      primaryVariant?.description ||
      "Energized astrological remedy prepared with sacred Vedic rituals.",
    shortDescription: primaryVariant?.description || undefined,
    productGroup: group,
    productType: product.type || ProductType.GOODS,
    price: price > 0 ? price : 0,
    originalPrice:
      originalPrice && originalPrice > price ? originalPrice : undefined,
    discountPercent,
    rating: 4.9,
    reviewCount: 10,
    imageUrl,
    relationType,
    inStock: product.is_active !== false,
    ctaText,
    ctaLink,
  };
};

export const ExpertRemediesClient: React.FC<ExpertRemediesClientProps> = ({
  expertId,
  expertName = "Consultant",
  initialProducts = [],
  initialTab = "reports",
}) => {
  const { isVisible: isHeaderVisible } = useHeaderScroll();
  const [activeTab, setActiveTab] = useState<RemedyTabKey>(initialTab);

  // Cache of products loaded per tab
  const [loadedTabs, setLoadedTabs] = useState<
    Record<RemedyTabKey, RemedyItem[]>
  >(() => {
    const initialReportItems = (initialProducts || []).map((item) =>
      normalizeBackendProduct(item, "reports"),
    );

    return {
      reports: initialReportItems,
      rituals: [],
      gemstones: [],
      books: [],
      consultations: [],
    };
  });

  // Set of tabs that have been fetched from API
  const [fetchedTabs, setFetchedTabs] = useState<Set<RemedyTabKey>>(
    new Set(["reports"]),
  );

  // Tab currently being loaded
  const [loadingTab, setLoadingTab] = useState<RemedyTabKey | null>(null);

  // Handle on-demand tab selection and lazy fetching
  const handleSelectTab = useCallback(
    async (tabKey: RemedyTabKey) => {
      setActiveTab(tabKey);

      // If already fetched and cached, don't re-fetch
      if (fetchedTabs.has(tabKey)) {
        return;
      }

      setLoadingTab(tabKey);
      try {
        const targetProductGroup = TAB_PRODUCT_GROUP_MAP[tabKey];
        const rawProducts = await fetchExpertProducts({
          expert_id: expertId,
          product_group: targetProductGroup,
          is_active: true,
          limit: 10,
          sort_by: "created_at",
          order: "DESC",
        });

        const normalized = (rawProducts || []).map((item) =>
          normalizeBackendProduct(item, tabKey),
        );

        setLoadedTabs((prev) => ({
          ...prev,
          [tabKey]: normalized,
        }));
        setFetchedTabs((prev) => new Set(prev).add(tabKey));
      } catch (err) {
        console.error(`Failed to fetch remedies for tab ${tabKey}:`, err);
        setLoadedTabs((prev) => ({
          ...prev,
          [tabKey]: [],
        }));
        setFetchedTabs((prev) => new Set(prev).add(tabKey));
      } finally {
        setLoadingTab(null);
      }
    },
    [expertId, fetchedTabs],
  );

  // Tab counts for tabs that have already been fetched
  const tabCounts = useMemo(() => {
    const counts: Partial<Record<RemedyTabKey, number>> = {};
    fetchedTabs.forEach((tab) => {
      counts[tab] = loadedTabs[tab]?.length || 0;
    });
    return counts as Record<RemedyTabKey, number>;
  }, [loadedTabs, fetchedTabs]);

  const currentTabConfig: RemedyTabConfig = useMemo(() => {
    return (
      REMEDY_TABS_CONFIG.find((t) => t.key === activeTab) ??
      (REMEDY_TABS_CONFIG[0] as RemedyTabConfig)
    );
  }, [activeTab]);

  const currentItems = loadedTabs[activeTab] || [];
  const isCurrentTabLoading = loadingTab === activeTab;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-slate-200/60">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider border border-orange/20 mb-2.5">
              <Sparkles className="size-3.5 text-orange" />
              <span>Prescribed Vedic Upayas & Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Recommended Remedies & Services by {expertName}
            </h2>
            <p className="text-sm text-slate-600 font-normal mt-2 leading-relaxed max-w-2xl">
              Explore authentic horoscope reports, sacred rituals, certified
              gemstones, ancient scriptures, and 1-on-1 private sessions curated
              for your spiritual elevation.
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
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Sticky Category Filter Navigation Bar
          - Dynamically syncs with global header visibility on scroll up/down
          - Sticks to top-0 when header is hidden, or below header when visible
          - Surface separation with solid/blurred background, subtle shadow & border
          - Segmented pill track containing all 5 product categories
          ───────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "sticky z-20 w-full bg-white/95 backdrop-blur-md border-y border-slate-200/80 shadow-2xs py-2.5 mb-8 transition-[top] duration-300 ease-in-out",
          isHeaderVisible
            ? "top-[var(--header-height,96px)]"
            : "top-0"
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          <RemediesTabsHeader
            tabs={REMEDY_TABS_CONFIG}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            counts={tabCounts}
          />
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Active Tab Grid Content (Real API Data with Skeleton on fetch) */}
        <RemediesGrid
          tabConfig={currentTabConfig}
          items={currentItems}
          expertName={expertName}
          expertId={expertId}
          isLoading={isCurrentTabLoading}
        />

        {/* Trust & Guarantee Strip */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                100% Certified & Authentic
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Govt. lab tested gems & genuine scriptures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="size-10 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Vedic Prana Pratishtha
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Energized with sacred planetary mantras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="size-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Lock className="size-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                100% Private & Confidential
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Secure consultations & discreet packaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
