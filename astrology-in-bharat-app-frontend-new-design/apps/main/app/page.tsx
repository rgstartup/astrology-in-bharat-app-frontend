import React from "react";
import AstrologerList from "@/components/features/astrologers/AstrologerList";
import AstrologerServices from "@/components/features/services/AstrologyServices";
import ChooseYourZodiac from "@/components/layout/main/ChooseYourZodiac";
import AstrologyProduct from "@/components/features/shop/AstrologyProduct";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import Testimonial from "@/components/layout/main/Testimonial";
import CTA from "@/components/layout/main/CTA";
import HeroSection from "@/components/layout/main/HeroSection";
import { getExperts } from "@/libs/api-experts";

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

  return (
    <>
      <HeroSection />
      <AstrologerList
        initialExperts={experts}
        initialPagination={pagination}
        initialError={response.error}
      />
      <AstrologerServices />
      <ChooseYourZodiac />
      <AstrologyProduct />
      <WhyChooseUs />
      <Testimonial />
      <CTA />
    </>
  );
}
