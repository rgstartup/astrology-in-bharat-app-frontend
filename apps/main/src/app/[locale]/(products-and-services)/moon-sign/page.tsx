import React from "react";
import Image from "next/image";
import { HiOutlineSparkles } from "react-icons/hi";
import HeroSection from "./hero.component";
import SignGridSection from "./sign-grid.component";
import LunarInfoSection from "./lunar-info.component";

const MoonSignPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Select Moon Sign - Zodiac Grid */}
      <SignGridSection />

      {/* Info Section */}
      <LunarInfoSection />
    </div>
  );
};

export default MoonSignPage;
