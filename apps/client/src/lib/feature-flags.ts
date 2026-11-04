/**
 * Client feature flags driven by `NEXT_PUBLIC_*` environment variables.
 *
 * Every flag defaults to disabled when its variable is absent or not `"true"`,
 * so no environment (prod, preview, CI) accidentally opts into a feature.
 */

/**
 * Whether video consultation entry points are shown in the client app.
 *
 * @returns True only when `NEXT_PUBLIC_ENABLE_VIDEO_CONSULTATION === "true"`.
 */
export function isVideoConsultationEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_VIDEO_CONSULTATION === "true";
}
