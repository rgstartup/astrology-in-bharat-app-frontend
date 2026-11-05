import React from "react";
import HeroSection from "@/features/home/components/hero-section.component";
import ExpertConsultant from "@/features/home/components/expert-consultant.component";
import ChooseYourZodiac from "@/features/home/components/choose-your-zodiac.component";
import WhyChooseUs from "@/features/home/components/why-choose-us.component";
import CTA from "@/features/home/components/cta.component";
import ClientLayout from "@/components/layout/ClientLayout";

export default function HomeLayout({
  children,
  experts,
  services,
  // pujas,
  // stores,
  // products,
  testimonials,
}: {
  children: React.ReactNode;
  experts: React.ReactNode;
  services: React.ReactNode;
  // pujas: React.ReactNode;
  // stores: React.ReactNode;
  // products: React.ReactNode;
  testimonials: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <HeroSection />
      {experts}
      {/* {services} */}
      {/* {pujas} */}
      {/* <ExpertConsultant /> */}
      <ChooseYourZodiac />
      {/* {stores} */}
      {/* {products} */}
      <WhyChooseUs />
      {testimonials}
      <CTA />
      {/* {children} */}
    </ClientLayout>
  );
}
