import React from "react";
import ExpertList from "@/components/features/experts/ExpertList";
import ExpertServices from "@/components/features/services/AstrologyServices";
import ChooseYourZodiac from "@/components/layout/main/ChooseYourZodiac";
import AstrologyProduct from "@/components/features/shop/AstrologyProduct";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import Testimonial from "@/components/layout/main/Testimonial";
import CTA from "@/components/layout/main/CTA";
import HeroSection from "@/components/layout/main/HeroSection";
import ExpertConsultant from "@/components/layout/main/ExpertConsultant";
import ExpertListWrapper from "@/components/features/experts/ExpertListWrapper";
import PujaListSection from "@/components/features/puja/PujaListSection";
import StoreSection from "@/components/features/shop/StoreSection";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <HeroSection />
      <ExpertListWrapper searchParams={searchParams} />
      <ExpertServices />
      <PujaListSection />
      <ExpertConsultant />
      <ChooseYourZodiac />
      <StoreSection />
      <AstrologyProduct />
      <WhyChooseUs />
      <Testimonial />
      <CTA />
    </>
  );
}


