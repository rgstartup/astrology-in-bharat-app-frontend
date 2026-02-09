import React from 'react'
import { ConsultationServicesData } from "@/components/features/services/data";
import ConsultationCard from "@/components/features/services/ConsultationCard";
import NextLink from "next/link";
const Link = NextLink as any;
const  AstrologerConsultant = () => {
  return (
    <section className="bg-edeef1 space-section">
      <div className='container'>
        <div className="light-card">
          <h2 className="title-line mb-4 text-black">
            <span>Consult The Right Astrologer For You</span>
          </h2>
          <div className="row">
            {ConsultationServicesData.map((service) => (
              <div className="col-sm-3" key={service.id}>
                <Link
                  href={`/our-astrologers?specializations=${encodeURIComponent(service.title)}`}
                  className="block no-underline hover:text-inherit"
                >
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

export default AstrologerConsultant