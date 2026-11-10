import React from "react";
import type { Metadata } from "next";
import {
  AuthFooter,
  RegisterForm,
  ExpertShowcaseCard,
} from "@/features/auth";

export const metadata: Metadata = {
  title: "Join as Expert | Astrology in Bharat",
  description: "Register as an expert on Astrology in Bharat platform",
};

/**
 * RegisterPage for Expert Portal.
 * Clean, modern 2-column layout with Amber theme and discrete OTP verification.
 * Fixed: form compactness; right column stretches to match left form height.
 */
export default function RegisterPage() {
  return (
    <section className="relative flex-1 flex flex-col justify-between w-full min-h-dvh lg:h-screen lg:max-h-screen bg-white font-sans py-2.5 sm:py-6 lg:py-8 overflow-y-auto lg:overflow-hidden">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 flex-1 flex flex-col justify-between">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 2xl:gap-28 items-stretch flex-1">
          {/* Left Column: Form & Brand */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col flex-1 w-full">
            {/* RegisterForm - takes full height */}
            <div className="w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-6 lg:mx-0 flex-1 py-2 sm:py-0">
              <RegisterForm />
            </div>

            {/* Bottom: AuthFooter */}
            <AuthFooter />
          </div>

          {/* Right Column: Showcase Card - stretches to match left column height */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 w-full justify-end items-stretch h-full">
            <ExpertShowcaseCard />
          </div>
        </div>
      </div>
    </section>
  );
}
