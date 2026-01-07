import React from "react";
import { AstrologyServicesData } from "@/components/features/services/homePagaData";

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
                    <div className="bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-[0.5px] border-[#fd6410] text-center p-2 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] h-full flex flex-col">
                      <div className="flex-grow">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="rounded-[6px] border border-[#daa23ea1] w-full h-[150px] object-cover mb-2"
                        />
                      </div>
                      <h4 className="font-medium text-xs text-black truncate mt-2 px-1">
                        {service.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <br className="mobile-none" />

        <div className="light-card">
          <h2 className="title-line mb-4 text-black">
            <span>Consult The Right Astrologer For You</span>
          </h2>
          <div className="row">
            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services1.jpg"
                  alt="Love Problem Solution"
                />
                <h4>Love Problem Solution</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services2.jpg"
                  alt="Marriage Problem"
                />
                <h4>Marriage Problem</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services3.jpg"
                  alt="Divorce Problem Solution"
                />
                <h4>Divorce Problem Solution</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services4.jpg"
                  alt="Breakup Problem Solution"
                />
                <h4>Breakup Problem Solution</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services5.jpg"
                  alt="Get Your Ex Love Back"
                />
                <h4>Get Your Ex Love Back</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services6.jpg"
                  alt="Family Problem Solution"
                />
                <h4>Family Problem Solution</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services8.jpg"
                  alt="Dispute Solution"
                />
                <h4>Dispute Solution</h4>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="services-card">
                <img
                  src="images/services/services9.jpg"
                  alt="Childless Couple Solution"
                />
                <h4>Childless Couple Solution</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyServices;
