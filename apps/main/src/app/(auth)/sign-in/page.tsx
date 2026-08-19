import { Metadata } from "next";
import SignInPageClient from "@/components/features/auth/SignInPageClient";

export const metadata: Metadata = {
  title: "Sign In - Astrology Bharat",
  description: "Sign in to your account and unlock personalized astrology insights.",
};

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (token) {
    redirect("/client/profile");
  }

  return <SignInPageClient />;
}
