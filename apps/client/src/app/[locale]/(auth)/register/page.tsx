import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { SignUpForm, ShowcaseCard } from "@/features/auth";
import BackButton from "@/components/ui/BackButton";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sign Up - Astrology Bharat",
  description: "Create your free account and start your cosmic journey today.",
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    const locale = await getLocale();
    redirect({ href: "/client/profile", locale });
  }

  return (
    <section className="relative flex-1 flex items-start lg:items-center justify-center pt-6 pb-8 sm:pt-8 sm:pb-10 lg:py-8 w-full min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Section: Back Button + Form */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-[460px] sm:max-w-[480px]">
              <div className="mb-7 sm:mb-8">
                <BackButton />
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange" />
                  </div>
                }
              >
                <SignUpForm />
              </Suspense>
            </div>
          </div>

          {/* Right Section: The showcase card */}
          <div className="hidden lg:flex w-full justify-end">
            <div className="w-full max-w-[500px] bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
              <ShowcaseCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
