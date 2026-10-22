"use client";

import { useTranslations } from "next-intl";
import type { IExpert } from "@repo/lib";
import { BadgeCheck, Star } from "lucide-react";
import { formatSpecializationsString } from "@/utils/expert-utils";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import { resolveModePrice } from "@/lib/pricing";
import {
  ConsultationModeIcon,
  getConsultationModeLabel,
} from "./consultation-mode-icon";

export interface ExpertHeaderProps {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
  mode?: ConsultationMode;
}

/**
 * Header section of expert preview card displaying name, ratings, experience,
 * verification badge, and price tailored to the selected consultation mode.
 *
 * @param props - Component properties.
 * @returns Expert summary header element.
 */
const ExpertHeader = ({ expert, mode = "chat" }: ExpertHeaderProps) => {
  const tx = useTranslations("Chat.expertPreview");
  const price = resolveModePrice(expert, mode);
  const ratingDisplay = expert?.rating ?? "New";
  const experienceYears = expert?.experience_in_years ?? 0;

  return (
    <div className="flex items-start justify-between gap-3 max-w-full">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span>{ratingDisplay}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium truncate">
            {experienceYears} {tx("years")}
          </span>
        </div>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 truncate">
          {expert?.name || "Expert"}
        </h2>
        <p className="mt-0.5 text-[13px] font-medium text-slate-500 truncate">
          {formatSpecializationsString(
            expert?.specializations ||
              expert?.specialization ||
              expert?.expertise,
          )}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{tx("verifiedExpert")}</span>
        </p>
      </div>

      <div className="text-right shrink-0 pt-0.5">
        <div className="flex items-center justify-end gap-1 text-slate-700">
          {/* <ConsultationModeIcon mode={mode} className="w-3.5 h-3.5 text-orange-600" /> */}
          <span className="text-xl font-black text-slate-900 leading-none">
            ₹{price}
          </span>
        </div>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {tx("perMin")} • {getConsultationModeLabel(mode)}
        </p>
      </div>
    </div>
  );
};

export default ExpertHeader;
