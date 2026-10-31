"use client";

import React from "react";

/** Session billing fields read by the receipt. All optional, both casings. */
export type BillingSummary = {
  status?: string;
  durationMins?: number;
  duration_seconds?: number;
  isFree?: boolean;
  is_free?: boolean;
  pricePerMinute?: number;
  price_per_minute?: number;
  totalCost?: number;
  total_cost?: number;
  final_price?: number;
  remainingBalance?: number;
  freeMinutes?: number;
} | null;

export type BillingBreakdownProps = {
  sessionSummary: BillingSummary;
  freeMinutes: number;
  isDarkMode?: boolean;
};

/**
 * Calculates session duration in fractional minutes.
 *
 * @param sessionSummary - The billing summary object.
 * @returns Duration in minutes.
 */
const durationMins = (sessionSummary: BillingBreakdownProps["sessionSummary"]): number => {
  if (sessionSummary?.durationMins !== undefined) {
    return sessionSummary.durationMins;
  }
  if (sessionSummary?.duration_seconds !== undefined) {
    return sessionSummary.duration_seconds / 60;
  }
  return 0;
};

/**
 * Formats duration into minutes and seconds string representation.
 *
 * @param sessionSummary - The billing summary object.
 * @returns Formatted duration string (e.g. "12 min 30 sec").
 */
const formatDuration = (sessionSummary: BillingBreakdownProps["sessionSummary"]): string => {
  const duration = durationMins(sessionSummary);
  if (!duration) return "0 sec";
  const mins = Math.floor(duration);
  const secs = Math.round((duration % 1) * 60);
  if (mins > 0 && secs > 0) return `${mins} min ${secs} sec`;
  if (mins > 0) return `${mins} min`;
  return `${secs} sec`;
};

/**
 * Renders the promotional discount line when free minutes applied.
 */
function FreeDiscountRow({
  sessionSummary,
  freeMinutes,
}: {
  sessionSummary: BillingBreakdownProps["sessionSummary"];
  freeMinutes: number;
}) {
  const isFree = Boolean(sessionSummary?.isFree || sessionSummary?.is_free);
  if (!isFree) return null;
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-[#626260]">Free minutes applied</span>
      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
        −{sessionSummary?.freeMinutes ?? freeMinutes} min
      </span>
    </div>
  );
}

/**
 * Renders the session breakdown and financial summary card.
 *
 * @param props - Component properties containing billing data.
 * @returns Billing breakdown card JSX.
 */
export default function BillingBreakdown({ sessionSummary, freeMinutes }: BillingBreakdownProps) {
  if (sessionSummary?.status === "terminated") return null;

  return (
    <section aria-label="Billing summary" className="flex w-full flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
          Session Summary
        </h3>
      </div>

      <div className="w-full rounded-xl bg-[#faf8f5]/60 p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#ece8e1] pb-2.5 text-sm">
          <span className="text-[#626260]">Duration</span>
          <span className="font-medium text-[#111111]">{formatDuration(sessionSummary)}</span>
        </div>

      <div className="flex items-center justify-between border-b border-[#ece8e1] py-2.5 text-sm">
        <span className="text-[#626260]">Rate per minute</span>
        <span className="font-medium text-[#111111]">
          ₹{sessionSummary?.pricePerMinute ?? sessionSummary?.price_per_minute ?? 0}
        </span>
      </div>

      <FreeDiscountRow sessionSummary={sessionSummary} freeMinutes={freeMinutes} />

      <div className="flex items-center justify-between border-b border-[#ece8e1] py-3">
        <span className="text-sm font-medium text-[#111111]">Total charged</span>
        <span className="text-xl font-semibold tracking-[-0.3px] text-[#111111]">
          ₹
          {sessionSummary?.totalCost ??
            sessionSummary?.total_cost ??
            sessionSummary?.final_price ??
            0}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2.5 text-sm">
        <span className="text-[#626260]">Wallet balance remaining</span>
        <span className="font-medium text-[#111111]">
          ₹{Math.floor(sessionSummary?.remainingBalance ?? 0)}
        </span>
      </div>
    </div>
  </section>
);
}
