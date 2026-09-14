import React from "react";
import { StoreSkeletonCard } from "@/components/features/shop/StoreSkeletonCard";

export default function StoresLoading() {
  return (
    <section
      className="pt-6 pb-10 relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {[1, 2, 3].map((i) => (
            <StoreSkeletonCard key={`store-skeleton-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
