import React from "react";
import { features } from "./data";
import IconBubble from "./icon.component";

const WhyChooseUs = () => {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 text-center text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
        Why Choose Us
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex min-h-[126px] gap-5 rounded-xl border border-[#ffd8c0] bg-white/75 p-6 shadow-[0_10px_26px_rgba(105,47,16,0.04)] transition hover:-translate-y-1 hover:bg-white"
          >
            <IconBubble icon={feature.icon} className="rounded-xl" />
            <div>
              <h3 className="mb-2 text-base font-black text-[#32131b]">
                {feature.title}
              </h3>
              <p className="text-sm font-medium leading-6 text-[#6f5c58]">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
