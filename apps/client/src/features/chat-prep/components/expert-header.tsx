"use client";

import { useTranslations } from "next-intl";
import type { IExpert } from "@repo/lib";
import { BadgeCheck, Star } from "lucide-react";
import { formatSpecializationsString } from "@/utils/expert-utils";

type Props = {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
};

const ExpertHeader = ({ expert }: Props) => {
  const tx = useTranslations("Chat.expertPreview");
  const price = expert?.pricing?.chat_price || expert?.price || 0;

  return (
    <div className="flex items-start justify-between gap-3 max-w-full">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span>{expert?.rating ?? "New"}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium truncate">
            {expert?.experience_in_years}
            {tx("years")}
          </span>
          {/* <span className="text-slate-300">•</span>
          <span
            className={`font-bold shrink-0 ${isAvailable ? "text-emerald-600" : "text-slate-400"}`}
          >
            {isAvailable ? tx("availableNow") : tx("offline")}
          </span> */}
        </div>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 truncate">
          {expert?.name || "Expert"}
        </h2>
        <p className="mt-0.5 text-[13px] font-medium text-slate-500 truncate">
          {formatSpecializationsString(
            expert?.specializations || expert?.specialization || expert?.expertise,
          )}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{tx("verifiedExpert")}</span>
        </p>
      </div>

      <div className="text-right shrink-0 pt-0.5">
        <p className="text-xl font-black text-slate-900 leading-none">₹{price}</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {tx("perMin")}
        </p>
      </div>
    </div>
  );
};

export default ExpertHeader;
