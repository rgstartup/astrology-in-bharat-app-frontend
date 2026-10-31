"use client";

import React from "react";
import { User } from "@repo/design/lucide";
import type { IExpert } from "@repo/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import { Badge } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

type ExpertIdentityProps = {
  expertData: IExpert;
  isFree?: boolean;
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
 * Badge indicating free session minutes are currently applied.
 *
 * @param props - State indicating if free session is active.
 * @returns Badge JSX or null.
 */
function FreeBadge({ isFree }: { isFree?: boolean }) {
  if (!isFree) return null;
  return (
    <Badge
      variant="secondary"
      className="rounded-full border border-[#d3cec6] bg-[#f5f1ec] px-2 py-0 text-[11px] font-medium text-[#626260]"
    >
      Free
    </Badge>
  );
}

/**
 * Expert identity block with avatar, expert name, free badge, and profession title.
 *
 * @param props - Expert data, free promotion indicator, and optional styling class.
 * @returns Expert identity layout.
 */
export function ExpertIdentity({
  expertData,
  isFree = false,
  className,
}: ExpertIdentityProps) {
  if (!expertData) return null;

  const profession = getExpertProfession(expertData);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2.5 md:gap-3.5",
        className,
      )}
    >
      <Avatar className="size-10 shrink-0 rounded-full border border-[#d3cec6] bg-white ring-2 ring-[#f5f1ec] md:size-11">
        <AvatarImage
          src={expertData.avatar ?? undefined}
          alt={expertData.name}
        />
        <AvatarFallback className="bg-white text-[#626260]">
          <User className="size-5" />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h1 className="flex items-center gap-1.5 text-sm font-semibold leading-tight text-[#111111] md:text-base">
          <span className="truncate">{expertData.name}</span>
          <FreeBadge isFree={isFree} />
        </h1>
        <p className="mt-0.5 truncate text-xs text-[#626260] md:text-sm">
          {profession}
        </p>
      </div>
    </div>
  );
}
