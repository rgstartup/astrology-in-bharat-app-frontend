"use client";

import React from "react";

type SummaryHeadingProps = {
  status?: string;
  reason?: string;
  isDarkMode?: boolean;
};

function ExpiredHeading() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-bold tracking-tight">Session Expired</h2>
      <p className="text-xs text-muted-foreground">Expert missed the request</p>
    </div>
  );
}

function TerminatedHeading() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-bold tracking-tight">Admin Terminated Session</h2>
      <p className="text-xs text-muted-foreground">Ended by administrator</p>
    </div>
  );
}

function FreeLimitHeading() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-bold tracking-tight">Free Session Ended</h2>
      <p className="text-xs text-muted-foreground">Your free consultation has ended</p>
    </div>
  );
}

function InsufficientHeading() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-bold tracking-tight">Low Balance</h2>
      <p className="text-xs text-muted-foreground">Session ended due to low wallet balance</p>
    </div>
  );
}

function DefaultHeading() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-bold tracking-tight">Session Summary</h2>
      <p className="text-xs text-muted-foreground">Consultation finished</p>
    </div>
  );
}

/** Waterfall: one early return per terminal state, no nested ternaries. */
export default function SummaryHeading({ status, reason }: SummaryHeadingProps) {
  if (status === "expired") return <ExpiredHeading />;
  if (status === "terminated") return <TerminatedHeading />;
  if (reason === "free_limit_ended_no_balance") return <FreeLimitHeading />;
  if (reason === "insufficient_balance") return <InsufficientHeading />;
  return <DefaultHeading />;
}
