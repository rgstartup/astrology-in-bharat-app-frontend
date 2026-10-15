/**
 * Minimal Next config for the shared Storybook instance.
 *
 * The app configs (e.g. `apps/client/next.config.ts`) wrap with the
 * next-intl plugin, which resolves `./src/i18n/request.ts` relative to the
 * process cwd and fails when Storybook runs from this package. Stories mock
 * routing at the component boundary, so no i18n plugin is needed here.
 */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
