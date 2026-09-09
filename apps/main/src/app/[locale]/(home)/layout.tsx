import React from "react";
import HeroSection from "@/features/home/HeroSection";
import ExpertServices from "@/features/home/expert-services";
import ExpertConsultant from "@/features/home/ExpertConsultant";
import ChooseYourZodiac from "@/features/home/ChooseYourZodiac";
import WhyChooseUs from "@/features/home/WhyChooseUs";
import CTA from "@/features/home/CTA";

export default function HomeLayout({
  children,
  experts,
  pujas,
  stores,
  products,
  testimonials,
}: {
  children: React.ReactNode;
  experts: React.ReactNode;
  pujas: React.ReactNode;
  stores: React.ReactNode;
  products: React.ReactNode;
  testimonials: React.ReactNode;
}) {
  return (
    <>
      <HeroSection />
      {experts}
      <ExpertServices />
      {pujas}
      <ExpertConsultant />
      <ChooseYourZodiac />
      {stores}
      {products}
      <WhyChooseUs />
      {testimonials}
      <CTA />
      {children}
    </>
  );
}
