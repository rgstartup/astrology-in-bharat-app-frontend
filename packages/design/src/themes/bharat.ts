import { colors } from "../tokens/primitives/colors";
import type { DesignTheme } from "./types";

export const bharatTheme: DesignTheme = {
  name: "bharat",
  label: "Bharat Saffron",
  radius: "0.625rem",
  light: {
    background: colors.neutral.white,
    foreground: colors.brown[900],
    card: colors.neutral.white,
    cardForeground: colors.brown[900],
    popover: colors.neutral.white,
    popoverForeground: colors.brown[900],
    primary: colors.saffron[700], // #c2410c
    primaryForeground: colors.neutral.white,
    primaryHover: colors.saffron[800], // #9a3412
    secondary: colors.neutral.gray[100], // #f3f4f6
    secondaryForeground: colors.emerald[700], // #047857
    muted: colors.neutral.gray[100],
    mutedForeground: colors.brown[500], // #75666a
    accent: colors.neutral.gray[100],
    accentForeground: colors.brown[900],
    accentGold: colors.gold[500], // #d4af37
    destructive: colors.status.destructive,
    destructiveForeground: colors.neutral.white,
    border: colors.neutral.gray[200], // #e5e7eb
    input: colors.neutral.gray[200],
    ring: colors.saffron[700],
    brandSaffron: colors.saffron[500], // #ff6b00
    brandSaffronStrong: colors.saffron[700], // #c2410c
    brandEmerald: colors.emerald[700], // #047857
    brandBrown: colors.brown[900], // #301118
    brandBrownMuted: colors.brown[500], // #75666a
    sidebar: colors.neutral.white,
    sidebarForeground: colors.brown[900],
    sidebarPrimary: colors.neutral.gray[100],
    sidebarPrimaryForeground: colors.brown[900],
    sidebarAccent: colors.neutral.gray[100],
    sidebarAccentForeground: colors.brown[900],
    sidebarBorder: colors.neutral.gray[200],
    sidebarRing: colors.brown[500],
    chart1: colors.saffron[700],
    chart2: colors.emerald[700],
    chart3: colors.brown[600],
    chart4: colors.brown[500],
    chart5: "#a18f94",
  },
  dark: {
    background: "#1c1014",
    foreground: colors.neutral.gray[50],
    card: "#301e24",
    cardForeground: colors.neutral.gray[50],
    popover: "#301e24",
    popoverForeground: colors.neutral.gray[50],
    primary: colors.saffron[500], // #ff6b00
    primaryForeground: "#1c1014",
    primaryHover: colors.saffron[400], // #fb923c
    secondary: "#301e24",
    secondaryForeground: colors.emerald[300], // #6ee7b7
    muted: "#301e24",
    mutedForeground: colors.brown[400], // #c0adb3
    accent: "#49343b",
    accentForeground: colors.neutral.gray[50],
    accentGold: colors.gold[300],
    destructive: colors.status.destructiveDark,
    destructiveForeground: colors.neutral.white,
    border: "#49343b",
    input: "#634b54",
    ring: colors.saffron[500],
    brandSaffron: colors.saffron[500],
    brandSaffronStrong: colors.saffron[400],
    brandEmerald: colors.emerald[300],
    brandBrown: colors.neutral.gray[50],
    brandBrownMuted: colors.brown[400],
    sidebar: "#1c1014",
    sidebarForeground: colors.neutral.gray[50],
    sidebarPrimary: "#49343b",
    sidebarPrimaryForeground: colors.neutral.gray[50],
    sidebarAccent: "#301e24",
    sidebarAccentForeground: colors.neutral.gray[50],
    sidebarBorder: "#49343b",
    sidebarRing: colors.brown[400],
    chart1: colors.saffron[500],
    chart2: colors.emerald[300],
    chart3: colors.neutral.gray[50],
    chart4: colors.brown[400],
    chart5: "#9c858e",
  },
};
