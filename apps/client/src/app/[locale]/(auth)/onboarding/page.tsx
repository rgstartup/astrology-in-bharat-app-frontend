import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { PATHS } from "@repo/routes";

export default async function OnboardingIndexPage() {
  const locale = await getLocale();
  redirect({
    href: PATHS.ONBOARDING.PROFILE,
    locale,
  });
}

