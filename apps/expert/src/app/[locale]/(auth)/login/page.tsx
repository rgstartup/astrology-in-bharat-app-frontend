import React from "react";
import type { Metadata } from "next";
import { LoginView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Expert Login | Astrology in Bharat",
  description: "Astrology in Bharat - Expert Consultation Portal Login",
};

export default function LoginPage() {
  return <LoginView />;
}
