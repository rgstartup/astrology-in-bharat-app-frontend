"use client";

import React, { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import type { AppLocale } from "@/i18n/routing";
import { useRouter, usePathname } from "@/i18n/navigation";

interface LanguageButtonProps {
  changeLanguage: (language: AppLocale) => void;
  closeLanguageDropdown: () => void;
  lang: AppLocale;
  showLanguageDropDown: boolean;
}

const LanguageButtons = (props: LanguageButtonProps) => {
  if (!props.showLanguageDropDown) return null;

  return (
    <div className="absolute top-[125%] left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden w-[110px] text-gray-800 z-[1002] border border-gray-100 flex flex-col animate-in fade-in-0 zoom-in-95 duration-100">
      <button
        onClick={() => {
          props.changeLanguage("en");
          props.closeLanguageDropdown();
        }}
        className={`px-3 py-1.5 text-left text-xs transition-colors cursor-pointer hover:bg-orange-50 hover:text-orange ${props.lang === "en" ? "font-bold bg-orange-50/50 text-orange" : "font-medium"}`}
      >
        English
      </button>
      <hr className="m-0 border-gray-100" />
      <button
        onClick={() => {
          props.changeLanguage("hi");
          props.closeLanguageDropdown();
        }}
        className={`px-3 py-1.5 text-left text-xs transition-colors cursor-pointer hover:bg-orange-50 hover:text-orange ${props.lang === "hi" ? "font-bold bg-orange-50/50 text-orange" : "font-medium"}`}
      >
        हिंदी
      </button>
    </div>
  );
};

const LanguageSwitcherDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeLanguage = useLocale();

  const [showLanguageDropDown, setShowLanguageDropDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const closeLanguageDropdown = () => setShowLanguageDropDown(false);

  const changeLanguage = async (language: AppLocale) => {
    router.replace(pathname, { locale: language });
    router.refresh();
  };

  useClickOutside(ref, closeLanguageDropdown, showLanguageDropDown);
  useScrollClose(closeLanguageDropdown, showLanguageDropDown);

  return (
    <div className="language-dropdown-container relative flex items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setShowLanguageDropDown(!showLanguageDropDown)}
        className="flex items-center justify-center gap-1 h-7.5 px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold select-none transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
        aria-label="Toggle language menu"
      >
        <span>{activeLanguage === "hi" ? "हिंदी" : "EN"}</span>
        <ChevronDown
          className={`size-3 text-white/80 transition-transform duration-200 ${
            showLanguageDropDown ? "rotate-180" : ""
          }`}
        />
      </button>

      <LanguageButtons
        closeLanguageDropdown={closeLanguageDropdown}
        changeLanguage={changeLanguage}
        lang={activeLanguage}
        showLanguageDropDown={showLanguageDropDown}
      />
    </div>
  );
};

export default LanguageSwitcherDropdown;
