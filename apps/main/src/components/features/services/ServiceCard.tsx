import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;

import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

interface ServiceCardProps {
  item: {
    id: string;
    image: string;
    title: string;
    description?: string;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item }) => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const displayTitle = (t.services.items as any)[item.title] || item.title;

  return (
    <div className="bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-[0.5px] border-primary text-center p-2 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] h-full flex flex-col cursor-pointer">
      <div className="grow relative h-[150px]">
        <Image
          src={item.image}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="rounded-[6px] border border-[#daa23ea1] object-cover mb-2"
        />
      </div>
      <h4 className="text-xs sm:text-sm md:text-base font-bold text-[#1e0b0f] truncate mt-2 px-1">
        {displayTitle}
      </h4>
    </div>
  );
};

export default ServiceCard;


