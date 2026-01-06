"use client";

import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChartBar,
  FaPhoneAlt,
  FaChevronRight,
  FaExclamationTriangle,
  FaLeaf,
} from "react-icons/fa";
import {
  MdOutlineGavel,
  MdOutlinePsychology,
  MdOutlineWorshipLite,
} from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";

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
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex text-xs text-gray-500 gap-2">
          <span>Home</span> <span>/</span> <span>Free Services</span>{" "}
          <span>/</span>{" "}
          <span className="text-secondary dark:text-gray-300 font-semibold">
            Kaal Sarp Dosh Analysis
          </span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-white mb-4">
                Kaal Sarp Dosh{" "}
                <span className="text-primary font-serif">Analysis</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
                Unlock the secrets of your life by checking for Kaal Sarp Dosh.
                Enter your birth details below to get an accurate analysis and
                effective remedies to overcome life&apos;s hurdles.
              </p>
            </div>

            {/* Birth Details Form */}
            <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl p-6 md:p-8 border border-gray-50 dark:border-gray-800 relative">
              <div className="flex items-center gap-2 mb-8">
                <FaCalendarAlt className="text-primary" />
                <h2 className="text-lg font-bold text-secondary dark:text-white">
                  Enter Birth Details
                </h2>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                      />
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Gender
                    </label>
                    <div className="flex items-center gap-6 py-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          className="text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <span className="text-sm">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Female</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Date of Birth
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>Day</option>
                      </select>
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>Month</option>
                      </select>
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>Year</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Time of Birth
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>HH</option>
                      </select>
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>MM</option>
                      </select>
                      <select className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-3 text-sm outline-none">
                        <option>AM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Place of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter City, State, Country"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-3"
                >
                  <FaChartBar /> Analyze My Kundli
                </button>
              </form>
            </div>

            {/* Content Section: What is... */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-secondary dark:text-white font-display">
                What is Kaal Sarp Dosh?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Kaal Sarp Dosh is formed when all seven planets come between
                Rahu and Ketu in a horoscope. A person with this dosh may
                struggle and face obstacles in life despite hard work. However,
                this dosh is not always malefic and can also bring immense
                success if remedied correctly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <FaExclamationTriangle className="text-primary" />
                    <h3 className="font-bold text-secondary dark:text-white">
                      Common Symptoms
                    </h3>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-3">
                    <li className="flex gap-2">
                      <span>•</span> Frequent nightmares involving snakes.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Delay in marriage or marital discord.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Instability in career or business losses.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Health issues without clear diagnosis.
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <FaLeaf className="text-green-600" />
                    <h3 className="font-bold text-secondary dark:text-white">
                      Effective Remedies
                    </h3>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-3">
                    <li className="flex gap-2">
                      <span>•</span> Chant the Maha Mrityunjaya Mantra.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Perform Kaal Sarp Dosh Nivaran Puja.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Worship Lord Shiva regularly.
                    </li>
                    <li className="flex gap-2">
                      <span>•</span> Offer water to a Peepal tree on Saturdays.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 12 Types */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-secondary dark:text-white font-display">
                12 Types of Kaal Sarp Dosh
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sarpTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-white dark:bg-card-dark p-6 rounded-2xl text-center shadow-sm border border-gray-50 dark:border-gray-800"
                  >
                    <div className="text-primary font-bold text-lg mb-2">
                      {type.id}
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">
                      {type.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Consultation Card */}
            <div className="bg-[#3b1d1d] text-white p-8 rounded-2xl relative overflow-hidden text-center shadow-lg">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 font-display">
                  Confused about your Kundli?
                </h3>
                <p className="text-orange-100/70 text-sm mb-6 leading-relaxed">
                  Talk to our premium astrologers and get instant remedies for
                  Kaal Sarp Dosh.
                </p>
                <button className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-3 w-full">
                  <FaPhoneAlt /> Call Now @ ₹20/min
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Other Free Tools */}
            <div className="bg-white dark:bg-card-dark rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-secondary dark:text-white text-sm">
                  Other Free Tools
                </h3>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  {
                    name: "Mangal Dosha Check",
                    icon: <FaExclamationTriangle className="text-orange-400" />,
                  },
                  {
                    name: "Sade Sati Calculator",
                    icon: <FaChartBar className="text-orange-400" />,
                  },
                  {
                    name: "Gemstone Suggestion",
                    icon: <FaLeaf className="text-orange-400" />,
                  },
                  {
                    name: "Gun Milan",
                    icon: <FaChartBar className="text-orange-400" />,
                  },
                ].map((item, i) => (
                  <li key={i} className="group cursor-pointer">
                    <a className="px-6 py-4 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/10 group-hover:text-primary transition">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <FaChevronRight className="text-xs text-gray-300 group-hover:text-primary transition" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Consultations */}
            <div className="bg-white dark:bg-card-dark rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-secondary dark:text-white text-sm">
                  LIVE CONSULTATIONS
                </h3>
              </div>
              <div className="p-4 space-y-6">
                {[
                  {
                    name: "Priya from Mumbai",
                    action: "Consulted for",
                    target: "Marriage Issues",
                    time: "Just Now",
                    color: "text-green-500",
                  },
                  {
                    name: "Amit from Delhi",
                    action: "Checked",
                    target: "Career Growth",
                    time: "2m ago",
                    color: "text-gray-400",
                  },
                  {
                    name: "Sneha from Pune",
                    action: "Asked about",
                    target: "Kaal Sarp Dosh",
                    time: "5m ago",
                    color: "text-gray-400",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {item.name}
                        </span>
                        <span className={item.color}>{item.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {item.action}{" "}
                        <span className="text-primary font-semibold">
                          {item.target}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default KaalSarpDoshPage;
