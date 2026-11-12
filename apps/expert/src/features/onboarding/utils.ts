"use client";

import api from "@/api/api";
import { getOnboardingStatus } from "./api";
import type { OnboardingStatus } from "./types";

/** Backend wraps some payloads in `{ success, data }`, others return bare object. */
export function unwrap<T>(res: unknown): T {
  const maybe = res as { data?: T } | T;
  if (
    maybe &&
    typeof maybe === "object" &&
    "data" in maybe &&
    (maybe as { data?: unknown }).data !== undefined
  ) {
    return (maybe as { data: T }).data;
  }
  return maybe as T;
}

/** Post-login/register destination: first-run experts go to onboarding. */
export async function resolvePostAuthDestination(): Promise<string> {
  const result = await getOnboardingStatus();
  if (!result.ok || !result.data || result.data.onboarding_completed)
    return "/dashboard";
  return "/onboarding";
}
