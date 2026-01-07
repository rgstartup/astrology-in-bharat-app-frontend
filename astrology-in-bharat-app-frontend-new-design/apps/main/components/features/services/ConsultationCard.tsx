import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;

interface ConsultationCardProps {
  item: {
    id: number;
    image: string;
    title: string;
  };
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ item }) => {
  return (
    <div className="services-card cursor-pointer">
      <div className="relative w-full h-[180px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <h4>{item.title}</h4>
    </div>
  );
};

export default ConsultationCard;
