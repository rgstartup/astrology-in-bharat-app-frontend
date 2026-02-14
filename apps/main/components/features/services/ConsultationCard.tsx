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
    <div className="services-card">
      <img src={item.image} alt={item.title} />
      <h4>{item.title}</h4>
    </div>
  );
};

export default ConsultationCard;
