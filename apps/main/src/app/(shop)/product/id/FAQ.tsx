"use client";

import React, { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Common Questions
          </h2>
          <div className="w-24 h-1.5 bg-orange rounded-full mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className={`group rounded-[2rem] border-2 transition-all duration-300 ${
                openFaq === i 
                  ? "border-orange/20 bg-orange/5 shadow-premium" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${
                    openFaq === i ? "bg-orange text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-lg font-black transition-colors ${
                    openFaq === i ? "text-gray-900" : "text-gray-600"
                  }`}>
                    {f.q}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  openFaq === i ? "bg-orange/10 text-orange rotate-180" : "bg-gray-50 text-gray-300"
                }`}>
                  <i className="fa-solid fa-chevron-down text-sm" />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8 ml-12">
                  <div className="h-px w-full bg-gray-100 mb-6 mx-auto"></div>
                  <p className="text-gray-500 font-bold leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
