"use server";

import { api, API_ROUTES } from "@/actions";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { Client } from "@repo/lib";

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

export const fetchCurrentUser = async () => {
  const token = await getAuthToken();
  const locale = await getLocale();
  if (!token) {
    redirect({ href: "/", locale });
  }

  return await api
    .extend({
      headers: {
        Cookie: `accessToken=${token}`,
      },
    })
    .get<Client>(API_ROUTES.CLIENT.AUTH.ME);
};
