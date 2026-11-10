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
  subtitle = "EXPERT PORTAL",
  title = "Astrology in Bharat",
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
        <span className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none">
          {title}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider leading-none">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default AuthHeader;
