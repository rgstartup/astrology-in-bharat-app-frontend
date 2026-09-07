import HeroSection from "./hero.component";
import ComingSoonSection from "./coming-soon.component";

const BuyProductsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Coming Soon Content */}
      <ComingSoonSection />
    </div>
  );
};

export default BuyProductsPage;
