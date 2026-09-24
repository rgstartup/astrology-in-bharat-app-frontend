"use server";

import { api, API_ROUTES } from "@/actions";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import type { Client } from "@repo/lib";
import { profileSchema, type ProfileFormValues } from "../schema/profile.schema";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

export const updateCurrentUser = async (
  payload: ProfileFormValues | Partial<Client>,
) => {
  const token = await getAuthToken();
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
        Cookie: `accessToken=${token}`,
      },
    })
    .patch<Client>(API_ROUTES.CLIENT.AUTH.ME, validation.data);
};
