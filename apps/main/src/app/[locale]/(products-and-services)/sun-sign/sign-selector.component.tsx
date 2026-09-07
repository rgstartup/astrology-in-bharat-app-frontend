import React from "react";
import Image from "next/image";
import { ZodiacSignsData } from "@/components/features/services/homePagaData";

interface SignSelectorProps {
  selectedSign: any;
  setSelectedSign: (sign: any) => void;
}

const SignSelector: React.FC<SignSelectorProps> = ({
  selectedSign,
  setSelectedSign,
}) => {
  return (
    <section className="bg-white/80 backdrop-blur-xl border-y border-gray-100 py-6 sticky top-[70px] z-40 shadow-premium">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide snap-x items-center px-4">
          {ZodiacSignsData.map((sign) => (
            <button
              key={sign.id}
              onClick={() => setSelectedSign(sign)}
              className={`snap-center shrink-0 flex flex-col items-center cursor-pointer transition-all duration-500 p-4 rounded-[2rem] border group ${
                selectedSign.id === sign.id
                  ? "border-yellow-500 bg-yellow-50 shadow-2xl scale-110"
                  : "border-transparent opacity-40 hover:opacity-100 hover:bg-gray-50"
              }`}
              style={{ minWidth: "120px" }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-500 ${selectedSign.id === sign.id ? "scale-110" : "group-hover:scale-110 animate-slow-float"}`}>
                <Image
                  src={sign.image}
                  alt={sign.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedSign.id === sign.id ? "text-yellow-700" : "text-gray-500"}`}>
                {sign.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignSelector;
