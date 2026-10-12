"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type BillingBreakdownProps = {
  sessionSummary: any;
  freeMinutes: number;
  isDarkMode: boolean;
};

const durationMins = (sessionSummary: any): number =>
  sessionSummary?.durationMins ||
  (sessionSummary?.duration_seconds ? sessionSummary.duration_seconds / 60 : 0);

/** Waterfall: zero duration short-circuits, otherwise minutes + seconds. */
const formatDuration = (sessionSummary: any): string => {
  const duration = durationMins(sessionSummary);
  if (!duration) return "0 Sec";
  const mins = Math.floor(duration) > 0 ? `${Math.floor(duration)} Min ` : "";
  return `${mins}${Math.round((duration % 1) * 60)} Sec`;
};

export default function BillingBreakdown({ sessionSummary, freeMinutes }: BillingBreakdownProps) {
  const isFree = Boolean(sessionSummary?.isFree || sessionSummary?.is_free);

  if (sessionSummary?.status === "terminated") return null;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold uppercase tracking-tight text-muted-foreground">
            Total Duration
          </span>
          <span className="font-bold">{formatDuration(sessionSummary)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold uppercase tracking-tight text-muted-foreground">
            Charge per minute
          </span>
          <span className="font-bold">
            ₹{sessionSummary?.pricePerMinute || sessionSummary?.price_per_minute || 0}
          </span>
        </div>
        <Separator />
        {isFree && (
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="uppercase tracking-tight text-muted-foreground">
              Free Minutes Discount
            </span>
            <Badge variant="emerald">
              -{sessionSummary?.freeMinutes || freeMinutes} Mins
            </Badge>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-tight text-primary">
            Amount Deducted
          </span>
          <span className="text-xl font-bold">
            ₹{sessionSummary?.totalCost ?? sessionSummary?.total_cost ?? sessionSummary?.final_price ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Remaining Balance</span>
          <span className="font-bold">₹{Math.floor(sessionSummary?.remainingBalance || 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
