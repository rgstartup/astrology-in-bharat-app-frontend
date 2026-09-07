import React from "react";
import RegisterPage from "@/features/auth/components/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Merchant Account | Astrology in Bharat",
  description: "Join the Astrology in Bharat Merchant network and grow your business.",
};

export default function Page() {
  return <RegisterPage />;
}
