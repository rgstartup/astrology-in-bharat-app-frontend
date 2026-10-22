import "@/styles/index.css";
import type { Preview } from "@storybook/react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { createStorybookPreview } from "../../src/config/preview";
import messages from "@messages/en";

const preview: Preview = {
  ...createStorybookPreview(),
  decorators: [
    (Story) =>
      React.createElement(NextIntlClientProvider, {
        locale: "en",
        messages,
        children: React.createElement(Story, null),
      }),
  ],
};

export default preview;
