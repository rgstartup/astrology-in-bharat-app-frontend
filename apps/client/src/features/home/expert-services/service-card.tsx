import Image from "next/image";

interface ServiceCardProps {
  imageSrc: string;
  displayTitle: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  displayTitle,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow-sm border border-orange-200/80 text-center p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-400 h-full flex flex-col justify-between cursor-pointer">
      <div className="relative w-full h-[145px] sm:h-[155px] mb-3">
        <Image
          src={imageSrc}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="rounded-lg border border-[#daa23e]/50 object-cover"
        />
      </div>
      <h3 className="text-xs sm:text-sm md:text-base font-bold text-[#1e0b0f] truncate px-1 pb-1">
        {displayTitle}
      </h3>
    </div>
  );
};

export default ServiceCard;
