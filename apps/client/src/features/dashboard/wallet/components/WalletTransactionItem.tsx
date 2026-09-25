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

interface WalletTransactionItemProps {
  tx: any;
}

export function WalletTransactionItem({ tx }: WalletTransactionItemProps) {
  const [isCopied, setIsCopied] = useState(false);

  const rawAmount =
    typeof tx.amount === "object" && tx.amount !== null
      ? (tx.amount.amount ?? tx.amount.value ?? tx.amount.total ?? 0)
      : (tx.amount ?? 0);
  const amount = Number(rawAmount) || 0;

  const typeLower = (tx.type || "credit").toLowerCase();
  const isDebit = ["debit", "hold", "deduction"].includes(typeLower);
  const isHold = typeLower === "hold";
  const statusLower = (tx.status || "completed").toLowerCase();
  const isFailed = ["failed", "cancelled", "error", "rejected"].includes(
    statusLower,
  );
  const isSuccess = ["completed", "success", "confirmed"].includes(statusLower);

  const dateVal = tx.created_at || tx.createdAt || tx.date;

  const formatter = useFormatter();

  const formattedDate = dateVal
    ? formatter.dateTime(new Date(dateVal), {
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
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-amber-800/20 shadow-xs ${
            isFailed
              ? "bg-rose-100/90 text-rose-800"
              : isDebit
                ? "bg-white/80 text-slate-800"
                : "bg-emerald-100/90 text-emerald-800"
          }`}
        >
          {isFailed ? (
            <AlertCircle className="w-4 h-4" />
          ) : isDebit ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownLeft className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate font-outfit">
              {tx.description ||
                tx.reason ||
                tx.purpose ||
                (isDebit ? "Wallet Deduction" : "Wallet Recharge")}
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
              {tx.type || "credit"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 mt-0.5">
            <Clock className="w-3 h-3 shrink-0 text-amber-950" />
            <span>{formattedDate}</span>
            {refId && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  title="Click to copy ID"
                  className="inline-flex items-center gap-1 font-mono text-[9.5px] font-medium text-slate-800 hover:text-slate-950 uppercase transition-colors cursor-pointer"
                >
                  <span>{refId}</span>
                  {isCopied ? (
                    <Check className="w-2.5 h-2.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Status */}
      <div className="text-right shrink-0">
        <span
          className={`text-sm sm:text-base font-black font-outfit block ${
            isFailed
              ? "text-slate-500 line-through"
              : isDebit
                ? "text-slate-900"
                : "text-emerald-800"
          }`}
        >
          {isDebit ? "-" : "+"}₹{amount.toLocaleString("en-IN")}
        </span>

        <div className="flex items-center justify-end gap-1 text-[10px] font-bold mt-0.5">
          {isSuccess ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-800">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span className="capitalize">{tx.status || "Completed"}</span>
            </span>
          ) : isFailed ? (
            <span className="inline-flex items-center gap-0.5 text-rose-800">
              <AlertCircle className="w-2.5 h-2.5" />
              <span className="capitalize">{tx.status || "Failed"}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-slate-700">
              <Clock className="w-2.5 h-2.5" />
              <span className="capitalize">{tx.status || "Pending"}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
