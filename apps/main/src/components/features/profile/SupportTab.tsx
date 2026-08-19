import React from "react";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";

interface SupportTabProps {
    supportSettings: {
        email?: string;
        whatsapp?: string;
        phone?: string;
    };
}

const SupportTab: React.FC<SupportTabProps> = ({ supportSettings }) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).support;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h5
          className="text-lg font-bold text-gray-900 mb-0 flex items-center"
          style={fontStyle}
        >
          <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="fa-solid fa-headset"></i>
          </span>
          {t.title}
        </h5>
      </div>
      <div className="p-6 md:p-8">
        <p className="text-gray-500 text-sm mb-8" style={fontStyle}>
          {t.subtitle}
        </p>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Email Support */}
          <div className="group bg-white rounded-3xl p-6 md:p-8 text-center border border-orange shadow-sm hover:shadow-xl hover:shadow-orange/20 transition-all duration-300">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-orange group-hover:scale-110 transition-transform duration-500">
              <i className="fa-solid fa-envelope text-2xl md:text-3xl"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.emailSupport}
            </h6>
            <p className="text-orange font-bold text-sm mb-6 truncate px-2">
              {supportSettings.email || "support@astrologyinbharat.com"}
            </p>
            <a
              href={`mailto:${supportSettings.email || "support@astrologyinbharat.com"}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-orange hover:text-white hover:border-orange transition-all no-underline"
              style={fontStyle}
            >
              <i className="fa-solid fa-paper-plane"></i>
              {t.sendEmail}
            </a>
          </div>

          {/* WhatsApp Support */}
          <div className="group bg-white rounded-3xl p-6 md:p-8 text-center border border-orange shadow-sm hover:shadow-xl hover:shadow-orange/20 transition-all duration-300">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-500">
              <i className="fa-brands fa-whatsapp text-2xl md:text-3xl"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.whatsapp}
            </h6>
            <p className="text-emerald-600 font-bold text-sm mb-6">
              {supportSettings.whatsapp || "+91 9876543210"}
            </p>
            <a
              href={`https://wa.me/${(supportSettings.whatsapp || "+919876543210").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-emerald-100 text-emerald-600 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all no-underline"
              style={fontStyle}
            >
              <i className="fa-brands fa-whatsapp"></i>
              {t.chatNow}
            </a>
          </div>

          {/* Phone Support */}
          <div className="group bg-white rounded-3xl p-6 md:p-8 text-center border border-orange shadow-sm hover:shadow-xl hover:shadow-orange/20 transition-all duration-300">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-500">
              <i className="fa-solid fa-phone text-2xl md:text-3xl"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.phoneSupport}
            </h6>
            <p className="text-blue-600 font-bold text-sm mb-6">
              {supportSettings.phone || "+91 9876543210"}
            </p>
            <a
              href={`tel:${supportSettings.phone || "+919876543210"}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-100 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all no-underline"
              style={fontStyle}
            >
              <i className="fa-solid fa-phone"></i>
              {t.callNow}
            </a>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 p-6 md:p-8 bg-orange/5 rounded-[2rem] border border-orange/10 relative overflow-hidden group">
          <div className="relative z-10">
            <h6
              className="text-lg font-bold text-gray-900 mb-6 flex items-center"
              style={fontStyle}
            >
              <span className="w-10 h-10 rounded-xl bg-orange text-white flex items-center justify-center mr-3 shadow-lg shadow-orange/20">
                <i className="fa-solid fa-lightbulb"></i>
              </span>
              {t.additionalResources}
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/terms", label: t.terms },
                { href: "/privacy", label: t.privacy },
                { href: "/refund-policy", label: t.refund },
                { href: "/about", label: t.about },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex items-center p-4 bg-white/60 hover:bg-white rounded-2xl border border-white/50 hover:border-orange/20 transition-all no-underline group/link"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mr-3 group-hover/link:scale-110 transition-transform">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <span
                    className="font-bold text-gray-700 group-hover/link:text-orange transition-colors"
                    style={fontStyle}
                  >
                    {link.label}
                  </span>
                  <i className="fa-solid fa-chevron-right ml-auto text-gray-300 text-[10px] group-hover/link:translate-x-1 transition-transform"></i>
                </a>
              ))}
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default SupportTab;


