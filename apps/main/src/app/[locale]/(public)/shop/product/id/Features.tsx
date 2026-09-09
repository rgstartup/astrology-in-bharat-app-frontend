"use client";

import React from "react";

const Features: React.FC = () => {
  const features = [
    {
      icon: "fa-solid fa-gem",
      title: "Authentic Crystals",
      text: "100% natural & certified products for spiritual growth.",
      color: "text-orange bg-orange/10",
    },
    {
      icon: "fa-solid fa-truck-fast",
      title: "Fast Delivery",
      text: "Safe and quick shipping across India within 3-5 days.",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: "fa-solid fa-headset",
      title: "Dedicated Support",
      text: "Our experts are always here to help you with your queries.",
      color: "text-emerald-500 bg-emerald-50",
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50 rounded-[3rem] border border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-12 uppercase tracking-widest">
          Why Choose Astrology in Bharat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div key={i} className="group p-10 bg-white rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-orange/10 flex flex-col items-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                <i className={item.icon}></i>
              </div>
              <h6 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-wider">
                {item.title}
              </h6>
              <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-[200px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
