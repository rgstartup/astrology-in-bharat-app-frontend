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
    <div className="relative min-h-dvh flex flex-col justify-between w-full bg-white font-sans overflow-y-auto">
      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-12 xl:gap-16">
            {/* Dynamic height */}
            <section className="min-w-0 flex flex-col w-full">
              <RegisterForm />
            </section>

            {/* Independent height */}
            <aside className="hidden lg:flex min-w-0 lg:sticky lg:top-8 w-full justify-end">
              <ExpertShowcaseCard />
            </aside>
          </div>
        </div>
      </main>

      {/* Full-width Footer */}
      <footer className="w-full border-t border-stone-200 bg-white shrink-0">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4">
          <AuthFooter className="w-full flex items-center justify-between text-xs text-stone-500" />
        </div>
      </footer>
    </div>
  );
}
