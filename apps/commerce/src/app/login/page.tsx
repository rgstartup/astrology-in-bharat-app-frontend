import React from "react";
import LoginPage from "@/features/auth/components/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Login | Astrology in Bharat",
  description: "Secure login for Astrology in Bharat Merchants.",
};

export default function Page() {
  return <LoginPage />;
}
