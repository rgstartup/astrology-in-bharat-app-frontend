import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "node:path";

const frontendDir = path.resolve(__dirname, "..", "..", "..");
const pkgDir = path.join(frontendDir, "packages", "storybook");
const clientDir = path.join(frontendDir, "apps", "client");
const clientSrc = path.join(clientDir, "src");
const workspaceDirs = [path.join(frontendDir, "apps"), path.join(frontendDir, "packages")];

function mergeAlias(
  existing: unknown,
  extra: Record<string, string>,
): Record<string, string> {
  const merged: Record<string, string> = {};
  if (typeof existing === "object" && existing !== null && !Array.isArray(existing)) {
    for (const [key, value] of Object.entries(existing)) {
      if (typeof value === "string") merged[key] = value;
    }
  }
  return { ...merged, ...extra };
}

const config: StorybookConfig = {
  stories: [
    "../../ui/src/**/*.stories.@(ts|tsx)",
    "../../../apps/client/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: (baseConfig) => {
    const resolve = baseConfig.resolve ?? {};
    resolve.alias = mergeAlias(resolve.alias, {
      "@": clientSrc,
      "@messages": path.join(clientDir, "messages"),
      "@/actions": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "client-actions.ts",
      ),
      "@/i18n/navigation$": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "i18n-navigation.tsx",
      ),
      "@/i18n/navigation": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "i18n-navigation.tsx",
      ),
      "next-intl/navigation$": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "i18n-navigation.tsx",
      ),
      "next-intl/navigation": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "i18n-navigation.tsx",
      ),
      "next-intl/routing$": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-intl-routing.ts",
      ),
      "next-intl/routing": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-intl-routing.ts",
      ),
      "next-intl$": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-intl.tsx",
      ),
      "next-intl": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-intl.tsx",
      ),
      "next/navigation$": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-navigation.tsx",
      ),
      "next/navigation": path.join(
        frontendDir,
        "packages",
        "storybook",
        "src",
        "mocks",
        "next-navigation.tsx",
      ),
    });
    baseConfig.resolve = resolve;
    // Workspace stylesheets need the Tailwind PostCSS pipeline. Steer them
    // away from Storybook's implicit CSS loaders and into an explicit rule.
    for (const rule of baseConfig.module?.rules ?? []) {
      if (typeof rule !== "object" || rule === null || !("test" in rule)) continue;
      const cssRule = rule as { test?: unknown; exclude?: unknown };
      if (cssRule.test instanceof RegExp && cssRule.test.test("styles.css")) {
        const prev = cssRule.exclude;
        cssRule.exclude = Array.isArray(prev) ? [...prev, ...workspaceDirs] : workspaceDirs;
      }
    }
    baseConfig.module?.rules?.push({
      test: /\.css$/,
      include: workspaceDirs,
      use: [
        "style-loader",
        { loader: "css-loader", options: { importLoaders: 1, url: false } },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: { config: path.join(pkgDir, "postcss.config.mjs") },
          },
        },
      ],
    });
    // Stories and workspace sources live outside this package, past the
    // default TS include. Run them through babel explicitly.
    baseConfig.module?.rules?.push({
      test: /\.[jt]sx?$/,
      include: workspaceDirs,
      exclude: [/node_modules/, /storybook-static/, /\.next/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      ],
    });
    return baseConfig;
  },
};

export default config;
