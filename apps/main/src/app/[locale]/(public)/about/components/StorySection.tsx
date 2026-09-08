import { getTranslations } from "next-intl/server";

const StorySection = async () => {
  const t = await getTranslations("About");

  const milestones = [
    { year: "2022", event: t("milestone1") },
    { year: "2023", event: t("milestone2") },
    { year: "2024", event: t("milestone3") },
    { year: "2025", event: t("milestone4") },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex justify-center mb-20">
          <div className="w-full lg:w-8/12 text-center space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange block">
              {t("storyTag")}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              {t("storyTitle")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Column - Narrative */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <p className="text-slate-600 text-lg leading-relaxed font-medium italic border-l-4 border-orange/20 pl-6 py-2">
              &quot;{t("storyDesc1")}&quot;
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              {t("storyDesc2")}
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              {t("storyDesc3")}
            </p>
          </div>

          {/* Right Column - Milestones */}
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange/10 transition-colors"></div>

            <div className="space-y-8 relative z-10">
              {milestones.map((item, i) => (
                <div key={i} className="flex gap-6 items-start group/item">
                  <div className="w-16 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 transform group-hover/item:scale-110 transition-transform">
                    <span className="text-white font-black text-[10px] tracking-widest">
                      {item.year}
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="text-slate-600 text-sm font-bold leading-relaxed group-hover/item:text-slate-900 transition-colors">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
