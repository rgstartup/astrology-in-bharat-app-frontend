import React from "react";
import HeroSection from "@/features/home/HeroSection";
import ExpertConsultant from "@/features/home/ExpertConsultant";
import ChooseYourZodiac from "@/features/home/ChooseYourZodiac";
import WhyChooseUs from "@/features/home/WhyChooseUs";
import CTA from "@/features/home/CTA";
import ClientLayout from "@/components/layout/ClientLayout";

export default function HomeLayout({
  children,
  experts,
  services,
  pujas,
  stores,
  products,
  testimonials,
}: {
  children: React.ReactNode;
  experts: React.ReactNode;
  services: React.ReactNode;
  pujas: React.ReactNode;
  stores: React.ReactNode;
  products: React.ReactNode;
  testimonials: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <HeroSection />
      {experts}
      {services}
      {pujas}
      <ExpertConsultant />
      <ChooseYourZodiac />
      {stores}
      {products}
      <WhyChooseUs />
      {testimonials}
      <CTA />
      {children}
    </ClientLayout>
  );
}
