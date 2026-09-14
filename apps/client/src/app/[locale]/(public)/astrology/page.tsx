import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function Astrology() {
  const locale = await getLocale();
  return redirect({ href: "/astrology/horoscope", locale });
}
