import type { Preview } from "@storybook/react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import "../../../apps/client/src/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [{ name: "light", value: "#ffffff" }],
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        NextIntlClientProvider,
        { locale: "en", messages: {} },
        React.createElement(Story, null),
      ),
  ],
  tags: ["autodocs"],
};

export default preview;
