import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductList from "@/components/ProductList";
import ZodiacSection from "@/components/ZodiacSection";
import TrustBadgesSection from "@/components/TrustBadgesSection";
import AstrologyServicesSection from "@/components/AstrologyServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="bg-theme-ivory min-h-screen">
      <HeroSection />
      <ProductList />
      <CategoriesSection />
      <WhyChooseUs />

      {/* Additional sections currently hidden to match precise design reference */}
      {/* <ZodiacSection />
      <TrustBadgesSection />
      <AstrologyServicesSection />
      <TestimonialsSection /> */}
    </div>
  );
}
