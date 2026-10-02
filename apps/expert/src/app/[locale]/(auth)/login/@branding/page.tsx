import Image from "next/image";
import { BrandingStats, BrandingStatsSkeleton } from "@/features/auth";
import { Suspense } from "react";

export default function BrandingSlotPage() {
  return (
    <div className="relative hidden lg:block h-full min-h-150">
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
        <Suspense fallback={<BrandingStatsSkeleton />}>
          <BrandingStats />
        </Suspense>
      </div>
    </div>
  );
}
