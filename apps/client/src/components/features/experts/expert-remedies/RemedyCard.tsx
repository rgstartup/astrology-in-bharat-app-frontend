"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  FileText,
  Flame,
  Gem,
  BookOpen,
  Clock,
  Sparkles,
  Star,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ProductGroup, ExpertProductRelationType } from "@repo/lib";
import { RemedyItem } from "./types";

interface RemedyCardProps {
  item: RemedyItem;
  expertName?: string;
  expertId?: string;
}

const getCategoryStyles = (group: ProductGroup) => {
  switch (group) {
    case ProductGroup.REPORT:
      return {
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        icon: FileText,
        ctaIcon: FileText,
        defaultCta: "Get Report",
      };
    case ProductGroup.RITUAL:
      return {
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        icon: Flame,
        ctaIcon: Flame,
        defaultCta: "Book Puja",
      };
    case ProductGroup.ITEM:
      return {
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: Gem,
        ctaIcon: Gem,
        defaultCta: "Order Now",
      };
    case ProductGroup.BOOK:
      return {
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: BookOpen,
        ctaIcon: BookOpen,
        defaultCta: "Buy Book",
      };
    case ProductGroup.SESSION:
      return {
        badgeBg: "bg-orange/10 text-orange border-orange/20",
        icon: Clock,
        ctaIcon: Clock,
        defaultCta: "Book Session",
      };
    default:
      return {
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Sparkles,
        ctaIcon: ArrowRight,
        defaultCta: "View Details",
      };
  }
};

export const RemedyCard: React.FC<RemedyCardProps> = ({
  item,
  expertName,
  expertId,
}) => {
  const styles = getCategoryStyles(item.productGroup);
  const CategoryIcon = styles.icon;

  const hasDiscount =
    item.discountPercent && item.discountPercent > 0
      ? item.discountPercent
      : item.originalPrice && item.originalPrice > item.price
        ? Math.round(
            ((item.originalPrice - item.price) / item.originalPrice) * 100,
          )
        : 0;

  // Determine fallback image based on productGroup if not provided
  let imageSrc = item.imageUrl;
  if (!imageSrc || imageSrc === "/images/image-not-found.png") {
    if (item.productGroup === ProductGroup.REPORT) {
      imageSrc = "/images/kundli-bg-elegant.jpg";
    } else if (item.productGroup === ProductGroup.RITUAL) {
      imageSrc = "/images/online-puja-banner.png";
    } else if (item.productGroup === ProductGroup.BOOK) {
      imageSrc = "/images/ser11.jpg";
    } else if (item.productGroup === ProductGroup.SESSION) {
      imageSrc = "/images/horoscope-bg-elegant.jpg";
    } else {
      imageSrc = "/images/ser3.jpg";
    }
  }

  // Determine CTA destination
  let destinationHref = item.ctaLink || `/shop/${item.id}`;
  if (item.productGroup === ProductGroup.SESSION) {
    destinationHref = expertId ? `/consultants/${expertId}` : "/chat";
  } else if (item.productGroup === ProductGroup.RITUAL) {
    destinationHref = item.ctaLink || "/puja";
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Image / Media Area */}
        <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${item.name} - Astrological Remedy`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Gradient Overlay for Top Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
            {item.badgeText ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/90 text-white shadow-xs backdrop-blur-xs">
                {item.badgeText}
              </span>
            ) : item.relationType === ExpertProductRelationType.PROVIDER ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-700 text-white shadow-xs">
                Curated by Guru
              </span>
            ) : item.relationType === ExpertProductRelationType.PROMOTER ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange text-white shadow-xs">
                Recommended
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs">
                Vedic Upaya
              </span>
            )}

            {hasDiscount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white shadow-xs">
                {hasDiscount}% OFF
              </span>
            )}
          </div>

          {/* Bottom Overlay Info (Duration / Rating) */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
            {item.durationOrPages ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                <Clock className="size-2.5 text-orange" />
                <span>{item.durationOrPages}</span>
              </span>
            ) : (
              <div />
            )}

            {item.rating && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs ml-auto">
                <Star className="size-2.5 fill-amber-400 text-amber-400" />
                <span>{item.rating.toFixed(1)}</span>
                {item.reviewCount && (
                  <span className="text-slate-300 text-[9px] font-normal">
                    ({item.reviewCount})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3.5 sm:p-4">
          {/* Category Chip */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${styles.badgeBg}`}
            >
              <CategoryIcon className="size-2.5" />
              <span>{item.categoryName}</span>
            </span>
            {item.productType && (
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                • {item.productType}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-1 group-hover:text-orange transition-colors">
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
            {item.shortDescription || item.description}
          </p>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-3.5 sm:p-4 pt-0">
        <div className="h-px bg-slate-100 mb-2.5" />
        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-400 line-through font-medium ml-1">
                  ₹{item.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {hasDiscount > 0 && (
              <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
                Save ₹
                {(
                  (item.originalPrice || item.price) - item.price
                ).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={destinationHref}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange hover:bg-[#d35400] text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all active:scale-95 group/btn shrink-0"
          >
            <span>{item.ctaText || styles.defaultCta}</span>
            <ArrowRight className="size-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

