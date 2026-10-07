"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { IExpert } from "@repo/lib";
import { formatSpecializationsString } from "@/utils/expert-utils";

type Props = {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
  isAvailable: boolean;
};

const ExpertHeader = ({ expert, isAvailable }: Props) => {
  const tx = useTranslations("Chat.expertPreview");
  const price = expert?.chat_price || expert?.price || 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          src={expert?.avatar || "/images/dummy-expert.jpg"}
          alt={expert?.name || "Expert"}
          width={64}
          height={64}
          className="w-16 h-16 rounded-2xl object-cover bg-slate-100"
        />
        <span
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isAvailable ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-slate-900 truncate">
          {expert?.name || "Expert"}
        </h2>
        <p className="text-xs text-slate-500 truncate">
          {formatSpecializationsString(
            expert?.specializations ||
              expert?.specialization ||
              expert?.expertise,
          )}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-slate-500">
          {expert?.rating ? `★ ${expert.rating} · ` : ""}
          {expert?.experience_in_years}
          {tx("years")} · {tx("verifiedExpert")}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-black text-slate-900">₹{price}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          / min
        </p>
        <p
          className={`mt-1 text-[10px] font-black uppercase tracking-wider ${
            isAvailable ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {isAvailable ? tx("availableNow") : tx("offline")}
        </p>
      </div>
    </div>
  );
};

export default ExpertHeader;
