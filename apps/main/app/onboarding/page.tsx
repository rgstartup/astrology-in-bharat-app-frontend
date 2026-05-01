import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Complete Your Profile — Astrology Bharat",
  description: "Set up your profile to personalise your cosmic journey.",
};

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("better-auth.session_token")?.value;

  if (!session) {
    redirect("/sign-in?callbackUrl=/onboarding");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
