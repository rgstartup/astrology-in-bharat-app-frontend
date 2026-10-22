import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "node:path";

/**
 * App identifiers this shared Storybook package can serve.
 *
 * Each app maps to a sibling directory under `frontend/apps/<app>` whose
 * `src` and `messages` folders drive the per-instance webpack aliases.
 */
export type StorybookApp = "client" | "expert";

/**
 * Options accepted by {@link createStorybookMain}.
 */
export interface CreateStorybookMainOptions {
  /** Which app's sources, aliases, and action mocks this instance should serve. */
  app: StorybookApp;
  /** Extra absolute glob patterns appended after the app's own story globs. */
  extraStories?: string[];
}

/** Absolute path to `frontend/packages/storybook`. */
const PACKAGE_DIR = path.resolve(__dirname, "..", "..");
/** Absolute path to the `frontend` workspace root. */
const FRONTEND_DIR = path.resolve(PACKAGE_DIR, "..", "..");
/** Absolute path to `frontend/apps`. */
const APPS_DIR = path.join(FRONTEND_DIR, "apps");
/** Absolute path to `frontend/packages`. */
const PACKAGES_DIR = path.join(FRONTEND_DIR, "packages");
/** Directories whose sources feed the shared Tailwind and Babel webpack rules. */
const WORKSPACE_DIRS = [APPS_DIR, PACKAGES_DIR];
/** Absolute path to the mock modules shared by every Storybook instance. */
const MOCKS_DIR = path.join(PACKAGE_DIR, "src", "mocks");

/**
 * Merges Storybook's existing alias map with additional string aliases.
 *
 * @param existing - Alias value as provided by Storybook's base webpack config (unknown shape).
 * @param extra - Additional alias entries applied on top of the existing ones.
 * @returns A flat alias record safe to assign back onto the webpack `resolve` config.
 */
function mergeAlias(existing: unknown, extra: Record<string, string>): Record<string, string> {
  const merged: Record<string, string> = {};
  if (typeof existing === "object" && existing !== null && !Array.isArray(existing)) {
    for (const [key, value] of Object.entries(existing)) {
      if (typeof value === "string") merged[key] = value;
    }
  }
  return { ...merged, ...extra };
}

/**
 * Builds the framework-neutral alias set shared by the client and expert
 * Storybook instances.
 *
 * `@` and `@messages` are scoped to the served app so the two instances never
 * resolve each other's sources, while Next.js runtime modules (i18n, routing,
 * navigation) and app server actions are redirected to deterministic mocks.
 *
 * @param appSrc - Absolute path to the served app's `src` directory.
 * @param appMessages - Absolute path to the served app's `messages` directory.
 * @returns Alias entries for Storybook's webpack `resolve.alias`.
 */
function buildAliases(appSrc: string, appMessages: string): Record<string, string> {
  const navigationMock = path.join(MOCKS_DIR, "i18n-navigation.tsx");
  const routingMock = path.join(MOCKS_DIR, "next-intl-routing.ts");
  const intlMock = path.join(MOCKS_DIR, "next-intl.tsx");
  const nextNavigationMock = path.join(MOCKS_DIR, "next-navigation.tsx");
  const actionsMock = path.join(MOCKS_DIR, "actions.ts");

  return {
    "@": appSrc,
    "@messages": appMessages,
    "@/actions$": actionsMock,
    "@/actions/api$": actionsMock,
    "@/i18n/navigation$": navigationMock,
    "@/i18n/navigation": navigationMock,
    "next-intl/navigation$": navigationMock,
    "next-intl/navigation": navigationMock,
    "next-intl/routing$": routingMock,
    "next-intl/routing": routingMock,
    "next-intl$": intlMock,
    "next-intl": intlMock,
    "next/navigation$": nextNavigationMock,
    "next/navigation": nextNavigationMock,
  };
}

/**
 * Creates a Storybook configuration for a single frontend app.
 *
 * The returned config loads only the served app's stories (plus shared
 * `@repo/ui` stories), points the `@` alias at that app's `src`, wires the
 * shared Next.js / i18n / action mocks, and installs the Tailwind PostCSS and
 * Babel pipeline used for workspace sources.
 *
 * @param options - {@link CreateStorybookMainOptions}
 * @returns A Storybook configuration object ready to default-export from a `main.ts`.
 */
export function createStorybookMain({
  app,
  extraStories = [],
}: CreateStorybookMainOptions): StorybookConfig {
  const appDir = path.join(APPS_DIR, app);
  const appSrc = path.join(appDir, "src");
  const appMessages = path.join(appDir, "messages");
  const aliases = buildAliases(appSrc, appMessages);

  return {
    stories: [
      path.join(PACKAGES_DIR, "ui", "src", "**", "*.stories.@(ts|tsx)"),
      path.join(appSrc, "**", "*.stories.@(ts|tsx)"),
      ...extraStories,
    ],
    addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
    framework: {
      name: "@storybook/react-webpack5",
      options: {},
    },
    webpackFinal: (baseConfig) => {
      const resolve = baseConfig.resolve ?? {};
      resolve.alias = mergeAlias(resolve.alias, aliases);
      baseConfig.resolve = resolve;
      // Workspace stylesheets need the Tailwind PostCSS pipeline. Steer them
      // away from Storybook's implicit CSS loaders and into an explicit rule.
      for (const rule of baseConfig.module?.rules ?? []) {
        if (typeof rule !== "object" || rule === null || !("test" in rule)) continue;
        const cssRule = rule as { test?: unknown; exclude?: unknown };
        if (cssRule.test instanceof RegExp && cssRule.test.test("styles.css")) {
          const prev = cssRule.exclude;
          cssRule.exclude = Array.isArray(prev) ? [...prev, ...WORKSPACE_DIRS] : WORKSPACE_DIRS;
        }
      }
      baseConfig.module?.rules?.push({
        test: /\.css$/,
        include: WORKSPACE_DIRS,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1, url: false } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { config: path.join(PACKAGE_DIR, "postcss.config.mjs") },
            },
          },
        ],
      });
      // Stories and workspace sources live outside this package, past the
      // default TS include. Run them through babel explicitly.
      baseConfig.module?.rules?.push({
        test: /\.[jt]sx?$/,
        include: WORKSPACE_DIRS,
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
}
