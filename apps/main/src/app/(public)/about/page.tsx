export const dynamic = "force-dynamic";
import { Metadata } from "next";
import AboutRedesign from "./AboutRedesign";

export const metadata: Metadata = {
  title: "About Us | Astrology in Bharat",
  description:
    "Learn about Astrology in Bharat — India's trusted astrology platform offering accurate guidance through verified experts using authentic Indian astrology systems.",
};

import ExpertListWrapper from "@/components/features/experts/ExpertListWrapper";

export default async function AboutPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <AboutRedesign>
      <ExpertListWrapper searchParams={searchParams} />
    </AboutRedesign>
  );
}
