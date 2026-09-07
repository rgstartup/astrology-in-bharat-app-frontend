import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Astrology Bharat",
  description: "Create your free account and start your cosmic journey today.",
};

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HeroComponent from "./hero";
import { SignUpForm, TopExpertsSection } from "@/features/auth";
import { Suspense } from "react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const sp = await searchParams;
  const isCompletingProfile = !!sp.token || !!sp.verification_token;

  if (token && !isCompletingProfile) {
    redirect("/client/profile");
  }

  return (
    <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat overflow-hidden">
      <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-start justify-between">
          {/* Left */}
          <div className="w-full lg:w-1/2 pt-0 md:pt-4">
            <HeroComponent />
            <TopExpertsSection />
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange" />
                </div>
              }
            >
              <SignUpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
