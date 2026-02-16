import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import {
  FaUser as FaU,
  FaCalendarAlt as FaCa,
  FaMapMarkerAlt as FaMma,
  FaPhoneAlt as FaPa,
  FaChevronRight as FaCr,
  FaExclamationTriangle as FaEt,
  FaLeaf as FaL,
  FaComments as FaCom,
} from "react-icons/fa";
const FaUser = FaU as any;
const FaCalendarAlt = FaCa as any;
const FaMapMarkerAlt = FaMma as any;
const FaPhoneAlt = FaPa as any;
const FaChevronRight = FaCr as any;
const FaExclamationTriangle = FaEt as any;
const FaLeaf = FaL as any;
const FaComments = FaCom as any;

import { GiSnake as GiSn } from "react-icons/gi";
const GiSnake = GiSn as any;

import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";

const KaalSarpDoshPage = () => {
  const sarpTypes = [
    { id: 1, name: "Anant" },
    { id: 2, name: "Kulik" },
    { id: 3, name: "Vasuki" },
    { id: 4, name: "Shankhpal" },
    { id: 5, name: "Padam" },
    { id: 6, name: "Mahapadham" },
    { id: 7, name: "Takshak" },
    { id: 8, name: "Karkotak" },
    { id: 9, name: "Shankachood" },
    { id: 10, name: "Ghatak" },
    { id: 11, name: "Vishdhar" },
    { id: 12, name: "Sheshnag" },
  ];

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back">
        <div className="overlay-hero">
          <div className="container">
            <div className="contant-hero">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card shine">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        Vedic Astrology Analysis
                      </span>
                      <h1>Kaal Sarp Dosh</h1>
                      <h4 className="card-title">
                        Unlock Secrets & Overcome Hurdles
                      </h4>
                      <p>
                        Ketu. An accurate analysis and effective Vedic remedies
                        can help you navigate life&apos;s obstacles and achieve
                        immense success.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Analyze
                          Rahu-Ketu Position
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Identify 12 Dosh
                          Types
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Life Impact
                          Report
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Powerful
                          Remedies
                        </li>
                      </ul>
                      <button className="btn-link wfc mt-4 mb-4">
                        Check Compatibility Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12 text-center">
                  <div className="right-illus">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac"
                      width={500}
                      height={500}
                      className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_30s_linear_infinite] opacity-30"
                    />
                    <div className="relative z-10 p-5">
                      <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                        <GiSnake className="text-[#fd6410] text-7xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            {/* Form Area */}
            <div className="col-lg-7">
              <div className="light-card border border-[#fd64102b] p-8 md:p-10 shadow-2xl h-100">
                <div className="flex items-center gap-4 mb-8 border-b border-[#fd64101a] pb-4">
                  <div className="bg-[#fd6410] text-white p-3 rounded-3 shadow-lg">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#301118] mb-0">
                      Enter Birth Details
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Free Personal Analysis
                    </p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Gender
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm bg-gray-50 text-sm">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Birth Time
                      </label>
                      <input
                        type="time"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                        Am/Pm
                      </label>
                      <select className="form-select rounded-3 py-3 border-0 shadow-sm bg-gray-50 text-sm">
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Birth Place
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-300" />
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 border-0 shadow-sm bg-gray-50 ps-10"
                        placeholder="Enter city name"
                      />
                    </div>
                  </div>
                  <button className="btn-link py-4 mt-6 uppercase tracking-widest text-[12px] font-bold">
                    Analyze Dosh Now{" "}
                    <FaChevronRight className="ms-2" size={10} />
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="col-lg-5">
              <div className="space-y-6">
                <div className="bg-[#301118] text-white p-8 rounded-4 relative overflow-hidden shadow-xl border border-[#fd64102b] h-100 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4 font-display">
                    Confused about your Kundli?
                  </h3>
                  <p className="text-orange-100/70 text-sm mb-6 leading-relaxed italic">
                    Talk to our premium astrologers and get instant remedies for
                    Kaal Sarp Dosh. Understand the placement of Rahu and Ketu in
                    your chart.
                  </p>
                  <button className="btn-link bg-[#fd6410] text-white py-3 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-3 w-full border-0 font-bold uppercase tracking-widest text-xs">
                    <FaPhoneAlt /> Call Now @ ₹20/min
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-12">
              <h2 className="title-line mb-8">
                <span>What is Kaal Sarp Dosh?</span>
              </h2>
              <div className="light-card border border-[#fd64102b] p-8 shadow-xl">
                <p className="text-gray-600 leading-relaxed italic mb-6">
                  Kaal Sarp Dosh is formed when all seven planets come between
                  Rahu and Ketu in a horoscope. A person with this dosh may
                  struggle and face obstacles in life despite hard work.
                  However, this dosh is not always malefic and can also bring
                  immense success if remedied correctly.
                </p>

                <div className="row g-4 mt-4">
                  <div className="col-md-6">
                    <div className="bg-red-50 p-6 rounded-4 border border-red-100 h-100">
                      <h4 className="text-[#301118] font-bold mb-4 flex items-center gap-3">
                        <FaExclamationTriangle className="text-red-500" />{" "}
                        Common Symptoms
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Frequent nightmares involving snakes.",
                          "Delay in marriage or marital discord.",
                          "Instability in career or business losses.",
                          "Health issues without clear diagnosis.",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-500 flex items-start gap-2 italic"
                          >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></div>{" "}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-green-50 p-6 rounded-4 border border-green-100 h-100">
                      <h4 className="text-[#301118] font-bold mb-4 flex items-center gap-3">
                        <FaLeaf className="text-green-500" /> Effective Remedies
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Chant the Maha Mrityunjaya Mantra.",
                          "Perform Kaal Sarp Dosh Nivaran Puja.",
                          "Worship Lord Shiva regularly.",
                          "Offer water to a Peepal tree on Saturdays.",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-500 flex items-start gap-2 italic"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>{" "}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            12 Types of Kaal Sarp Dosh
          </h2>
          <div className="row g-4">
            {sarpTypes.map((type) => (
              <div key={type.id} className="col-lg-3 col-md-6">
                <div className="bg-white p-6 rounded-4 text-center group hover:-translate-y-2 transition-transform h-100 shadow-xl">
                  <div className="w-12 h-12 bg-[#fd6410] rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform text-white font-bold">
                    {type.id}
                  </div>
                  <h4 className="text-[#301118] font-bold text-sm mb-1 uppercase tracking-widest">
                    {type.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Vedic Classification
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="space-section light-back">
        <div className="container">
          <h2 className="title-line mb-12 text-center">
            <span>Talk to Dosh Nivaran Experts</span>
          </h2>
          <div className="row g-4">
            {[
              {
                name: "Acharya Sanjay",
                exp: "18 Years",
                spec: "Vedic | Rahu-Ketu",
              },
              { name: "Dr. Anjali", exp: "12 Years", spec: "Lal Kitab | Dosh" },
              { name: "Pandit Dixit", exp: "22 Years", spec: "Rituals | Puja" },
              { name: "Meera Ji", exp: "14 Years", spec: "Remedial Expert" },
            ].map((ast, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="light-card border border-[#fd64102b] p-6 text-center group hover:shadow-2xl transition-all">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#fd641054] group-hover:scale-105 transition-transform">
                    <FaUser className="text-[#fd6410] text-4xl" />
                  </div>
                  <h4 className="text-[#301118] font-bold mb-1">{ast.name}</h4>
                  <p className="text-[#fd6410] text-[10px] font-bold uppercase tracking-widest">
                    {ast.spec}
                  </p>
                  <p className="text-gray-400 text-[11px] mb-3">
                    Exp: {ast.exp}
                  </p>
                  <div className="flex gap-2">
                    <button className="btn-link flex-1 py-2 text-[10px] uppercase shadow-sm">
                      <FaComments className="inline me-1" /> Chat
                    </button>
                    <button className="btn-link flex-1 py-2 text-[10px] uppercase bg-white text-[#301118] border-0 shadow-sm">
                      <FaPhoneAlt className="inline me-1" /> Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="btn-link px-12 py-3 inline-flex w-auto border-0 bg-transparent text-[#fd6410] hover:text-[#301118] font-bold uppercase tracking-widest text-[12px] no-underline">
              View All Experts <FaChevronRight className="ms-2" size={10} />
            </button>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default KaalSarpDoshPage;


