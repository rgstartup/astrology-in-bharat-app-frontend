"use client";

import React from "react";
import Image from "next/image";
import { purpose } from "@/components/features/services/homePagaData";

const ShopByPurpose: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Shop By Purpose
          </h2>
          <div className="w-24 h-1.5 bg-orange rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {purpose.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-premium group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">
                <Image
                  src={item.image}
                  alt={item.title || "Shop by Purpose"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                {item.title && (
                  <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                    <p className="text-white font-black text-xs uppercase tracking-widest">{item.title}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByPurpose;
