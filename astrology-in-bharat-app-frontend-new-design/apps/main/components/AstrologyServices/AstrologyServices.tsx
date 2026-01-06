import React, { useState } from 'react';
import {
  AstrologyServicesData,
  ConsultationServicesData,
} from "./data";
import ServiceCard from './ServiceCard';
import ConsultationCard from './ConsultationCard';
import Link from 'next/link';

const AstrologyServices = () => {
  return (
    <section className="bg-edeef1 space-section">
      <div className="container">
        <div className="light-card mt-4">
          <h2 className="title-line mb-3 c-1e0b0f">
            <span>Astrology Services </span>
          </h2>
          <div className="overflow-hidden">
            <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="row mx-0">
                {AstrologyServicesData.map((service) => (
                  <div
                    className="col-lg-3 col-md-4 px-2 mb-4"
                    key={service.id}
                  >
                    <Link href={`/services/${service.slug}`} className="block h-full no-underline hover:text-inherit">
                      <ServiceCard item={service} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <br className="mobile-none" />

        <div className="light-card">
          <h2 className="title-line mb-4 c-1e0b0f">
            <span>Consult The Right Astrologer For You</span>
          </h2>
          <div className="row">
            {ConsultationServicesData.map((service) => (
              <div className="col-sm-3" key={service.id}>
                <Link href={`/services/${service.slug}`} className="block no-underline hover:text-inherit">
                  <ConsultationCard item={service} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AstrologyServices;