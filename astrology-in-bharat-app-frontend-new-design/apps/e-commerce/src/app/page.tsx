import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductList from "@/components/ProductList";
import TrustBadgesSection from "@/components/TrustBadgesSection";
import AstrologyServicesSection from "@/components/AstrologyServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductList />
      <TrustBadgesSection />
      <AstrologyServicesSection />
      <TestimonialsSection />
      <WhyChooseUs />
    </>
  );
}
