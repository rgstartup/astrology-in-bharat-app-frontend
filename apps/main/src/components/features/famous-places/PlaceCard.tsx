import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPlaceImages } from "@/libs/serp-api";
import { Place } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { famousPlacesTranslations } from "../../../lib/famous-places-translations";

interface PlaceCardProps {
  place: Place;
}

// Use an existing local image as fallback
const FALLBACK_IMG = "/images/kashi.jpg";

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [imgSrc, setImgSrc] = useState<string>(place.thumbnailUrl || FALLBACK_IMG);
  const { lang } = useLanguageStore();
  const t = famousPlacesTranslations[lang as keyof typeof famousPlacesTranslations] || famousPlacesTranslations.en;

  useEffect(() => {
    if (!place?.title) return;
    // Reset to thumbnail (or fallback) when place changes
    setImgSrc(place.thumbnailUrl || FALLBACK_IMG);

    const loadImage = async () => {
      try {
        const images = await fetchPlaceImages(place.title);
        if (images && images.length > 0 && images[0]) {
          setImgSrc(images[0]);
        }
      } catch (err) {
        console.error("Failed to load real image", err);
      }
    };
    loadImage();
  }, [place.title, place.thumbnailUrl]);

  // Generate a deterministic fake distance for demo
  const distance = ((place.title.length % 9) + 1) + "." + (place.title.length % 10) + " km";
  const rating = place.rating || "4.8";
  const ratingCount = place.ratingCount || "12k";

  // Simplify the address to just City, State
  const shortAddress = place.address ? place.address.split(",").slice(0, 2).join(",").trim() : "India";

  return (
    <Link href={`/famous-places/${place.slug || "details"}`} className="group no-underline text-inherit block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8D5C0] shadow-sm flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all">

        {/* Image Section — using <img> for reliable onError fallback with external URLs */}
        <div className="relative h-36 w-full overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={place.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgSrc(FALLBACK_IMG)}
          />
          {/* Distance Badge */}
          <div className="absolute top-3 right-3 bg-[#FDEEDC] text-gray-800 text-[11px] font-bold px-2 py-1 rounded shadow-sm">
            {distance}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-[16px] font-bold text-[#3D1A0B] mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {place.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 mb-3">
            <i className="fa-solid fa-location-dot text-[10px]"></i>
            <p className="text-xs font-medium line-clamp-1">{shortAddress}</p>
          </div>

          {/* Bottom Row */}
          <div className="mt-auto flex items-center justify-between pt-1">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-star text-[#FFAA00] text-sm"></i>
              <span className="text-sm font-bold text-gray-700">
                {rating} <span className="font-medium text-gray-400 text-xs">({ratingCount})</span>
              </span>
            </div>

            {/* View Details Button */}
            <button className="border border-orange-300 text-orange-500 text-xs font-bold px-3 py-1.5 rounded hover:bg-orange-50 transition-colors flex items-center gap-1.5">
              {t.card.viewDetails}
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default PlaceCard;
