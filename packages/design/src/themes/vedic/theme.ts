import { colors } from "./colors";
import type { DesignTheme } from "../types";

export const vedicTheme: DesignTheme = {
  name: "vedic",
  label: "Vedic Heritage",
  radius: "0.75rem",
  light: {
    background: colors.neutral.cream, // #FFF9F4
    foreground: colors.brown[900], // #301118
    card: colors.neutral.white,
    cardForeground: colors.brown[900],
    popover: colors.neutral.white,
    popoverForeground: colors.brown[900],
    primary: colors.saffron[500], // #FF6B00
    primaryForeground: colors.neutral.white,
    primaryHover: colors.saffron[600], // #EA580C
    secondary: colors.brown[700], // #4A1D1F
    secondaryForeground: colors.neutral.white,
    muted: colors.neutral.creamLight, // #FCF8F4
    mutedForeground: colors.brown[500],
    accent: colors.gold[300], // #F2E2B0
    accentForeground: colors.brown[900],
    accentGold: colors.gold[500], // #D4AF37
    destructive: colors.status.destructive,
    destructiveForeground: colors.neutral.white,
    border: colors.neutral.creamMuted, // #E8D5C0
    input: colors.neutral.creamMuted,
    ring: colors.saffron[500],
    brandSaffron: colors.saffron[500],
    brandSaffronStrong: colors.saffron[700],
    brandEmerald: colors.emerald[700],
    brandBrown: colors.brown[700],
    brandBrownMuted: colors.brown[500],
    sidebar: colors.neutral.creamLight,
    sidebarForeground: colors.brown[900],
    sidebarPrimary: colors.saffron[500],
    sidebarPrimaryForeground: colors.neutral.white,
    sidebarAccent: colors.neutral.creamMuted,
    sidebarAccentForeground: colors.brown[900],
    sidebarBorder: colors.neutral.creamMuted,
    sidebarRing: colors.saffron[500],
    chart1: colors.saffron[500],
    chart2: colors.gold[500],
    chart3: colors.brown[700],
    chart4: colors.emerald[700],
    chart5: colors.brown[500],
  },
  dark: {
    background: "#160b0d",
    foreground: colors.neutral.gray[50],
    card: "#241215",
    cardForeground: colors.neutral.gray[50],
    popover: "#241215",
    popoverForeground: colors.neutral.gray[50],
    primary: colors.saffron[500],
    primaryForeground: "#160b0d",
    primaryHover: colors.saffron[400],
    secondary: "#3d1a1e",
    secondaryForeground: colors.gold[300],
    muted: "#241215",
    mutedForeground: colors.brown[400],
    accent: "#3d1a1e",
    accentForeground: colors.neutral.gray[50],
    accentGold: colors.gold[400],
    destructive: colors.status.destructive,
    destructiveForeground: colors.neutral.white,
    border: "#4a242a",
    input: "#4a242a",
    ring: colors.saffron[500],
    brandSaffron: colors.saffron[400],
    brandSaffronStrong: colors.saffron[500],
    brandEmerald: colors.emerald[400],
    brandBrown: colors.brown[200],
    brandBrownMuted: colors.brown[400],
    sidebar: "#160b0d",
    sidebarForeground: colors.neutral.gray[50],
    sidebarPrimary: "#241215",
    sidebarPrimaryForeground: colors.neutral.gray[50],
    sidebarAccent: "#3d1a1e",
    sidebarAccentForeground: colors.neutral.gray[50],
    sidebarBorder: "#4a242a",
    sidebarRing: colors.saffron[400],
    chart1: colors.saffron[400],
    chart2: colors.gold[400],
    chart3: colors.brown[300],
    chart4: colors.emerald[400],
    chart5: "#c49a9e",
  },
};

export default vedicTheme;
