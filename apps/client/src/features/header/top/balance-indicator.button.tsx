"use client";

import React, { useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Wallet, ArrowRight, PlusCircle, History, LogIn } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { formatCompactNumber } from "@repo/ui";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";

const BalanceIndicator = () => {
  const { balance: currentBalance, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [showWalletDropDown, setShowWalletDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setShowWalletDropDown(false);

  useClickOutside(dropdownRef, closeDropdown, showWalletDropDown);
  useScrollClose(closeDropdown, showWalletDropDown);

  const handleNavigate = (path: string) => {
    closeDropdown();
    router.push(path);
  };

  const displayBalance = isAuthenticated
    ? formatCompactNumber(currentBalance ?? 0)
    : "0";

  return (
    <div className="wallet-dropdown-container relative flex items-center" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setShowWalletDropDown((prev) => !prev)}
        aria-label="User Wallet Balance"
        aria-expanded={showWalletDropDown}
        className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold tracking-tight transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs cursor-pointer select-none"
      >
        <div className="flex items-center justify-center size-4.5 rounded-full bg-amber-400/20 text-amber-300">
          <Wallet className="size-3 text-amber-300" />
        </div>
        <span className="text-white font-bold text-xs">
          ₹{displayBalance}
        </span>
      </button>

      {/* Wallet Popup (Compact) */}
      {showWalletDropDown && (
        <div className="absolute top-[125%] right-0 w-56 sm:w-60 rounded-xl bg-white text-gray-900 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[1100] animate-in fade-in-0 zoom-in-95 duration-100 flex flex-col">
          {isAuthenticated ? (
            <div>
              {/* Header Balance Banner */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-100 uppercase font-semibold tracking-wider block">
                    Available Balance
                  </span>
                  <span className="text-sm font-bold text-white">
                    ₹{currentBalance?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div className="size-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Wallet className="size-3.5" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=wallet`)}
                  className="w-full h-7.5 bg-orange hover:bg-[#e04b00] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-xs"
                >
                  <PlusCircle className="size-3.5" />
                  <span>Recharge Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=wallet`)}
                  className="w-full px-2 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700 text-[11px] font-medium flex items-center justify-between transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <span className="flex items-center gap-1.5">
                    <History className="size-3 text-gray-500" />
                    <span>Transaction History</span>
                  </span>
                  <ArrowRight className="size-3 text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 text-center">
              <div className="size-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5 border border-amber-100">
                <Wallet className="size-4" />
              </div>
              <p className="text-xs font-semibold text-gray-800">
                Wallet Balance: ₹0
              </p>
              <p className="text-[10.5px] text-gray-500 mt-0.5 mb-2 leading-tight">
                Sign in to recharge and manage your balance
              </p>
              <button
                type="button"
                onClick={() =>
                  handleNavigate(
                    withCallbackUrl(PATHS.SIGN_IN, `${PATHS.PROFILE}?tab=wallet`),
                  )
                }
                className="w-full h-7.5 bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-xs"
              >
                <LogIn className="size-3" />
                <span>Sign In to Recharge</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BalanceIndicator;
