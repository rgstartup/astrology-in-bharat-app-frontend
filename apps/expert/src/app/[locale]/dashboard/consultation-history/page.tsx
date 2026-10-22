import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

/**
 * Legacy consultation history route redirecting to /dashboard/consultations.
 */
export default async function LegacyConsultationHistoryPage() {
  const locale = await getLocale();
  return redirect({ href: "/dashboard/consultations", locale });
}
