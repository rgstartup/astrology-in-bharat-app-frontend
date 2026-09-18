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
        badgeBg: "bg-gray-100 text-gray-700 border-gray-200",
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
  const CtaIcon = styles.ctaIcon;

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
    <div className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Image / Media Area */}
        <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${item.name} - Astrological Remedy`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Gradient Overlay for Top Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
            {item.badgeText ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/90 text-white shadow-xs backdrop-blur-xs">
                {item.badgeText}
              </span>
            ) : item.relationType === ExpertProductRelationType.PROVIDER ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-700 text-white shadow-xs">
                Curated by Guru
              </span>
            ) : item.relationType === ExpertProductRelationType.PROMOTER ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange text-white shadow-xs">
                Recommended
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs">
                Vedic Upaya
              </span>
            )}

            {hasDiscount > 0 && (
              <span className="text-[10px] font-black px-2 py-1 rounded-md bg-red-500 text-white shadow-xs">
                {hasDiscount}% OFF
              </span>
            )}
          </div>

          {/* Bottom Overlay Info (Duration / Format) */}
          {item.durationOrPages && (
            <div className="absolute bottom-2.5 left-3 z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Clock className="size-3 text-orange" />
                <span>{item.durationOrPages}</span>
              </span>
            </div>
          )}

          {/* Rating Pill */}
          {item.rating && (
            <div className="absolute bottom-2.5 right-3 z-10">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{item.rating.toFixed(1)}</span>
                {item.reviewCount && (
                  <span className="text-gray-300 text-[10px]">
                    ({item.reviewCount})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5">
          {/* Category Chip */}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles.badgeBg}`}
            >
              <CategoryIcon className="size-3" />
              <span>{item.categoryName}</span>
            </span>
            {item.productType && (
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                • {item.productType}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-orange transition-colors min-h-[2.5rem]">
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.shortDescription || item.description}
          </p>

          {/* Feature Highlights */}
          {item.features && item.features.length > 0 && (
            <ul className="mt-3 space-y-1.5 pt-2 border-t border-gray-100">
              {item.features.slice(0, 2).map((feature, fIdx) => (
                <li
                  key={fIdx}
                  className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium line-clamp-1"
                >
                  <Check className="size-3 text-emerald-600 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="h-px bg-gray-100 mb-3.5" />
        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{item.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {hasDiscount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange hover:bg-[#d35400] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 group/btn"
          >
            <span>{item.ctaText || styles.defaultCta}</span>
            <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
