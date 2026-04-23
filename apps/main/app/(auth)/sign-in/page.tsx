import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignInForm from "./SignInForm";
import TopExpertsSection from "@/components/features/auth/TopExpertsSection";
import authContent from "@/public/data/auth-content.json";

export const metadata: Metadata = {
  title: "Sign In — Astrology Bharat",
  description: "Sign in to your account and unlock personalized astrology insights.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("better-auth.session_token")?.value;
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl || "/profile");
  }

  return (
    <section className="relative py-2 md:py-4 bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-no-repeat overflow-hidden min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-5/12 pt-8">
            <div className="mb-8">
              <h3 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                <span className="text-[#301118]">{authContent.signIn.title}</span>
              </h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {authContent.signIn.description1}
                <br />
                {authContent.signIn.description2}
              </p>
            </div>
            <TopExpertsSection />
          </div>

          <div className="w-full lg:w-7/12">
            <Suspense fallback={
              <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
              </div>
            }>
              <SignInForm callbackUrl={callbackUrl} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
