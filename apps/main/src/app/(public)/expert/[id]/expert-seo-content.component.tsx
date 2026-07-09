import React from "react";

export default function ExpertSeoContent({ expertName }: { expertName: string }) {
  return (
    <section className="bg-[#edeef1] py-10 md:py-16 mt-8">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">Seeking Guidance from {expertName}
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
            Consulting a verified Vedic expert like <strong>{expertName}</strong> can provide profound clarity during life's most confusing phases. Whether you are facing unexplained delays in marriage, sudden career hurdles, or ongoing health issues, a deep analysis of your Kundali (birth chart) can reveal the hidden planetary transits causing these blockages. Our experts specialize in decoding the intricate cosmic patterns that shape your destiny.
          </p>

          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            By aligning your actions with favorable planetary periods (Dashas) and performing targeted remedies, you can significantly mitigate life's challenges. Expert astrologers not only predict future events but also empower you with actionable advice to manifest prosperity, love, and peace of mind.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">Preparing for Your Session
            </h3>
            <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
              To get the most accurate predictions, please ensure you have your exact Date of Birth, Time of Birth, and Place of Birth ready. If you don't know your exact time of birth, let the astrologer know at the beginning of the session so they can perform Birth Time Rectification (Prashna Kundali). Keep a pen and paper handy to note down specific remedies, lucky dates, or mantras!
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block pb-1">Top Questions You Can Ask
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Love & Relationships
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"When will I get married?"</li>
                  <li>"Is my current partner my soulmate?"</li>
                  <li>"How can I overcome Manglik Dosha?"</li>
                  <li>"Will my ex come back into my life?"</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Career & Business
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"When is the best time to switch jobs?"</li>
                  <li>"Will a business partnership be lucky?"</li>
                  <li>"Why am I facing delays in promotion?"</li>
                  <li>"Should I pursue higher studies abroad?"</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Wealth & Finance
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"What are the yogas for wealth in my Kundali?"</li>
                  <li>"When will I be able to buy my own house?"</li>
                  <li>"How can I clear my debts faster?"</li>
                  <li>"Is stock market investment safe for me?"</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Health & Well-being
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"Why am I facing continuous health issues?"</li>
                  <li>"When will I get relief from mental stress?"</li>
                  <li>"Are there any bad planetary periods coming up?"</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Remedies & Solutions
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"Which gemstone is best suited for my Lagna?"</li>
                  <li>"What daily mantras should I chant for peace?"</li>
                  <li>"Which Rudraksha should I wear for success?"</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">Puja & Rituals
                </h4>
                <ul className="list-disc pl-5 text-[14px] text-gray-700 font-medium space-y-1">
                  <li>"Do I have Kaal Sarp Dosha in my chart?"</li>
                  <li>"Which deity should I worship for prosperity?"</li>
                  <li>"What specific Havan can remove negative energy?"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-orange-900 mb-2">100% Secure & Confidential</h3>
            <p className="text-orange-800 text-[14.5px] leading-relaxed font-medium">
              We strictly adhere to global data privacy standards. All your chats and calls with the expert are highly encrypted. Your personal phone number is masked through our cloud-telephony system and is never shared directly with the astrologer. You can discuss your most intimate life details without any fear of judgment or privacy breach.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">Frequently Asked Questions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">How do I start a consultation?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Simply click the "Chat" or "Call" button on the expert's profile. You will be prompted to recharge your wallet if your balance is low. Once connected, you will be charged on a per-minute basis.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What happens if my call gets disconnected?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  If the call drops due to network issues, your wallet deduction automatically stops. You can immediately initiate a new call to resume your conversation from where you left off.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Can I ask multiple questions in one session?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Yes! Once connected, you are free to discuss as many topics as you want—be it career, marriage, health, or remedies. The astrologer will answer everything based on your active session time.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Are these astrologers verified?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Absolutely. Every astrologer on our platform goes through a rigorous 3-step verification process, including academic checks, multiple interviews, and predictive accuracy tests.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
