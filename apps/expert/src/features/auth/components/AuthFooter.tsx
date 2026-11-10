"use client";

import React from "react";
import { Link } from "@/i18n/navigation";

export interface AuthFooterProps {
  className?: string;
}

/**
 * AuthFooter component for Expert Portal authentication screens.
 * Displays copyright and privacy policy links.
 */
export const AuthFooter: React.FC<AuthFooterProps> = ({ className }) => {
  return (
    <div
      className={
        className ||
        "w-full mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400"
      }
    >
      <span>Copyright © {new Date().getFullYear()} Astrology in Bharat</span>
      <Link href="/privacy" className="hover:text-stone-600 transition-colors">
        Privacy Policy
      </Link>
    </div>
  );
};

export default AuthFooter;
