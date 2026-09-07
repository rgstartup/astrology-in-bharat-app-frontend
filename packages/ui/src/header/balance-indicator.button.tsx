"use client";

import { useAuthStore } from "@repo/store";
import { useState } from "react";
import { formatCompactNumber } from "../utils/currency";

const BalanceIndicator = () => {
  const { balance: currentBalance, isAuthenticated } = useAuthStore();
  const [showFullBalance, setShowFullBalance] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div
      onMouseEnter={() => setShowFullBalance(true)}
      onMouseLeave={() => setShowFullBalance(false)}
      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-help whitespace-nowrap bg-orange hover:opacity-90 shadow-lg relative overflow-hidden"
      style={{
        minWidth: "75px",
        justifyContent: "center",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle gloss effect */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-white/10"
        style={{ pointerEvents: "none" }}
      />

      <i
        className="fa-solid fa-coins text-white text-xs"
        style={{
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
        }}
      />
      <span
        className="text-white font-black text-sm tracking-tight"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        ₹
        {showFullBalance
          ? currentBalance?.toLocaleString()
          : formatCompactNumber(currentBalance)}
      </span>
    </div>
  );
};

export default BalanceIndicator;
