import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;

interface ServiceCardProps {
  item: {
    id: number;
    image: string;
    title: string;
    description?: string;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item }) => {
  return (
    <div className="bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-[0.5px] border-[#fd6410] text-center p-2 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] h-full flex flex-col cursor-pointer">
      <div className="grow relative h-[150px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="rounded-[6px] border border-[#daa23ea1] object-cover mb-2"
        />
      </div>
      <h4 className="font-medium text-xs text-[#1e0b0f] truncate mt-2 px-1">
        {item.title}
      </h4>
    </div>
  );
};

export default ServiceCard;
