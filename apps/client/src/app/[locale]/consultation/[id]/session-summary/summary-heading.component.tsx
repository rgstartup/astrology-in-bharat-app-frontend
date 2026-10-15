"use client";

import React from "react";

type SummaryHeadingProps = {
  status?: string;
  reason?: string;
  isDarkMode?: boolean;
};

function HeadingShell({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-[22px] font-medium tracking-[-0.3px] text-[#111111]">{title}</h2>
      <p className="text-sm text-[#626260]">{subtitle}</p>
    </div>
  );
}

function ExpiredHeading() {
  return <HeadingShell title="Session expired" subtitle="The expert missed the request." />;
}

function TerminatedHeading() {
  return <HeadingShell title="Session ended" subtitle="Ended by an administrator." />;
}

function FreeLimitHeading() {
  return <HeadingShell title="Free session ended" subtitle="Your free consultation has ended." />;
}

function InsufficientHeading() {
  return <HeadingShell title="Low balance" subtitle="The session ended due to low wallet balance." />;
}

function DefaultHeading() {
  return <HeadingShell title="Session summary" subtitle="Thanks for consulting with us." />;
}

/** Waterfall: one early return per terminal state, no nested ternaries. */
export default function SummaryHeading({ status, reason }: SummaryHeadingProps) {
  if (status === "expired") return <ExpiredHeading />;
  if (status === "terminated") return <TerminatedHeading />;
  if (reason === "free_limit_ended_no_balance") return <FreeLimitHeading />;
  if (reason === "insufficient_balance") return <InsufficientHeading />;
  return <DefaultHeading />;
}
