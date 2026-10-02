import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  return redirect({ href: "/login", locale });
}
