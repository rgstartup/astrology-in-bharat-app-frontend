import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { OnboardHero } from "@/features/onboard/components/OnboardHero";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Complete Your Profile - Astrology in Bharat",
  description: "Personalize your astrological journey and natal birth chart.",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // If user is not authenticated, redirect to login with callback
  if (!token) {
    redirect({
      href: withCallbackUrl(PATHS.LOGIN, PATHS.ONBOARDING.PROFILE),
      locale,
    });
  }

  return (
    <main className="min-h-screen flex items-start lg:items-center justify-center">
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Section: Welcome Message & Step Timeline (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-4 lg:sticky lg:top-8 flex-col justify-between py-2 lg:py-4 lg:pr-2 xl:pr-4">
            <OnboardHero />
          </div>

          {/* Right Section: Multi-Step Form Card */}
          <Card className="lg:col-span-8 bg-transparent sm:bg-white rounded-none sm:rounded-3xl p-0 sm:p-8 md:p-10 border-0 sm:border sm:border-border/80 shadow-none sm:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col">
            <CardContent className="p-0 flex flex-col flex-1">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
