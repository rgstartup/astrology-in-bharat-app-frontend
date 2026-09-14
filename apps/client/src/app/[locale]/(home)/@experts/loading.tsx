import React from "react";

export default function ExpertsLoading() {
  return (
    <section className="pt-6 pb-10 relative overflow-hidden bg-white">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-100 rounded-3xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
