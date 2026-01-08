"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NextImage from "next/image";
const Image = NextImage as any;
import NextLink from "next/link";
const Link = NextLink as any;
import {
  FaHeart as FaH,
  FaBriefcase as FaB,
  FaLeaf as FaL,
  FaPlane as FaP,
  FaStar as FaS,
  FaCalendarAlt as FaC,
  FaClock as FaCl,
  FaMapMarkerAlt as FaM,
} from "react-icons/fa";
const FaHeart = FaH as any;
const FaBriefcase = FaB as any;
const FaLeaf = FaL as any;
const FaPlane = FaP as any;
const FaStar = FaS as any;
const FaCalendarAlt = FaC as any;
const FaClock = FaCl as any;
const FaMapMarkerAlt = FaM as any;

import { HiOutlineSparkles as HiOs } from "react-icons/hi";
const HiOutlineSparkles = HiOs as any;

import { ZodiacSignsData } from "@/components/features/services/zodiac";
import CTA from "@/components/layout/main/CTA";
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";

export default function ZodiacDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const signData = ZodiacSignsData.find(
    (s) => s.title.toLowerCase() === slug?.toLowerCase()
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/horoscope?sign=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (json.data && json.data.daily_predictions) {
          setHoroscope(json.data.daily_predictions[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const getIcon = (type: string) => {
    switch (type) {
      case "Health":
        return <FaLeaf className="text-green-500" />;
      case "Career":
        return <FaBriefcase className="text-blue-500" />;
      case "Love":
        return <FaHeart className="text-pink-500" />;
      default:
        return <FaPlane className="text-orange-500" />;
    }
  };

  const getPredictionCategory = (type: string) => {
    switch (type) {
      case "Health":
        return { label: "Health & Wellbeing", bg: "bg-green-50" };
      case "Career":
        return { label: "Career & Finance", bg: "bg-blue-50" };
      case "Love":
        return { label: "Love & Relations", bg: "bg-pink-50" };
      default:
        return { label: type + " Forecast", bg: "bg-orange-50" };
    }
  };

  if (!signData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf8]">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl border border-[#daa23e73]">
          <h2 className="text-2xl font-bold text-[#301118]">
            Zodiac Sign Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The destiny of this sign is still being written.
          </p>
          <Link href="/" className="mt-4 inline-block text-[#fd6410] font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
                        {signData.date} • Free Daily Prediction
                      </span>
                      <h1>
                        {signData.title}{" "}
                        <span className="text-[#fd6410]">Horoscope</span>
                      </h1>
                      <h4 className="card-title">
                        Daily Predictions & Cosmic Guidance
                      </h4>
                      <p>
                        Discover what the stars have in store for{" "}
                        {signData.title} today. Our expert astrologers analyze
                        planetary movements to provide accurate daily
                        predictions based on ancient Vedic Astrology principles.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> Personalized
                          Daily Forecasts
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Love, Career &
                          Health Insights
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Planetary
                          Transit Analysis
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Lucky Numbers &
                          Colors
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Expert Vedic
                          Guidance
                        </li>
                      </ul>
                      <Link
                        href="/our-astrologers"
                        className="btn-link wfc mt-4 mb-4"
                      >
                        Consult Astrologer Today
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="right-illus relative h-[400px]">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac Wheel"
                      fill
                      className="Astrologer-img-h fa-spin object-contain opacity-30"
                    />
                    <Image
                      src={signData.image}
                      alt={signData.title}
                      fill
                      className="Astrologer-img object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Predictions */}
      <section className="space-section light-back">
        <div className="container">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-[#fd6410] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl font-medium text-[#301118] animate-pulse">
                Consulting the heavens for {signData.title}...
              </p>
            </div>
          ) : error ? (
            <div className="py-20 text-center italic text-gray-400">
              <p>The stars are currently veiled. Please try again later.</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Detailed Predictions */}
              <div className="col-lg-8">
                <div className="light-card p-4 p-md-5 border border-[#fd64102b] shadow-xl rounded-4">
                  <div className="flex items-center gap-6 mb-4 pb-6 border-b border-gray-100">
                    <div className="bg-[#fd64101a] p-3 rounded-4">
                      <Image
                        src={signData.image}
                        alt={signData.title}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-contain drop-shadow-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-[#301118] uppercase tracking-tight mb-1">
                        {signData.title} Daily Horoscope
                      </h2>
                      <p className="text-[#fd6410] font-bold text-sm tracking-[0.2em] uppercase">
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Characteristics Grid */}
                  <div className="row g-4 mb-10">
                    {horoscope.predictions.map((p: any, idx: number) => {
                      const cat = getPredictionCategory(p.type);
                      return (
                        <div key={idx} className="col-md-6">
                          <div
                            className={`${cat.bg} p-6 rounded-4 border border-white h-100 flex gap-4`}
                          >
                            <div className="text-2xl mt-1">
                              {getIcon(p.type)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#301118] uppercase mb-1">
                                {cat.label}
                              </h4>
                              <p className="text-gray-800 text-xs leading-relaxed italic m-0">
                                {p.prediction}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Extra Details */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-4 relative overflow-hidden">
                      <HiOutlineSparkles className="absolute -right-4 -bottom-4 text-gray-200 text-9xl opacity-20" />
                      <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#fd6410] rounded-full"></div>
                        Cosmic Tip of the Day
                      </h3>
                      <p className="text-gray-500 italic relative z-10 leading-relaxed mb-0">
                        Patience will be your greatest ally today. The cosmic
                        energies favor thoughtful decisions. Wear colors that
                        resonate with your sign and meditate for 10 minutes to
                        align your energies with the universe. Stay positive and
                        trust your intuition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="col-lg-4">
                <div className="space-y-6">
                  <div className="bg-[#301118] text-white p-8 rounded-4 border border-[#fd64102b] shadow-xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                      <FaStar className="text-[#fd6410]" /> Cosmic Indicators
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <FaStar />,
                          label: "Lucky Number",
                          val: "7",
                        },
                        {
                          icon: (
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                          ),
                          label: "Lucky Color",
                          val: "Royal Blue",
                        },
                        {
                          icon: <FaCalendarAlt />,
                          label: "Lucky Day",
                          val: "Thursday",
                        },
                        {
                          icon: <FaClock />,
                          label: "Best Timing",
                          val: "2:00 PM - 4:00 PM",
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white/5 p-4 rounded-3 border border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-orange-400">{stat.icon}</span>
                            <span className="text-[10px] font-semibold uppercase text-gray-200">
                              {stat.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-orange-200">
                            {stat.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="light-card p-8 bg-orange-50 border border-orange-100 rounded-4">
                    <h4 className="text-[#301118] font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#fd6410]" /> Find Nearby
                      Temple
                    </h4>
                    <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                      Strengthen your planetary influences by visiting your
                      ruling deity. Discover sacred temples near you.
                    </p>
                    <div className="relative mb-4">
                      <input
                        type="text"
                        className="form-control rounded-3 py-3 ps-10 border shadow-sm bg-white"
                        placeholder="Enter your city..."
                      />
                    </div>
                    <button className="btn-link w-full text-xs bg-[#fd6410] text-white border-0 py-3 rounded-xl font-bold uppercase tracking-widest">
                      Search Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <CTA />

      {/* Internal Navigation for other Signs */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="title-line text-center mb-10">
            <span>Explore Other Zodiac Signs</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {ZodiacSignsData.map((sign) => (
              <Link
                key={sign.id}
                href={`/horoscope/${sign.title.toLowerCase()}`}
                className={`p-2 rounded-xl text-center border transition-all duration-300 no-underline ${
                  slug?.toLowerCase() === sign.title.toLowerCase()
                    ? "border-[#fd6410] bg-[#fd641008] shadow-md -translate-y-1"
                    : "border-transparent hover:border-[#fd641033] hover:bg-gray-50"
                }`}
              >
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <Image
                    src={sign.image}
                    alt={sign.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase ${slug?.toLowerCase() === sign.title.toLowerCase() ? "text-[#fd6410]" : "text-[#301118]"}`}
                >
                  {sign.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
