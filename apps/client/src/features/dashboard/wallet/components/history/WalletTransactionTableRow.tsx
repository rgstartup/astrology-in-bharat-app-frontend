"use client";

import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Copy, Check } from "lucide-react";
import { useFormatter } from "next-intl";
import {
  ClientWalletTransaction,
  ClientWalletTransactionType,
  ClientWalletTransactionPurpose,
} from "@repo/lib";

interface WalletTransactionTableRowProps {
  tx: ClientWalletTransaction;
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
      title={isCopied ? "Copied!" : "Copy Transaction ID"}
      aria-label={isCopied ? "Copied!" : "Copy Transaction ID"}
      className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer w-fit"
    >
      {isCopied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Copy className="w-4 h-4 opacity-70 hover:opacity-100" />
      )}
    </button>
  );
}

const formatPurpose = (purpose?: ClientWalletTransactionPurpose | string) => {
  if (!purpose) return "Transaction";
  return purpose
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function WalletTransactionTableRow({ tx }: WalletTransactionTableRowProps) {
  const formatter = useFormatter();

  const amount = Number(tx.amount) || 0;
  const isDebit =
    tx.type === ClientWalletTransactionType.DEBIT || tx.type === ClientWalletTransactionType.HOLD;
  const isHold = tx.type === ClientWalletTransactionType.HOLD;

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

  return (
    <TableRow className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
      {/* Description & Date & Reference ID */}
      <TableCell className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isHold
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : isDebit
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {isDebit ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownLeft className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 font-outfit truncate max-w-[200px] sm:max-w-xs">
                {formatPurpose(tx.purpose)}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3 shrink-0 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {refId && (
            <div className="shrink-0">
              <CopyableRefId id={refId} />
            </div>
          )}
        </div>
      </TableCell>

      {/* Type Badge */}
      <TableCell className="py-3">
        <span
          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
            isHold
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : isDebit
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {tx.type || ClientWalletTransactionType.CREDIT}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3">
        {isHold ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>On Hold</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        )}
      </TableCell>

      {/* Amount */}
      <TableCell className="py-3 text-right">
        <span
          className={`text-xs sm:text-sm font-bold font-outfit block ${
            isDebit ? "text-slate-900" : "text-emerald-700"
          }`}
        >
          {isDebit ? "-" : "+"}₹{amount.toLocaleString("en-IN")}
        </span>
      </TableCell>
    </TableRow>
  );
}
