"use client";

import React from "react";
import { UserDetailFormHeroProps } from "@/lib/types";

const UserDetailFormHero: React.FC<UserDetailFormHeroProps> = ({ expertName }) => {
  return (
    <section className="banner-part">
      <div className="overlay-hero py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Book Your <span className="text-[#daa23e]">Consultation</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              Share your details and schedule a session with {expertName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetailFormHero;
