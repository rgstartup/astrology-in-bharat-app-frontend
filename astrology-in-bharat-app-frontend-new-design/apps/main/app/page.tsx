import React from "react";
import AstrologerList from "@/components/main/AstrologerList";
import AstrologerServices from "@/components/AstrologyServices/AstrologyServices";
import ChooseYourZodiac from "@/components/main/ChooseYourZodiac";
import AstrologyProduct from "@/components/main/AstrologyProduct";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import Testimonial from "@/components/main/Testimonial";
import CTA from "@/components/main/CTA";
import HeroSection from "@/components/main/HeroSection";
import { getExperts } from "@/libs/api-experts";
// import { toast } from 'react-hot-toast'; // Cannot use toast in Server Component directly

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // Fetch experts on the server
  const response = await getExperts({
    limit: 20,
    offset: 0,
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    specializations:
      typeof searchParams.specializations === "string"
        ? searchParams.specializations
        : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
    languages:
      typeof searchParams.languages === "string"
        ? searchParams.languages
        : undefined,
    minPrice: Number(searchParams.minPrice) || undefined,
    maxPrice: Number(searchParams.maxPrice) || undefined,
    state:
      typeof searchParams.state === "string" ? searchParams.state : undefined,
  });

  const experts = response.data;
  const pagination = response.pagination;

  // We can pass an error flag to client if needed
  // if (!response.success) { ... }

  return (
    <>
      {/* Hero Section  */}
      <HeroSection />

      {/* Astrologer list  */}
      <AstrologerList
        initialExperts={experts}
        initialPagination={pagination}
        initialError={response.error}
      />

      {/* Astrology Services  */}
      <AstrologerServices />

      {/* choose your zodiac section  */}
      <ChooseYourZodiac />

      {/* Astrology Product  */}
      <AstrologyProduct />

      {/* Why Choose us Section  */}
      <WhyChooseUs />

      {/* Testimonials  */}
      <Testimonial />

      {/* CTA Section */}
      <CTA />
    </>
  );
}
