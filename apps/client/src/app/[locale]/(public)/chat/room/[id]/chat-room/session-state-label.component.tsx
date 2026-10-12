"use client";

import React from "react";

type SessionStateLabelProps = {
  sessionStatus: string;
  isDarkMode: boolean;
};

/** Waterfall: one early return per session state, no nested ternaries. */
export default function SessionStateLabel({ sessionStatus, isDarkMode }: SessionStateLabelProps) {
  const labelClass = `text-[10px] uppercase font-bold ${isDarkMode ? "text-orange-400" : "text-[#fd6410]"}`;

  if (sessionStatus === "active") {
    return <span className={labelClass}>Session Live</span>;
  }

  if (sessionStatus === "completed") {
    return <span className={labelClass}>Finished</span>;
  }

  return <span className={labelClass}>Initializing...</span>;
}
