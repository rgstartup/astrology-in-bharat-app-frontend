import React from "react";
import Image from "next/image";

export interface BrandingSectionProps {
  stats: {
    totalExperts: string;
    totalServices: string;
  };
}

export const BrandingSection: React.FC<BrandingSectionProps> = ({ stats }) => {
  return (
    <div className="relative hidden lg:block h-full min-h-[600px]">
      <div className="absolute inset-0 bg-orange-600/95 flex flex-col items-center justify-start text-white pt-4 pb-12 px-12 text-center">
        <div className="relative w-56 h-56 mb-8 drop-shadow-2xl">
          <Image
            src="/images/Expert.png"
            alt="Expert Community"
            fill
            sizes="224px"
            className="object-contain -scale-x-100"
            priority
          />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">Welcome Back</h1>
        <p className="text-white/80 font-medium max-w-sm">
          Connect with seekers, share your cosmic wisdom, and grow your spiritual practice.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
            <p className="text-2xl font-black">{stats.totalExperts}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
              Total Experts
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
            <p className="text-2xl font-black">{stats.totalServices}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
              Services Given
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;
