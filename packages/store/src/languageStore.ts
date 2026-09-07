import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "./horoscope-translations";

interface LanguageState {
    lang: Language;
    setLang: (lang: Language) => void;
    toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            lang: "en",
            setLang: (lang) => set({ lang }),
            toggleLang: () => set((state) => ({ lang: state.lang === "en" ? "hi" : "en" })),
        }),
        {
            name: "astrology-language-storage", // key in localStorage
        }
    )
);
