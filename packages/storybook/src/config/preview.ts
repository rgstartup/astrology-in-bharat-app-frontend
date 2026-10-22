import type { Preview } from "@storybook/react";

/**
 * Builds the preview configuration shared by every Storybook instance.
 *
 * Provides the light, centered canvas used across the design system. Each
 * app's `configs/<app>/preview.ts` layers its own providers (for example the
 * `next-intl` client provider) and global stylesheet on top of this base.
 *
 * @returns A base Storybook {@link Preview} object.
 */
export function createStorybookPreview(): Preview {
  return {
    parameters: {
      layout: "centered",
      backgrounds: {
        default: "light",
        values: [{ name: "light", value: "#ffffff" }],
      },
    },
    tags: ["autodocs"],
  };
}
