import { bharatTheme } from "./bharat";
import { vedicTheme } from "./vedic";
import type { DesignTheme, ThemeColors, ThemeName } from "./types";

export const themes: Record<ThemeName, DesignTheme> = {
  bharat: bharatTheme,
  vedic: vedicTheme,
};

export const defaultTheme: DesignTheme = bharatTheme;

export {
  bharatTheme,
  vedicTheme,
  type DesignTheme,
  type ThemeColors,
  type ThemeName,
};
