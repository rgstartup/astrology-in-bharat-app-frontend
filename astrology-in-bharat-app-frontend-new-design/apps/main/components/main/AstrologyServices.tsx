import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AstrologyServicesData } from "@/data/homePagaData";

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
                  <div className="col-lg-3 col-md-4 px-2 mb-4" key={service.id}>
                    <Link
                      href="/our-astrologers"
                      className="block h-full group"
                    >
                      <div className="bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-[0.5px] border-[#fd6410] text-center p-2 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] h-full flex flex-col">
                        <div className="flex-grow relative h-[150px]">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="rounded-[6px] border border-[#daa23ea1] object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-xs text-[#1e0b0f] truncate mt-2 px-1 transition-colors group-hover:text-[#fd6410]">
                          {service.title}
                        </h4>
                      </div>
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
            {[
              {
                id: 1,
                title: "Love Problem Solution",
                img: "images/services/services1.jpg",
              },
              {
                id: 2,
                title: "Marriage Problem",
                img: "images/services/services2.jpg",
              },
              {
                id: 3,
                title: "Divorce Problem Solution",
                img: "images/services/services3.jpg",
              },
              {
                id: 4,
                title: "Breakup Problem Solution",
                img: "images/services/services4.jpg",
              },
              {
                id: 5,
                title: "Get Your Ex Love Back",
                img: "images/services/services5.jpg",
              },
              {
                id: 6,
                title: "Family Problem Solution",
                img: "images/services/services6.jpg",
              },
              {
                id: 7,
                title: "Dispute Solution",
                img: "images/services/services8.jpg",
              },
              {
                id: 8,
                title: "Childless Couple Solution",
                img: "images/services/services9.jpg",
              },
            ].map((item) => (
              <div className="col-sm-3 col-6 mb-4" key={item.id}>
                <Link href="/our-astrologers" className="block group">
                  <div className="services-card">
                    <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                      <Image
                        src={`/${item.img}`}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-[#1e0b0f] group-hover:text-[#fd6410] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyServices;
