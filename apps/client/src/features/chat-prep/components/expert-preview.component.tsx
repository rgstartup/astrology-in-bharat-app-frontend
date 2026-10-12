"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import type { SomeoneElseData } from "@/actions/chat";
import { useTranslations } from "next-intl";
import { Wallet, AlertCircle, ArrowLeft, Pencil } from "lucide-react";
import ExpertHeader from "./expert-header";
import { ConsultingForSelect, MemberDetailsForm } from "./consulting-for";

type Props = {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: (val: SomeoneElseData) => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
  balance?: number | null;
  showLowBalance?: boolean;
  minBalanceRequired?: number;
  isAuthenticated?: boolean;
  /** When provided, low-balance CTA enters an embedded recharge step instead of redirecting. */
  onRecharge?: () => void;
};

const ExpertPreview = ({
  expert,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance = null,
  showLowBalance = false,
  minBalanceRequired = 0,
  isAuthenticated = false,
  onRecharge,
}: Props) => {
  const router = useRouter();
  const tx = useTranslations("Chat.expertPreview");
  const price = expert?.pricing?.chat_price || 0;
  // Stepped view keeps the card a fixed height: the member form swaps in
  // place of the summary instead of growing the card vertically.
  const [view, setView] = useState<"details" | "member">("details");

  const pickConsultingFor = (val: boolean) => {
    setAskSomeoneElse(val);
    if (!val) setView("member");
  };

  const ctaClass =
    "flex-1 min-w-0 py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed truncate";

  if (view === "member") {
    return (
      <div className="px-5 pb-5 pt-12 space-y-3 max-w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAskSomeoneElse(true);
              setView("details");
            }}
            aria-label={tx("back")}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-slate-900 truncate">{tx("someoneElse")}</h3>
        </div>

        <MemberDetailsForm
          initial={someoneElseData}
          onSubmit={(v) => {
            setSomeoneElseData(v);
            setView("details");
          }}
        />
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 pt-12 space-y-3 max-w-full">
      <ExpertHeader expert={expert} />

      {/* Compact price summary */}
      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="text-slate-600 truncate">
            ₹{price} {tx("perMin")}
          </span>
          <span className="font-semibold text-slate-900 shrink-0">₹{price}</span>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="text-slate-600 truncate">
            {tx("minSession", { price: minBalanceRequired || 0 })}
          </span>
          <span className="font-semibold text-slate-900 shrink-0">₹{minBalanceRequired || 0}</span>
        </div>
        {isAuthenticated && balance !== null && (
          <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 truncate">
              <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
              {tx("yourBalance")}
            </span>
            <span className="font-black text-slate-900 shrink-0">₹{balance.toFixed(2)}</span>
          </div>
        )}
      </div>

      {showLowBalance && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 rounded-2xl border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-snug min-w-0">
            <span className="font-bold">{tx("lowBalance")}. </span>
            {tx("lowBalanceDesc", { price: minBalanceRequired || 0 })}
          </p>
        </div>
      )}

      <div className="flex gap-2 max-w-full">
        <ConsultingForSelect
          askSomeoneElse={askSomeoneElse}
          setAskSomeoneElse={pickConsultingFor}
          className="w-[124px]"
        />
        {showLowBalance ? (
          <button
            onClick={() => (onRecharge ? onRecharge() : router.push("/client/profile?tab=wallet"))}
            className="flex-1 min-w-0 py-3 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer truncate"
          >
            {tx("rechargeNow")}
          </button>
        ) : (
          <button onClick={handleStartConsultation} disabled={actionLoading} className={ctaClass}>
            {actionLoading ? tx("connecting") : tx("startConsultation")}
          </button>
        )}
      </div>

      {!askSomeoneElse && (
        <button
          onClick={() => setView("member")}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer min-w-0"
        >
          <span className="truncate">{someoneElseData.name || tx("enterName")}</span>
          <span className="flex items-center gap-1 shrink-0 text-slate-500">
            <Pencil className="w-3 h-3" />
            {tx("change")}
          </span>
        </button>
      )}

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        {tx("termsPrefix")}{" "}
        <Link
          href="/terms-and-conditions"
          className="font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          {tx("termsLink")}
        </Link>
      </p>
    </div>
  );
};

export default ExpertPreview;
