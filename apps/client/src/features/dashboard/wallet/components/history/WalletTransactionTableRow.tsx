"use client";

import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { useFormatter } from "next-intl";

interface WalletTransactionTableRowProps {
  tx: any;
}

function CopyableRefId({ id }: { id: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id.replace("#", ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy ID"
      className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
    >
      <span>{id}</span>
      {isCopied ? (
        <Check className="w-3 h-3 text-emerald-600" />
      ) : (
        <Copy className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
      )}
    </button>
  );
}

export function WalletTransactionTableRow({ tx }: WalletTransactionTableRowProps) {
  const formatter = useFormatter();

  const rawAmount =
    typeof tx.amount === "object" && tx.amount !== null
      ? (tx.amount.amount ?? tx.amount.value ?? tx.amount.total ?? 0)
      : (tx.amount ?? 0);
  const amount = Number(rawAmount) || 0;

  const typeLower = (tx.type || "credit").toLowerCase();
  const isDebit = ["debit", "hold", "deduction"].includes(typeLower);
  const statusLower = (tx.status || "completed").toLowerCase();
  const isFailed = ["failed", "cancelled", "error", "rejected"].includes(statusLower);
  const isSuccess = ["completed", "success", "confirmed"].includes(statusLower);

  const dateVal = tx.created_at || tx.createdAt || tx.date;
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

  return (
    <TableRow className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
      {/* Description & Date & Reference ID */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              isFailed
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : isDebit
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
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
            <p className="text-xs sm:text-sm font-semibold text-slate-900 font-outfit truncate max-w-[200px] sm:max-w-xs">
              {tx.description ||
                tx.reason ||
                tx.purpose ||
                (isDebit ? "Wallet Deduction" : "Wallet Recharge")}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
              <Clock className="w-3 h-3 shrink-0 text-slate-400" />
              <span>{formattedDate}</span>
              {refId && (
                <>
                  <span>•</span>
                  <CopyableRefId id={refId} />
                </>
              )}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Type Badge */}
      <TableCell className="py-3">
        <span
          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
            isDebit
              ? "bg-slate-100 text-slate-700 border-slate-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {tx.type || "credit"}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3">
        {isSuccess ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="capitalize">{tx.status || "Completed"}</span>
          </span>
        ) : isFailed ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            <span className="capitalize">{tx.status || "Failed"}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <Clock className="w-3 h-3 text-amber-500" />
            <span className="capitalize">{tx.status || "Pending"}</span>
          </span>
        )}
      </TableCell>

      {/* Amount */}
      <TableCell className="py-3 text-right">
        <span
          className={`text-xs sm:text-sm font-bold font-outfit block ${
            isFailed
              ? "text-slate-400 line-through"
              : isDebit
                ? "text-slate-900"
                : "text-emerald-700"
          }`}
        >
          {isDebit ? "-" : "+"}₹{amount.toLocaleString("en-IN")}
        </span>
      </TableCell>
    </TableRow>
  );
}
