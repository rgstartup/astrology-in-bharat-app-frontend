import { Metadata } from "next";
import { ExpertSliderList } from "@/features/home/expert-list-wrapper";
import AboutRedesign from "./components/about-redesign";

export const metadata: Metadata = {
  title: "About Us | Astrology in Bharat",
  description:
    "Learn about Astrology in Bharat — India's trusted astrology platform offering accurate guidance through verified experts using authentic Indian astrology systems.",
};

export default async function AboutPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <AboutRedesign>
      <ExpertSliderList searchParams={searchParams} />
    </AboutRedesign>
  );
}
