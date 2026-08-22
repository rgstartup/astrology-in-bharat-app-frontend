import { Metadata } from "next";
import Heading from "./hero";
import { SignInForm, TopExpertsSection } from "@/components/features/auth";
import { Suspense } from "react";
import HeroComponent from "./hero";

export const metadata: Metadata = {
  title: "Sign In - Astrology Bharat",
  description:
    "Sign in to your account and unlock personalized astrology insights.",
};

export default async function SignInPage() {
  return (
    <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat overflow-hidden">
      <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start justify-between">
          {/* Left Side: Branding and Astrology Info */}
          <div className="w-full lg:w-1/2 pt-0 md:pt-4">
            <HeroComponent />

            <TopExpertsSection />
          </div>

          {/* Right Side: Sign In Form */}
          <div className="w-full lg:w-1/2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange" />
                </div>
              }
            >
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
