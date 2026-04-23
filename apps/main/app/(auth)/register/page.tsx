import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Register — Astrology Bharat",
  description: "Create your account and begin your cosmic journey.",
};

export default async function RegisterPage({
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
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ backgroundImage: "url('/images/white-background.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <SignUpForm callbackUrl={callbackUrl} />
    </div>
  );
}
