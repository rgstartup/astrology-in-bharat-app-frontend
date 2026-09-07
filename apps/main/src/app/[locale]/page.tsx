import AstrologyProduct from "@/components/features/shop/AstrologyProduct";
import { ExpertSliderList } from "@/features/home/expert-list-wrapper";
import PujaListSection from "@/components/features/puja/PujaListSection";
import StoreSection from "@/components/features/shop/StoreSection";

import ChooseYourZodiac from "../../features/home/ChooseYourZodiac";
import WhyChooseUs from "../../features/home/WhyChooseUs";
import Testimonial from "../../features/home/testimonial";
import CTA from "../../features/home/CTA";
import HeroSection from "../../features/home/HeroSection";
import ExpertConsultant from "../../features/home/ExpertConsultant";
import ExpertServices from "../../features/home/expert-services";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <>
      <HeroSection />
      <ExpertSliderList searchParams={params} />
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
