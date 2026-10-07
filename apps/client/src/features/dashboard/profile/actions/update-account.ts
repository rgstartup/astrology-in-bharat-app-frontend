"use server";

import { api, API_ROUTES, AUTH_COOKIE_NAMES } from "@/actions";
import { getAccessToken } from "@/actions/cookie";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import type { Client } from "@repo/lib";
import { profileSchema, type ProfileFormValues } from "../schema/profile.schema";

export const updateCurrentUser = async (
  payload: ProfileFormValues | Partial<Client>,
) => {
  const token = await getAccessToken();
  const locale = await getLocale();
  if (!token) {
    redirect({ href: "/", locale });
  }

  // Validate payload with Zod before calling backend API
  const validation = profileSchema.safeParse(payload);
  if (!validation.success) {
    const message =
      validation.error.issues[0]?.message || "Invalid profile data";
    return [null, new Error(message)] as const;
  }

  return await api
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
      },
    })
    .patch<Client>(API_ROUTES.AUTH.ME, validation.data);
};
