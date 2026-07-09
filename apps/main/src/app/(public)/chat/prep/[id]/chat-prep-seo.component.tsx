import React from "react";

export default function ChatPrepSeoContent() {
  return (
    <section className="bg-[#1A1A1A]/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange/10 mt-12 mb-8 relative z-20">
      
      <h2 className="text-2xl font-black text-[#32131b] mb-6 flex items-center gap-3 border-b-2 border-orange inline-flex pb-2">Prepare for Your Astrological Consultation
      </h2>
      
      <p className="text-gray-300 text-[15px] leading-relaxed mb-8 font-medium">
        You are just one step away from connecting with a verified Vedic expert. Before the session begins, it is highly recommended to sit in a quiet place, take a deep breath, and keep your questions ready. A focused mind helps the astrologer tap into your cosmic energies more efficiently, resulting in a highly accurate and transformative reading.
      </p>

      <div className="bg-blue-50/80 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
        <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">Why Exact Birth Details Matter
        </h3>
        <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
          Vedic Astrology relies on calculating the exact degree of the Ascendant (Lagna) at the time of your birth. Even a difference of 5 minutes can change your entire Navamsha (D9) chart, leading to completely different predictions about marriage and career. Please ensure the Date, Time, and Place of birth you provide are as accurate as possible.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-black text-[#32131b] mb-6">Key Topics You Can Discuss
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A]/60 border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Career & Business
            </h4>
            <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Ask about job changes, promotions, hidden talents, or the best time to start a new business venture based on your current Dasha.</p>
          </div>
          <div className="bg-[#1A1A1A]/60 border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Love & Marriage
            </h4>
            <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Discuss Kundali matching, overcoming Manglik dosha, resolving marital disputes, or knowing the timing of your marriage.</p>
          </div>
          <div className="bg-[#1A1A1A]/60 border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Wealth & Finance
            </h4>
            <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Find out about periods of financial abundance, property investments, and remedies to remove blockages to your prosperity.</p>
          </div>
          <div className="bg-[#1A1A1A]/60 border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Remedies & Pujas
            </h4>
            <p className="text-[14px] text-gray-400 font-medium leading-relaxed">Get personalized recommendations for Gemstones, Rudraksha, or specific Vedic Pujas to pacify malefic planets in your chart.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/80 border-l-4 border-amber-500 p-6 mb-10 rounded-r-xl">
        <h3 className="text-[17px] font-bold text-amber-900 mb-2 flex items-center gap-2">100% Secure & Confidential
        </h3>
        <p className="text-amber-900 text-[14.5px] leading-relaxed font-medium">
          Your privacy is our utmost priority. Whatever you discuss with the astrologer remains strictly between you and them. Your contact details (like your phone number) are masked and never shared with the expert.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-black text-[#32131b] mb-6">Frequently Asked Questions
        </h3>
        
        <div className="space-y-6">
          <div className="bg-[#1A1A1A]/60 p-5 rounded-2xl border border-orange/10">
            <h4 className="font-bold text-orange text-[16px] mb-2">What if I don't know my exact birth time?</h4>
            <p className="text-gray-400 font-medium text-[14.5px] leading-relaxed">
              If you only know an approximate time (e.g., between 2 PM and 4 PM), inform the astrologer as soon as the chat begins. Experienced Vedic astrologers can perform "Birth Time Rectification" by asking you about past life events to pinpoint the exact time.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A]/60 p-5 rounded-2xl border border-orange/10">
            <h4 className="font-bold text-orange text-[16px] mb-2">How is the consultation fee charged?</h4>
            <p className="text-gray-400 font-medium text-[14.5px] leading-relaxed">
              The fee is charged strictly on a per-minute basis from your wallet balance. Once your session starts, the timer begins. If your wallet balance runs low, you will get a warning to recharge without disconnecting the session.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
