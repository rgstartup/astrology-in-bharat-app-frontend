"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Wallet } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { formatCompactNumber } from "@repo/ui";
import { PATHS } from "@repo/routes";

const BalanceIndicator = () => {
  const { balance: currentBalance, isAuthenticated } = useAuth();
  const [showFullBalance, setShowFullBalance] = useState(false);

  const displayBalance = isAuthenticated
    ? showFullBalance
      ? currentBalance?.toLocaleString() ?? "0"
      : formatCompactNumber(currentBalance ?? 0)
    : "0";

  const targetHref = isAuthenticated
    ? `${PATHS.PROFILE}?tab=wallet`
    : `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(`${PATHS.PROFILE}?tab=wallet`)}`;

  return (
    <Link
      href={targetHref}
      onMouseEnter={() => setShowFullBalance(true)}
      onMouseLeave={() => setShowFullBalance(false)}
      aria-label="User Wallet Balance"
      title={
        isAuthenticated
          ? `Wallet Balance: ₹${currentBalance?.toLocaleString() ?? 0} (Click to manage)`
          : "Wallet: ₹0 (Click to sign in & recharge)"
      }
      className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold tracking-tight transition-all duration-200 hover:scale-[1.03] active:scale-95 no-underline shadow-xs"
    >
      <div className="flex items-center justify-center size-5 rounded-full bg-amber-400/20 text-amber-300">
        <Wallet className="size-3 text-amber-300" />
      </div>
      <span className="text-white font-bold text-xs">
        ₹{displayBalance}
      </span>
    </Link>
  );
};

export default BalanceIndicator;
