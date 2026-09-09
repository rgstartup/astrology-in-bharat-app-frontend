import React from "react";
import { PujaGridSkeleton } from "@/components/features/puja/PujaSkeletonCard";

export default function PujasLoading() {
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
        <PujaGridSkeleton count={3} />
      </div>
    </section>
  );
}
