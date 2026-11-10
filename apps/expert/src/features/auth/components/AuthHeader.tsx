"use client";

import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
  subtitle?: string;
  title?: string;
}

/**
 * AuthHeader component for Expert Portal authentication screens.
 * Displays brand emblem alongside platform title and dark amber subtitle.
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  subtitle = "Astrology in Bharat",
  title = "EXPERT PORTAL",
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Left: Brand Emblem Image matching right vertical height */}
      <div className="relative size-10 sm:size-11 shrink-0">
        <Image
          src="/images/Expert.png"
          alt="Astrology in Bharat"
          width={44}
          height={44}
          className="size-full object-contain -scale-x-100"
          priority
        />
      </div>

      {/* Right: Text on top, Subtitle text on bottom */}
      <div className="flex flex-col justify-between h-10 sm:h-11 py-0.5">
        <span className="text-lg sm:text-xl md:text-xl font-bold text-amber-700 tracking-tight leading-none">
          {title}
        </span>
        <span className="text-xs sm:text-[11px] font-bold text-stone-900 tracking-wide leading-none">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default AuthHeader;
