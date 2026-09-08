import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { OnboardContainer } from "@/features/onboard";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Complete Your Profile - Astrology Bharat",
  description: "Personalize your astrological journey and natal birth chart.",
};

export default async function OnboardPage() {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // If user is not authenticated, redirect to sign-in with callback
  if (!token) {
    redirect({
      href: "/sign-in?callbackUrl=/onboard",
      locale,
    });
  }

  return (
    <main className="min-h-screen bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat flex items-center justify-center">
      <OnboardContainer />
    </main>
  );
}
