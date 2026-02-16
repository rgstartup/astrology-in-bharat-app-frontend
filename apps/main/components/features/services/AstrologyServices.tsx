import React from "react";
import { AstrologyServicesData, ConsultationServicesData } from "./data";
import ServiceCard from "./ServiceCard";
import ConsultationCard from "./ConsultationCard";
import NextLink from "next/link";
const Link = NextLink as any;

const AstrologyServices = () => {
  return (
    <section className="bg-edeef1 space-section">
      <div className="container">
        <div className="light-card mt-4">
          <h2 className="title-line mb-3 text-black">
            <span>Astrology Services </span>
          </h2>
          <div className="overflow-hidden">
            <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="row mx-0">
                {AstrologyServicesData.map((service) => (
                  <div className="col-lg-3 col-md-4 px-2 mb-4" key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="block h-full no-underline hover:text-inherit"
                    >
                      <ServiceCard item={service} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <br className="mobile-none" />

 
      </div>
    </section>
  );
};

export default AstrologyServices;


