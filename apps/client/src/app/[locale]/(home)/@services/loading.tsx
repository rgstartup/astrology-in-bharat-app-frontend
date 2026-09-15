import React from "react";

export default function ServicesLoading() {
  return (
    <section
      className="py-10 md:py-16 overflow-x-hidden"
      style={{
        backgroundImage: "url('/images/white-background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div
          className="bg-[#f7f3ec] p-5 md:p-6 rounded-[20px] shadow-[0_4px_9px_0_rgba(0,0,0,0.06)]"
          style={{ border: "solid 1px rgba(242,107,0,0.17)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-orange-200/40 rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-orange-200/30 rounded-lg animate-pulse hidden sm:block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-1 pb-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`service-skeleton-${i}`}
                className="bg-white/80 rounded-2xl border border-orange-100 p-3 h-[240px] flex flex-col justify-between animate-pulse"
              >
                <div className="w-full h-[145px] sm:h-[155px] bg-orange-100/50 rounded-xl mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-orange-100/60 rounded w-3/4" />
                  <div className="h-3 bg-orange-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
