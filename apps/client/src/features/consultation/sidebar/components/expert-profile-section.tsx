"use client";

import React from "react";
import { Star, User } from "lucide-react";
import type { IExpert } from "@repo/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ExpertProfileSectionProps = {
  expertData: IExpert;
  className?: string;
};

/**
 * Extracts primary profession or specialization title from expert data.
 *
 * @param expert - Expert profile data.
 * @returns Human readable profession string.
 */
function getExpertProfession(expert: IExpert): string {
  if (!expert) return "Vedic Astrologer";

  if (Array.isArray(expert.professions) && expert.professions.length > 0) {
    const primary = expert.professions.find((p) => p && p.is_primary);
    if (primary?.profession?.title) {
      return primary.profession.title;
    }
    const first = expert.professions[0];
    if (first?.profession?.title) {
      return first.profession.title;
    }
  }

  if (
    expert.profession &&
    typeof expert.profession === "object" &&
    expert.profession.title
  ) {
    return expert.profession.title;
  }

  if (
    Array.isArray(expert.specializations) &&
    expert.specializations.length > 0
  ) {
    const firstSpec = expert.specializations[0];
    if (firstSpec?.specialization?.title) {
      return firstSpec.specialization.title;
    }
  }

  return "Vedic Astrologer";
}

/**
 * Formats concise rating string with safe fallback.
 *
 * @param expert - Expert profile.
 * @returns Formatted rating.
 */
function getRating(expert: IExpert): string {
  const raw = expert.rating ?? (expert as Record<string, unknown>).ratings ?? 4.9;
  return Number(raw).toFixed(1);
}

/**
 * Language pill renderer with early returns.
 *
 * @param props - Raw languages string or null.
 * @returns Languages element or null.
 */
function LanguageInfo({ languages }: { languages?: string }) {
  if (!languages) return null;
  return (
    <>
      <span className="text-[#d3cec6]">·</span>
      <span>{languages}</span>
    </>
  );
}

/**
 * Concise expert identity block for the persistent consultation sidebar.
 *
 * @param props - Expert data and styling class.
 * @returns Expert profile section.
 */
export function ExpertProfileSection({
  expertData,
  className,
}: ExpertProfileSectionProps) {
  if (!expertData) return null;

  const profession = getExpertProfession(expertData);
  const rating = getRating(expertData);
  const languages = expertData.languages ?? "Hindi, English";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start gap-3">
        <Avatar className="size-14 shrink-0 rounded-full border border-[#d3cec6] bg-white ring-2 ring-[#f5f1ec]">
          <AvatarImage
            src={expertData.avatar ?? undefined}
            alt={expertData.name}
          />
          <AvatarFallback className="bg-white text-[#626260]">
            <User className="size-7" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-base font-bold text-[#111111]">
            {expertData.name}
          </h3>
          <p className="mt-0.5 truncate text-xs font-medium text-[#626260]">
            {profession}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#7b7b78]">
            <span className="flex items-center gap-1 font-semibold text-[#111111]">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
            <LanguageInfo languages={languages} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-md bg-[#f5f1ec] px-2.5 py-1 text-[11px] font-medium text-[#111111]">
        <span className="size-2 rounded-full bg-emerald-500" />
        <span>Online & ready for consultation</span>
      </div>
    </div>
  );
}
