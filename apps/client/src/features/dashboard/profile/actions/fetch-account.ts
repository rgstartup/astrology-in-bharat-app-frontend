"use server";

import { api, API_ROUTES, AUTH_COOKIE_NAMES } from "@/actions";
import { getAccessToken } from "@/actions/cookie";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { Client } from "@repo/lib";

export const fetchCurrentUser = async () => {
  const token = await getAccessToken();
  const locale = await getLocale();
  if (!token) {
    redirect({ href: "/", locale });
  }

  return await api
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
      },
    })
    .get<Client>(API_ROUTES.AUTH.ME);
};
