"use client";

import React from "react";



interface Detail {
  title: string;
  text: string;
}

interface SpecificationsProps {
  details: Detail[];
}

const Specifications: React.FC<SpecificationsProps> = ({ details }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Product Specifications
          </h2>
          <div className="w-24 h-1.5 bg-orange rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {details.map((detail, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-premium hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-white transition-all">
                <i className="fa-solid fa-circle-info text-xl"></i>
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-2">
                {detail.title}
              </h4>
              <p className="text-gray-500 font-bold text-sm leading-relaxed">
                {detail.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specifications;
