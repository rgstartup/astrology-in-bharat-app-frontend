import React from "react";
import Image from "next/image";

import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

interface ConsultationCardProps {
  item: {
    id: string;
    image: string;
    title: string;
  };
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ item }) => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const displayTitle = (t.consultant.items as any)[item.title] || item.title;

  return (
    <div className="mb-4 md:mb-5 text-center group cursor-pointer">
      <div className="w-[85%] mx-auto mb-2 md:mb-[10px] aspect-square rounded-full border-2 border-orange p-1 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={item.image}
          alt={displayTitle}
          width={200}
          height={200}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <h4 className="text-xs sm:text-sm md:text-base font-bold text-[#1e0b0f] transition-colors duration-300 group-hover:text-orange leading-tight px-1">
        {displayTitle}
      </h4>
    </div>
  );
};

export default ConsultationCard;


