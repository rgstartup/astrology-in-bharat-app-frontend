import HeroSection from "./hero.component";
import SidebarSection from "./sidebar.component";
import NakshatraDetailSection from "./nakshatra-detail.component";

const NakshatraPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar - Nakshatra List */}
            <div className="lg:col-span-3">
              <SidebarSection />
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <NakshatraDetailSection />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NakshatraPage;
