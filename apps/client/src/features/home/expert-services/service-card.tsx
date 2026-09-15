import React from "react";
import Image from "next/image";
import { Clock, FileText, Video } from "lucide-react";

export interface ServiceCardProps {
  imageSrc?: string | null;
  displayTitle: string;
  description?: string | null;
  deliveryType?: string | null;
  durationMins?: number | null;
  icon?: string | null;
}

const formatDeliveryType = (type?: string | null) => {
  if (!type) return null;
  if (type === "REPORT_PDF") return "PDF Report";
  if (type === "LIVE_CONSULTATION") return "Live Consultation";
  return type.replace(/_/g, " ");
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  displayTitle,
  description,
  deliveryType,
  durationMins,
  icon,
}) => {
  const fallbackImg = "/images/ser1.jpg";
  const displayImage =
    imageSrc && imageSrc.trim() !== "" ? imageSrc : fallbackImg;
  const formattedDelivery = formatDeliveryType(deliveryType);

  return (
    <div className="group bg-white overflow-hidden shadow-sm border border-orange-200/80 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-400 h-full flex flex-col justify-between cursor-pointer relative p-3">
      {/* Badges / Duration */}
      <div className="relative w-full h-[145px] sm:h-[155px] mb-3 overflow-hidden rounded-xl bg-orange-50/50">
        <Image
          src={displayImage}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
          {formattedDelivery ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#FF5500] text-white shadow-sm">
              {deliveryType === "REPORT_PDF" ? (
                <FileText className="w-3 h-3" />
              ) : (
                <Video className="w-3 h-3" />
              )}
              {formattedDelivery}
            </span>
          ) : (
            <span />
          )}

          {durationMins && durationMins > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-black/60 backdrop-blur-xs text-white">
              <Clock className="w-3 h-3 text-orange-400" />
              {durationMins}m
            </span>
          ) : null}
        </div>

        {/* Icon Overlay if present */}
        {icon && (
          <div className="absolute bottom-2 left-2 z-10 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-orange-600 shadow-sm text-xs">
            <i className={icon}></i>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#1e0b0f] group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
            {displayTitle}
          </h3>
          {description && (
            <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-orange-600">
          <span>Explore Service</span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
