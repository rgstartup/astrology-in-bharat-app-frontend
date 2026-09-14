import React from "react";

import HeroComponent from "./hero.component";
import InputFormSection from "./input-form.component";
import DoshInfoSection from "./dosh-info.component";
import DoshTypesSection from "./dosh-types.component";
import ExpertConsultationSection from "./expert-consultation.component";

const KaalSarpDoshPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroComponent />

      {/* Form & Info Section */}
      <InputFormSection />

      {/* Details Section */}
      <DoshInfoSection />

      {/* Types Section */}
      <DoshTypesSection />

      {/* Experts Section */}
      <ExpertConsultationSection />
    </div>
  );
};

export default KaalSarpDoshPage;
