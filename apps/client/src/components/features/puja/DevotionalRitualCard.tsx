"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import { DevotionalRitualItem } from "@repo/lib";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface DevotionalRitualCardProps {
  ritual: DevotionalRitualItem;
}

export const DevotionalRitualCard: React.FC<DevotionalRitualCardProps> = ({
  ritual,
}) => {
  const fallbackImg = "/images/pooja/pooja1.png";
  const displayImage =
    ritual.image_url && ritual.image_url.trim() !== ""
      ? ritual.image_url
      : fallbackImg;

  const samagris = ritual.default_samagri_list || [];
  const samagriCount = samagris.length;

  return (
    <Link
      href="/astrology/online-puja"
      className="block h-full no-underline group"
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden border-orange-100/90 bg-white hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 p-0 rounded-2xl">
        {/* Visual Media / Image */}
        <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-gradient-to-tr from-amber-50 to-orange-100">
          <Image
            src={displayImage}
            alt={ritual.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
            {ritual.deity ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FF5500] text-white text-[11px] font-bold rounded-full shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                <span className="truncate max-w-[110px]">{ritual.deity}</span>
              </span>
            ) : (
              <span />
            )}

            {ritual.suggested_duration_hours ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold rounded-full shadow-xs">
                <Clock className="w-2.5 h-2.5 text-orange-400" />
                {ritual.suggested_duration_hours}h
              </span>
            ) : null}
          </div>

          {/* Bottom Badges on Image */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10">
            {ritual.icon ? (
              <div className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs text-orange-600 shadow-sm flex items-center justify-center text-[11px] border border-orange-200">
                <i className={ritual.icon}></i>
              </div>
            ) : (
              <div />
            )}

            {samagriCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-bold rounded-full shadow-xs">
                {samagriCount} Samagris
              </span>
            )}
          </div>
        </div>

        {/* Card Header with Spacing */}
        <CardHeader className="p-4 pb-2 space-y-1.5">
          <CardTitle className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#FF5500] transition-colors leading-snug line-clamp-1">
            {ritual.title}
          </CardTitle>
          {ritual.description && (
            <CardDescription className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {ritual.description}
            </CardDescription>
          )}
        </CardHeader>

        {/* Card Content (Benefits) */}
        <CardContent className="px-4 pb-3 pt-0 gap-4">
          {ritual.significance && (
            <div className="bg-amber-50/90 border border-amber-200/70 rounded-xl p-2.5">
              <p className="text-[11px] text-amber-950 line-clamp-2 leading-snug">
                <span className="font-bold text-amber-900">Benefits: </span>
                {ritual.significance}
              </p>
            </div>
          )}
        </CardContent>

        {/* Card Footer (Action CTA) */}
        <CardFooter className="px-4 pb-4 pt-1">
          <div className="w-full py-2 px-3 rounded-xl bg-orange-50 group-hover:bg-[#FF5500] text-[#FF5500] group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs">
            <span>View Ritual &amp; Book</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DevotionalRitualCard;
