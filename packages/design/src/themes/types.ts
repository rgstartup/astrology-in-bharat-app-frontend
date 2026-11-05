export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  primaryHover: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  accentGold: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  brandSaffron: string;
  brandSaffronStrong: string;
  brandEmerald: string;
  brandBrown: string;
  brandBrownMuted: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export type ThemeName = "bharat" | "vedic";

export interface DesignTheme {
  name: ThemeName;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
}
