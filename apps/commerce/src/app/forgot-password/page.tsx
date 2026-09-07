import React from "react";
import ForgotPasswordPage from "@/features/auth/components/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recover Account | Astrology in Bharat",
  description: "Recover your Astrology in Bharat Merchant account password safely.",
};

export default function Page() {
  return <ForgotPasswordPage />;
  
}
