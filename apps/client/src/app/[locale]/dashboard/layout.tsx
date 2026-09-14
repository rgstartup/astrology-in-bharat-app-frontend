import { DashboardShell } from "@/features/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard | Astrology in Bharat",
  description:
    "Your personal astrology sanctuary: daily guidance, saved Kundli, active consultations, and astrological insights.",
};

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  return <DashboardShell>{children}</DashboardShell>;
}
