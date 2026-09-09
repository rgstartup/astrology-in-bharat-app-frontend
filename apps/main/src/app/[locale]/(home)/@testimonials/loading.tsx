import React from "react";

export default function TestimonialsLoading() {
  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-[18px] bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
