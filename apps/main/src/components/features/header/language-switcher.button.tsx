"use client";

import { type Language, useLanguageStore } from "@repo/store";

interface LanguageButtonProps {
  changeLanguage: (language: Language) => void;
  closeLanguageDropdown: () => void;
  lang: Language;
  showLanguageDropDown: boolean;
}

interface LanguageSwitcherDropDownProps {
  showLanguageDropDown: boolean;
  setShowLanguageDropDown: React.Dispatch<React.SetStateAction<boolean>>;
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

const LanguageSwitcherDropdown = (props: LanguageSwitcherDropDownProps) => {
  const { lang, setLang } = useLanguageStore();

  const closeLanguageDropdown = () => props.setShowLanguageDropDown(false);

  const changeLanguage = (language: Language) => setLang(language);

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       const target = event.target as HTMLElement;
  //       // Language dropdown
  //       if (!target.closest(".language-dropdown-container")) {
  //         setShowLanguageDropDown(false);
  //       }
  //     };

  //     const handleScroll = () => {
  //       // Close desktop dropdowns on main body scroll
  //       if (showLanguageDropDown) setShowLanguageDropDown(false);
  //     };

  //     if (showLanguageDropDown) {
  //       document.addEventListener("mousedown", handleClickOutside);
  //       // Only attach scroll close behavior to desktop dropdowns
  //       if (showLanguageDropDown) {
  //         window.addEventListener("scroll", handleScroll, { passive: true });
  //       }

  //       return () => {
  //         document.removeEventListener("mousedown", handleClickOutside);
  //         window.removeEventListener("scroll", handleScroll);
  //       };
  //     }
  //   }, [showLanguageDropDown]);

  /* Language Switcher Dropdown */
  return (
    <div className="language-dropdown-container relative">
      <button
        onClick={() =>
          props.setShowLanguageDropDown(!props.showLanguageDropDown)
        }
        className="flex items-center gap-1 sm:gap-1.5 focus:outline-none bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all border border-white/20 select-none"
      >
        <i className="fa-solid fa-globe text-[10px] sm:text-sm" />
        <span className="text-[10px] sm:text-sm font-semibold">
          {lang === "hi" ? "हिंदी" : "EN"}
        </span>
        <i
          className={`fa-solid fa-chevron-down text-[8px] sm:text-[10px] transition-transform ${props.showLanguageDropDown ? "rotate-180" : ""}`}
        />
      </button>

      <LanguageButtons
        closeLanguageDropdown={closeLanguageDropdown}
        changeLanguage={changeLanguage}
        lang={lang}
        showLanguageDropDown={props.showLanguageDropDown}
      />
    </div>
  );
};

export default LanguageSwitcherDropdown;
