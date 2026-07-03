export const dynamic = "force-dynamic";
import { Metadata } from "next";
import AboutRedesign from "./AboutRedesign";

export const metadata: Metadata = {
  title: "About Us | Astrology in Bharat",
  description:
    "Learn about Astrology in Bharat — India's trusted astrology platform offering accurate guidance through verified experts using authentic Indian astrology systems.",
};

export default function AboutPage() {
  return <AboutRedesign />;
}
