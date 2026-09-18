"use client";
import React from "react";
import Link from "next/link";
import { PATHS, URLS } from "@repo/routes";
import { useLanguageStore, footerTranslations } from "@repo/store";

const Footer: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = footerTranslations[lang as keyof typeof footerTranslations] || footerTranslations.en;

  return (
    <>
      <footer className="bg-[#1d1212] pt-10 md:pt-[70px] pb-[30px] border-t border-[#d1ab8b1c]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">

            {/* Logo & About Section */}
            <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src="/images/web-logo-white.png"
                alt="Astrology in Bharat Logo"
                className="mb-4 w-[200px] md:w-full md:max-w-[260px] object-contain"
              />
              <p className="text-xs md:text-sm leading-relaxed text-[#dfdfdf] mb-3.5 px-4 md:px-0">
                {t.aboutText}
              </p>

              <ul className="flex items-center gap-2.5">
                {[
                  { icon: "fa-facebook", href: "#" },
                  { icon: "fa-instagram", href: "#" },
                  { icon: "fa-youtube", href: "#" },
                  { icon: "fa-linkedin-in", href: "#" },
                  { icon: "fa-pinterest", href: "#" },
                ].map((social, idx) => (
                  <li key={idx}>
                    <a
                      href={social.href}
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-full bg-white border-2 border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-all duration-300"
                    >
                      <i className={`fa-brands ${social.icon} text-sm`}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links columns wrapper */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
              {/* Free Calculator */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#ff6b00] mb-3 md:mb-3.5">{t.freeCalculator}</h4>
                <ul className="flex flex-col items-start gap-2.5 pl-0">
                  {[
                    { label: t.marriageAge, href: PATHS.ASTROLOGY.CALCULATOR.MARRIAGE_AGE_CALCULATOR },
                    { label: t.dahejCalculator, href: PATHS.ASTROLOGY.CALCULATOR.DAHEJ_CALCULATOR },
                    { label: t.loveCompatibility, href: PATHS.ASTROLOGY.CALCULATOR.LOVE_COMPATIBILITY_CALCULATOR },
                    { label: t.luckyNumber, href: PATHS.ASTROLOGY.CALCULATOR.LUCKY_NUMBER_CALCULATOR },
                    { label: t.lifePath, href: PATHS.ASTROLOGY.CALCULATOR.LIFE_PATH_CALCULATOR },
                    { label: t.nakshatraFinder, href: PATHS.ASTROLOGY.CALCULATOR.NAKSHATRA_FINDER },
                  ].map((link, idx) => (
                    <li key={idx}>
                      <Link href={link.href} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group">
                        <i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" />
                        <span className="leading-tight">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Astrology Services */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#ff6b00] mb-3 md:mb-3.5">{t.astrologyServices}</h4>
                <ul className="flex flex-col items-start gap-2.5 pl-0">
                  <li><Link href={PATHS.ONLINE_PUJA} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.onlinePuja}</span></Link></li>
                  <li><a href="/our-experts" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.talkToExpert}</span></a></li>
                  <li><Link href={PATHS.ASTROLOGY.HOROSCOPE} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.dailyHoroscope}</span></Link></li>
                  <li><Link href={PATHS.ASTROLOGY.KUNDALI_MATCHING} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.kundliMatching}</span></Link></li>
                  <li><Link href={PATHS.ASTROLOGY.CALCULATOR.NAME_NUMEROLOGY_CALCULATOR} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.numerologyReport}</span></Link></li>
                  <li><Link href={PATHS.HINDU_CALENDAR} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.shubhMuhurat}</span></Link></li>
                </ul>
              </div>

              {/* Important Links */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#ff6b00] mb-3 md:mb-3.5">{t.importantLinks}</h4>
                <ul className="flex flex-col items-start gap-2.5 pl-0">
                  <li><a href="https://astrology-in-bharat-app-expert-dash.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.expertLogin}</span></a></li>
                  <li><a href="https://astrology-in-bharat-app-expert-dash.vercel.app/register" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.expertRegistration}</span></a></li>
                  <li><Link href="/register" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.userRegistration}</span></Link></li>
                  <li><a href="http://localhost:3004/login" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.merchantLogin}</span></a></li>
                  <li><a href="http://localhost:3004/register" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.merchantRegistration}</span></a></li>
                  <li><Link href={PATHS.BUY_PRODUCTS} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.shopProducts}</span></Link></li>
                </ul>
              </div>

              {/* Helpful Info */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#ff6b00] mb-3 md:mb-3.5">{t.helpfulInfo}</h4>
                <ul className="flex flex-col items-start gap-2.5 pl-0">
                  <li><Link href={PATHS.REFUND_POLICY} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.refundPolicy}</span></Link></li>
                  <li><Link href={PATHS.PRIVACY_POLICY} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.privacyPolicy}</span></Link></li>
                  <li><Link href={PATHS.TERMS_AND_CONDITIONS} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.termsConditions}</span></Link></li>
                  <li><Link href={PATHS.COPYRIGHT} className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.copyrightNotice}</span></Link></li>
                  <li><Link href="/about" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.aboutUs}</span></Link></li>
                  <li><Link href="/contact-us" className="text-xs md:text-sm text-[#f3f3f3] hover:text-[#ff6b00] transition-colors no-underline flex items-start md:items-center gap-2 group"><i className="fa-solid fa-angle-right text-[#ff6b00] text-[10px] transform group-hover:translate-x-1 transition-transform mt-1 md:mt-0" /><span className="leading-tight">{t.contactUs}</span></Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-[40px] pt-[25px] border-t border-white/10 text-center">
            <p className="text-[13px] text-[#aaa] font-medium m-0">
              {t.copyright}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;



