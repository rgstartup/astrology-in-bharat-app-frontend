import React from "react";

export default function ProductsLoading() {
  return (
    <section className="!bg-[#edeef1] py-6 md:py-10">
      <div className="max-w-[1320px] mx-auto px-0 md:px-8 lg:px-16">
        <div className="h-8 w-48 bg-gray-300 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-2xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
