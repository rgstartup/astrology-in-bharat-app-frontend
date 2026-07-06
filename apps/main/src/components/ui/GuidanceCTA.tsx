import React from "react";
import Link from "next/link";
import Image from "next/image";

interface GuidanceCTAProps {
  subtitle?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonIcon?: string;
  className?: string;
}

const GuidanceCTA: React.FC<GuidanceCTAProps> = ({
  subtitle = "Personalized Guidance",
  title = "Need Personal Guidance?",
  description = "Connect with our verified experts and get answers to all your questions.",
  buttonText = "Talk to Astrologer",
  buttonLink = "/our-experts",
  buttonIcon = "fa-solid fa-comments",
  className = "",
}) => {
  return (
    <section className={`bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
      </div>
      <div className="relative z-10 w-full text-center md:text-left">
        {subtitle && (
          <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">{subtitle}</p>
        )}
        <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
          {title}
        </h3>
        <p className="text-white/60 text-sm mt-1 max-w-2xl">
          {description}
        </p>
      </div>
      <Link
        href={buttonLink}
        className="relative z-10 flex-shrink-0 bg-[#F26500] hover:bg-[#D95A00] text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm no-underline"
      >
        <i className={buttonIcon} /> {buttonText}
      </Link>
    </section>
  );
};

export default GuidanceCTA;
