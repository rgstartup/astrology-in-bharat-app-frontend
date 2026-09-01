import Image from "next/image";
import homepageData from "./data/homepage.json";
import { getTranslations } from "next-intl/server";
import type HomeMessages from "@messages/en/home.json";

const WhyChooseUs = async () => {
  const t = await getTranslations("Home");
  const reasons = t.raw(
    "whyChooseUs.reasons",
  ) as typeof HomeMessages.whyChooseUs.reasons;

  // Split into left and right columns (3 each)
  const leftItems = homepageData.whyChooseUs.slice(0, 3);
  const rightItems = homepageData.whyChooseUs.slice(3, 6);

  return (
    <section className="relative pt-8 md:pt-10 pb-16 md:pb-24 bg-[#1a0b0b] bg-[url('/images/bg-dark.png')] bg-cover bg-no-repeat bg-fixed overflow-hidden min-h-[700px]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div
          className="mb-8 md:mb-12 text-white w-full md:w-auto"
          style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
        >
          <h2 className="section-heading-premium uppercase mb-0">
            <span>{t("whyChooseUs.title")}</span>
          </h2>
          <p className="text-gray-300 font-medium text-sm mt-2 max-w-xl">
            {t("whyChooseUs.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
          {/* Left Cards */}
          <div className="md:col-span-4 space-y-4">
            {leftItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-[#1e0b0fa6] border border-orange/80 hover:border-orange rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center min-h-[160px] text-center hover:bg-[#2a1016a6] transition-all duration-500 shadow-xl hover:shadow-orange/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange flex items-center justify-center mb-4 md:mb-5 shadow-[0_0_15px_rgba(255,107,0,0.3)] group-hover:bg-orange/90 transition-all duration-500 border border-orange/50">
                  <i
                    className={`fa-solid ${item.icon} text-2xl md:text-2xl text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-md`}
                  ></i>
                </div>
                <h4 className="text-white text-sm md:text-base font-bold leading-snug group-hover:text-orange-50 transition-colors duration-300">
                  {reasons[index]}
                </h4>
              </div>
            ))}
          </div>

          {/* Center Illustration - Complex Layering */}
          <div className="md:col-span-4 relative flex items-center justify-center min-h-[300px] md:min-h-[450px]">
            {/* 1. Background Rotating Wheel */}
            <div className="absolute inset-0 flex items-center justify-center -mt-16 md:-mt-32 ml-4 md:ml-8">
              <Image
                src="/images/horoscope-round2.png"
                width={420}
                height={420}
                className="w-[80%] md:w-full max-w-[420px] h-auto animate-[spin_40s_linear_infinite] opacity-40 brightness-125"
                alt="zodiac wheel"
              />
            </div>

            {/* 2. Middle: Expert Mascot */}
            <Image
              src="/images/astro.png"
              alt="expert mascot"
              width={320}
              height={320}
              style={{ height: "auto" }}
              className="relative z-20 w-[65%] md:w-[85%] max-w-[320px] drop-shadow-[0_0_40px_rgba(255,107,0,0.2)]"
            />
          </div>

          {/* Right Cards */}
          <div className="md:col-span-4 space-y-4">
            {rightItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-[#1e0b0fa6] border border-orange/80 hover:border-orange rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center min-h-[160px] text-center hover:bg-[#2a1016a6] transition-all duration-500 shadow-xl hover:shadow-orange/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange flex items-center justify-center mb-4 md:mb-5 shadow-[0_0_15px_rgba(255,107,0,0.3)] group-hover:bg-orange/90 transition-all duration-500 border border-orange/50">
                  <i
                    className={`fa-solid ${item.icon} text-2xl md:text-2xl text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-md`}
                  ></i>
                </div>
                <h4 className="text-white text-sm md:text-base font-bold leading-snug group-hover:text-orange-50 transition-colors duration-300">
                  {reasons[index + 3]}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
