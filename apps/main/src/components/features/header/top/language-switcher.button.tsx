"use client";

import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { isAppLocale, type AppLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface LanguageButtonProps {
  changeLanguage: (language: AppLocale) => void;
  closeLanguageDropdown: () => void;
  lang: AppLocale;
  showLanguageDropDown: boolean;
}

const LanguageButtons = (props: LanguageButtonProps) => {
  if (!props.showLanguageDropDown) return null;

  return (
    <div className="absolute top-[120%] left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden w-[120px] text-gray-800 z-[1002] border border-gray-100 flex flex-col">
      <button
        onClick={() => {
          props.changeLanguage("en");
          props.closeLanguageDropdown();
        }}
        className={`px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange ${props.lang === "en" ? "font-bold bg-orange-50/50 text-orange" : "font-medium"}`}
      >
        English
      </button>
      <hr className="m-0 border-gray-100" />
      <button
        onClick={() => {
          props.changeLanguage("hi");
          props.closeLanguageDropdown();
        }}
        className={`px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange ${props.lang === "hi" ? "font-bold bg-orange-50/50 text-orange" : "font-medium"}`}
      >
        हिंदी
      </button>
    </div>
  );
};

const LanguageSwitcherDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const providerLocale = useLocale() as AppLocale;
  const pathLocale = pathname?.split("/")[1];
  const activeLanguage = isAppLocale(pathLocale ?? "")
    ? pathLocale
    : providerLocale;

  const [showLanguageDropDown, setShowLanguageDropDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const closeLanguageDropdown = () => setShowLanguageDropDown(false);

  const changeLanguage = async (language: AppLocale) => {
    const response = await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: language }),
    });

    if (!response.ok) return;

    router.replace(`/${language}`);
  };

  useClickOutside(ref, closeLanguageDropdown, showLanguageDropDown);
  useScrollClose(closeLanguageDropdown, showLanguageDropDown);

  /* Language Switcher Dropdown */
  return (
    <div className="language-dropdown-container relative" ref={ref}>
      <button
        onClick={() => setShowLanguageDropDown(!showLanguageDropDown)}
        className="flex items-center gap-1 sm:gap-1.5 focus:outline-none bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all border border-white/20 select-none"
      >
        <i className="fa-solid fa-globe text-[10px] sm:text-sm" />
        <span className="text-[10px] sm:text-sm font-semibold">
          {activeLanguage === "hi" ? "हिंदी" : "EN"}
        </span>
        <i
          className={`fa-solid fa-chevron-down text-[8px] sm:text-[10px] transition-transform ${showLanguageDropDown ? "rotate-180" : ""}`}
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
