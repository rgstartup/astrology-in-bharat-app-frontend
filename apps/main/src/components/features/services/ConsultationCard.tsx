import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type HomeMessages from "../../../../messages/en/home.json";

type ConsultationTitle = keyof typeof HomeMessages.consultant.items;

interface ConsultationCardProps {
  item: {
    id: string;
    image: string;
    title: ConsultationTitle;
  };
}

const ConsultationCard = async ({ item }: ConsultationCardProps) => {
  const t = await getTranslations("Home.consultant.items");
  const displayTitle = t(item.title);

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
