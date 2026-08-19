"use client";
import React from "react";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";
import { aboutTranslations } from "@/lib/translations/about";

const ServicesSection: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = aboutTranslations[lang as keyof typeof aboutTranslations] || aboutTranslations.en;

  const services = [
    { icon: "fa-comments", label: t.service1Label, desc: t.service1Desc, link: "/our-experts" },
    { icon: "fa-phone", label: t.service2Label, desc: t.service2Desc, link: "/our-experts" },
    { icon: "fa-video", label: t.service3Label, desc: t.service3Desc, link: "/our-experts" },
    { icon: "fa-scroll", label: t.service4Label, desc: t.service4Desc },
    { icon: "fa-heart", label: t.service5Label, desc: t.service5Desc },
    { icon: "fa-ring", label: t.service6Label, desc: t.service6Desc, link: "/online-puja" },
    { icon: "fa-gem", label: t.service7Label, desc: t.service7Desc },
    { icon: "fa-calculator", label: t.service8Label, desc: t.service8Desc },
  ];

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange block animate-in fade-in slide-in-from-top-4 duration-700">
            {t.servicesTag}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t.servicesTitle}
          </h2>
          <div className="w-16 h-1.5 bg-orange mx-auto rounded-full mt-6"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((svc, i) => {
            const isClickable = !!svc.link;
            
            const cardContent = (
              <div 
                className={`group relative bg-gradient-to-br from-[#2b1117] to-[#3e1b23] rounded-[2.5rem] p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-500 h-full border border-white/5 shadow-2xl ${
                  isClickable ? 'hover:-translate-y-3 hover:shadow-orange-500/20 active:scale-95' : ''
                }`}
              >
                {/* Visual Depth Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>

                {/* Icon Container */}
                <div className="mb-8 relative shrink-0">
                  <div className="absolute inset-0 bg-orange-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform group-hover:rotate-6 transition-transform duration-500">
                    <i className={`fa-solid ${svc.icon} text-white text-2xl`} />
                  </div>
                </div>
                
                {/* Info Content */}
                <div className="space-y-4 grow flex flex-col items-center justify-center">
                  <h6 className="text-[15px] font-black text-white uppercase tracking-widest leading-tight group-hover:text-orange transition-colors">
                    {svc.label}
                  </h6>
                  <div className="w-8 h-px bg-white/10 group-hover:bg-orange/50 transition-all duration-500"></div>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-[200px] italic">
                    {svc.desc}
                  </p>
                </div>

                {/* Action Indicator */}
                {isClickable && (
                  <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <i className="fa-solid fa-arrow-right text-orange text-sm"></i>
                    </div>
                  </div>
                )}
              </div>
            );

            return isClickable ? (
              <Link key={i} href={svc.link!} className="block h-full no-underline animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 50}ms` }}>
                {cardContent}
              </Link>
            ) : (
              <div key={i} className="h-full animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 50}ms` }}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
