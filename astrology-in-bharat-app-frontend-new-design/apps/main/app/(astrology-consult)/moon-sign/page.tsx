"use client";

import React from "react";
import {
  FaMoon,
  FaHeart,
  FaBriefcase,
  FaUserFriends,
  FaHome,
  FaStar,
  FaPhoneAlt,
  FaComments,
  FaCheck,
  FaExclamation,
  FaChevronRight,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import WhyChooseUs from "@/components/main/WhyChooseUs";
import CTA from "@/components/main/CTA";
import { ZodiacSignsData } from "@/data/homePagaData";

const MoonSignPage = () => {
  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back">
        <div className="container">
          <div className="contant-hero rounded-4 border border-[#fd64102b] shadow-xl">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-12">
                <div className="hero-card">
                  <div className="card-z">
                    <span className="aib-trust-badge">
                      Emotional Intelligence
                    </span>
                    <h1>Moon Sign Details</h1>
                    <h4 className="card-title">
                      Discover Your True Inner Self
                    </h4>
                    <p>
                      In Vedic Astrology, your Moon Sign reveals your emotional
                      landscape, subconscious patterns, and deepest needs. It
                      governs your intuition, vulnerability, and instinctive
                      reactions to the world.
                    </p>
                    <div className="pt-3">
                      <button className="btn-link py-3 px-10 shadow-lg inline-flex w-auto uppercase tracking-widest text-[12px]">
                        Find My Moon Sign{" "}
                        <FaChevronRight className="ms-2" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 text-center">
                <div className="right-illus">
                  <img
                    src="/images/horoscope-round2.png"
                    alt="Zodiac"
                    className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_30s_linear_infinite] opacity-30"
                  />
                  <div className="relative z-10 p-5">
                    <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                      <FaMoon className="text-[#fd6410] text-7xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Select Moon Sign - Zodiac Grid */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] shadow-xl p-8">
            <h2 className="title-line mb-4 text-center">
              <span>Choose Your Moon Sign</span>
            </h2>
            <p className="text-center text-gray-500 italic mb-10">
              Select your sign to explore daily emotional forecast and lunar
              insights.
            </p>

            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4">
              {ZodiacSignsData.map((sign) => (
                <div key={sign.id} className="col">
                  <a href="#" className="block h-100 group">
                    <div className="bg-white border border-[#fd64101a] rounded-4 p-4 text-center h-100 transition-all hover:-translate-y-2 hover:shadow-xl hover:border-[#fd641054]">
                      <img
                        src={sign.image}
                        alt={sign.title}
                        className="w-16 h-16 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h3 className="text-sm font-bold text-[#301118] mb-1">
                        {sign.title}
                      </h3>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        {sign.date}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="space-section light-back">
        <div className="container">
          <div className="row g-5">
            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="space-y-6">
                <div className="light-card border border-[#fd64102b] p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-[#301118] mb-4 border-b border-[#fd64101a] pb-2">
                    Lunar Aspects
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: <FaHeart />, label: "Emotional Nature" },
                      { icon: <FaBriefcase />, label: "Career & Ambition" },
                      { icon: <FaUserFriends />, label: "Relationships" },
                      { icon: <FaHome />, label: "Family Life" },
                      { icon: <FaStar />, label: "Lucky Factors" },
                    ].map((aspect, i) => (
                      <button
                        key={i}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition ${i === 0 ? "bg-[#fd6410] text-white font-bold shadow-md" : "text-gray-600 hover:bg-[#fd64100d] hover:text-[#fd6410]"}`}
                      >
                        {aspect.icon} {aspect.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#301118] rounded-4 p-6 shadow-xl text-white relative overflow-hidden">
                  <HiOutlineSparkles className="absolute top-0 right-0 text-white/10 text-9xl -mr-10 -mt-10" />
                  <h3 className="text-xl font-bold mb-4 relative z-10">
                    Calculte Instantly
                  </h3>
                  <div className="space-y-3 relative z-10">
                    <input
                      type="text"
                      className="form-control bg-white/5 border-white/10 text-white placeholder:text-gray-400 text-sm py-3"
                      placeholder="DD/MM/YYYY"
                    />
                    <input
                      type="text"
                      className="form-control bg-white/5 border-white/10 text-white placeholder:text-gray-400 text-sm py-3"
                      placeholder="Birth Time"
                    />
                    <input
                      type="text"
                      className="form-control bg-white/5 border-white/10 text-white placeholder:text-gray-400 text-sm py-3"
                      placeholder="Birth City"
                    />
                    <button className="btn-link w-full py-3 mt-2 text-sm">
                      Calculate Rashi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-8">
              <div className="light-card border border-[#fd64102b] p-8 md:p-10 shadow-xl mb-6">
                <h2 className="text-3xl font-bold text-[#301118] mb-6 flex items-center">
                  <FaMoon className="text-[#fd6410] me-3" size={24} />{" "}
                  Significance of the Moon Sign
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    In Vedic Astrology, the Moon (Chandra) is considered the
                    most significant planet because it represents the mind
                    (Manas). While the Sun represents your ego and conscious
                    soul, the Moon governs your vulnerability, temperament, and
                    how you react to situations instinctively.
                  </p>
                  <p>
                    It determines your &quot;Rashi&quot; and plays a pivotal
                    role in Kundli matching, daily horoscope predictions, and
                    understanding your compatibility with others. A strong Moon
                    brings mental peace and emotional stability.
                  </p>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="light-card border border-green-100 bg-green-50/30 p-8 h-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-500 text-white p-2 rounded-lg shadow-md">
                        <FaCheck size={14} />
                      </div>
                      <h3 className="text-xl font-bold text-[#301118] mb-0">
                        Positive Traits
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Deep emotional empathy",
                        "Strong intuitive navigation",
                        "Nurturing protective nature",
                        "Vivid creative expression",
                      ].map((t, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>{" "}
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="light-card border border-red-100 bg-red-50/30 p-8 h-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-red-500 text-white p-2 rounded-lg shadow-md">
                        <FaExclamation size={14} />
                      </div>
                      <h3 className="text-xl font-bold text-[#301118] mb-0">
                        Internal Challenges
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Subconscious mood shifts",
                        "High sensitivity to environment",
                        "Emotional storage of past",
                        "Deep need for security",
                      ].map((t, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>{" "}
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="space-section bg-[#301118] text-white">
        <div className="container text-center">
          <HiOutlineSparkles className="text-[#fd6410] text-5xl mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Consult the Lunar Sages
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg italic">
            Connect with our certified astrologers for a detailed analysis of
            your Moon chart and receive personalized remedies for emotional
            well-being.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button className="btn-link py-4 px-12 inline-flex w-auto shadow-xl">
              <FaPhoneAlt className="me-2" /> Call Expert
            </button>
            <button className="btn-link py-4 px-12 inline-flex w-auto shadow-xl bg-white text-[#301118] !hover:bg-gray-100 border-0">
              <FaComments className="me-2" /> Instant Chat
            </button>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default MoonSignPage;
