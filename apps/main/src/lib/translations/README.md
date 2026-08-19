# Astrology In Bharat - Internationalization (i18n) Guide

This document explains how the multi-language (English/Hindi) support is implemented in the Astrology In Bharat Frontend application. Please read this before adding new features or components to ensure language support remains consistent.

## Overview

We use a custom, lightweight i18n solution powered by **Zustand** for global state management and **React Context/Hooks** to consume translations. 
We chose this approach to avoid heavy dependencies and to maintain full control over the translation architecture.

## How It Works

1. **Global State (`useLanguageStore`)**: 
   - A Zustand store saves the user's selected language (`en` or `hi`).
   - It uses the `persist` middleware to save the preference in `localStorage`, so the language persists across reloads.
2. **Translation Dictionaries**:
   - Translations are stored as static TypeScript objects (e.g., `lib/translations/header.ts`).
   - They follow a strict typing interface so that autocomplete works and missing keys cause TypeScript errors.
3. **Usage via Custom Hook (`useTranslation`)**:
   - Components use a custom hook to grab the current language and the correct translation dictionary.

## Adding Translations to a New Component

When creating a new component (e.g., `Footer.tsx`), follow these steps:

### 1. Create the Translation File
Create a new file in `apps/main/lib/translations/` (e.g., `footer.ts`):

```typescript
export const footerTranslations = {
  en: {
    about: "About Us",
    contact: "Contact",
  },
  hi: {
    about: "हमारे बारे में",
    contact: "संपर्क करें",
  }
} as const;
```

### 2. Use the Translations in the Component

```tsx
"use client";
import { useLanguageStore } from "@/store/languageStore";
import { footerTranslations } from "@/lib/translations/footer";

export default function Footer() {
  const { lang } = useLanguageStore();
  const t = footerTranslations[lang];

  return (
    <footer>
      <a href="/about">{t.about}</a>
      <a href="/contact">{t.contact}</a>
    </footer>
  );
}
```

## Special Cases: Dynamic API Data

For data that comes from external APIs (like the Daily Horoscope from Prokerala), we **do not** use static dictionaries. 
Instead, we pass the `lang` parameter to our Next.js API route (`api/horoscope/route.ts`), which dynamically translates the English response into Hindi using the Google Translate API before returning it to the frontend.

Always check if an external API supports a `lang` query parameter natively before writing custom translation logic.

## Formatting Dates
When displaying dates, always use the current language locale for consistency:
```tsx
new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
  month: "long", day: "numeric", year: "numeric",
})
```

## Typography
The application uses **Noto Sans Devanagari** for Hindi text. When applying `lang === "hi"`, make sure the font renders correctly. For critical headings, you may apply:
```tsx
style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}
```
