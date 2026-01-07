import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import { fetchPlaceImages, Place } from "@/libs/serp-api";

const Image = NextImage as any;
const Link = NextLink as any;

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [realImage, setRealImage] = useState<string | null>(null);

  const NO_IMAGE_URL = "/images/image-not-found.png";

  useEffect(() => {
    const loadImage = async () => {
      // Prioritize thumbnails, but fetch real exterior photo if possible
      const images = await fetchPlaceImages(place.title);
      if (images && images.length > 0) {
        setRealImage(images[0] || null);
      }
    };
    loadImage();
  }, [place.title]);

  const displayImage = realImage || place.thumbnailUrl || NO_IMAGE_URL;

  return (
    <Link
      href={`/famous-places/${place.slug}`}
      className="group no-underline text-inherit"
    >
      <div className="bg-[#1e0b0f6e] rounded-2xl overflow-hidden border border-[#fd641054] hover:border-primary transition-all duration-300 flex flex-col h-full shadow-lg">
        <div className="relative h-52 w-full overflow-hidden bg-slate-900">
          <Image
            src={displayImage}
            alt={place.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-block bg-[#F25E0A] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 opacity-90">
              {place.category || "Sacred Site"}
            </span>
            <h3 className="text-white font-bold text-base leading-tight line-clamp-2 drop-shadow-md">
              {place.title}
            </h3>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between bg-white/90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-accent-gold">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(place.rating || 4)
                        ? "fill-current text-orange-500"
                        : "text-gray-500 fill-current"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-bold text-orange-500">
                ({place.ratingCount || "4.5"})
              </span>
            </div>

            <div className="flex items-start gap-1.5 text-black mb-4">
              <i className="fa-solid fa-location-dot mt-0.5 text-[#301118] text-xs"></i>
              <p className="text-[11px] leading-relaxed line-clamp-2">
                {place.address || "Address available on request"}
              </p>
            </div>
          </div>

          <div className="w-full bg-[#301118] text-white py-2 rounded-lg text-xs font-bold text-center group-hover:shadow-[0_0_15px_rgba(253,100,16,0.3)] transition-all uppercase tracking-widest">
            Darshan Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
