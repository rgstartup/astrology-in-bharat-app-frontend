import ExpertServices from "@/components/features/services/AstrologyServices";
import ChooseYourZodiac from "@/features/home/ChooseYourZodiac";
import AstrologyProduct from "@/components/features/shop/AstrologyProduct";
import WhyChooseUs from "@/features/home/WhyChooseUs";
import Testimonial from "@/features/home/Testimonial";
import CTA from "@/features/home/CTA";
import HeroSection from "@/features/home/HeroSection";
import ExpertConsultant from "@/features/home/ExpertConsultant";
import ExpertListWrapper from "@/components/features/experts/ExpertListWrapper";
import PujaListSection from "@/components/features/puja/PujaListSection";
import StoreSection from "@/components/features/shop/StoreSection";

export default function Homepage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
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
