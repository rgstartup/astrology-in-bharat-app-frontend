import React from "react";
import AstrologerList from "@/components/features/astrologers/AstrologerList";
import AstrologerServices from "@/components/features/services/AstrologyServices";
import ChooseYourZodiac from "@/components/layout/main/ChooseYourZodiac";
import AstrologyProduct from "@/components/features/shop/AstrologyProduct";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import Testimonial from "@/components/layout/main/Testimonial";
import CTA from "@/components/layout/main/CTA";
import HeroSection from "@/components/layout/main/HeroSection";
import AstrologerConsultant from "@/components/layout/main/AstrologerConsultant";
import AstrologerListWrapper from "@/components/features/astrologers/AstrologerListWrapper";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <HeroSection />
      <AstrologerListWrapper searchParams={searchParams} />
      <AstrologerServices />
      <AstrologerConsultant />
      <ChooseYourZodiac />
      <AstrologyProduct />
      <WhyChooseUs />
      <Testimonial />
      <CTA />
    </>
  );
}
