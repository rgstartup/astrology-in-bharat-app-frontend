import type { Config } from "tailwindcss";
import { designPreset } from "@repo/design/tailwind";

const config: Config = {
  important: true,
  presets: [designPreset as unknown as Config],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/libs/**/*.{js,ts,jsx,tsx}",
    "../../packages/design/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [],
};

export default config;
