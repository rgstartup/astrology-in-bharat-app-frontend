"use client";

import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useFormatter } from "next-intl";
import {
  ClientWalletTransaction,
  ClientWalletTransactionType,
  ClientWalletTransactionPurpose,
} from "@repo/lib";

interface WalletTransactionItemProps {
  tx: ClientWalletTransaction;
}

const formatPurpose = (purpose?: ClientWalletTransactionPurpose | string) => {
  if (!purpose) return "Transaction";
  return purpose
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function WalletTransactionItem({ tx }: WalletTransactionItemProps) {
  const [isCopied, setIsCopied] = useState(false);

  const amount = Number(tx.amount) || 0;
  const isDebit =
    tx.type === ClientWalletTransactionType.DEBIT ||
    tx.type === ClientWalletTransactionType.HOLD;
  const isHold = tx.type === ClientWalletTransactionType.HOLD;

  const formatter = useFormatter();

  const formattedDate = tx.created_at
    ? formatter.dateTime(new Date(tx.created_at), {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recent";

  const refId =
    tx.transaction_no ||
    tx.reference_id ||
    (tx.id ? `#${String(tx.id).slice(-8).toUpperCase()}` : "");

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!refId) return;
    navigator.clipboard.writeText(refId.replace("#", ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="py-3 sm:py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-white/50 px-2 rounded-xl transition-colors">
      {/* Left: Icon + Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-amber-800/20 shadow-xs ${
            isHold
              ? "bg-amber-100/90 text-amber-800"
              : isDebit
                ? "bg-white/80 text-slate-800"
                : "bg-emerald-100/90 text-emerald-800"
          }`}
        >
          {isDebit ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownLeft className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate font-outfit">
              {formatPurpose(tx.purpose)}
            </h4>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border ${
                isHold
                  ? "bg-white/80 text-slate-800 border-amber-800/20"
                  : isDebit
                    ? "bg-white/80 text-slate-800 border-amber-800/20"
                    : "bg-emerald-100/90 text-emerald-900 border-emerald-700/30"
              }`}
            >
              {tx.type || ClientWalletTransactionType.CREDIT}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 mt-0.5">
            <Clock className="w-3 h-3 shrink-0 text-amber-950" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {refId && (
          <div className="ml-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyRef}
              title={isCopied ? "Copied!" : "Copy Transaction ID"}
              aria-label={isCopied ? "Copied!" : "Copy Transaction ID"}
              className="inline-flex items-center justify-center p-1 rounded hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer w-fit"
            >
              {isCopied ? (
                <Check className="w-3 h-3 text-emerald-700" />
              ) : (
                <Copy className="w-3 h-3 opacity-70 hover:opacity-100" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right: Amount & Status */}
      <div className="text-right shrink-0">
        <span
          className={`text-sm sm:text-base font-bold font-outfit block ${
            isDebit ? "text-slate-900" : "text-emerald-800"
          }`}
        >
          {isDebit ? "-" : "+"}₹{amount.toLocaleString("en-IN")}
        </span>

        <div className="flex items-center justify-end gap-1 text-[10px] font-bold mt-0.5">
          {isHold ? (
            <span className="inline-flex items-center gap-0.5 text-amber-800">
              <Clock className="w-2.5 h-2.5" />
              <span>On Hold</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-emerald-800">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
