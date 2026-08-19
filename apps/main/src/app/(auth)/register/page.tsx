import { Metadata } from "next";
import RegisterPageClient from "@/components/features/auth/RegisterPageClient";

export const metadata: Metadata = {
  title: "Sign Up - Astrology Bharat",
  description: "Create your free account and start your cosmic journey today.",
};

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const sp = await searchParams;
  const isCompletingProfile = !!sp.token || !!sp.verification_token;
  
  if (token && !isCompletingProfile) {
    redirect("/client/profile");
  }

  return <RegisterPageClient />;
}
