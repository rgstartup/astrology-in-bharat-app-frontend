import React from "react";

export default function AboutSeoContent() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
        
        <h2 className="text-2xl font-black text-[#32131b] mb-6 flex items-center gap-3 border-b-2 border-orange inline-flex pb-2">Who We Are & Our Mission
        </h2>
        
        <p className="text-gray-700 text-[15px] leading-relaxed mb-8 font-medium">
          <strong>Astrology in Bharat</strong> was founded with a singular, powerful vision: to restore the profound dignity and scientific accuracy of ancient Vedic Astrology in the modern world. In an era filled with generalized horoscopes and fear-mongering, we stand as a beacon of authenticity, connecting seekers across the globe with India's most learned and verified Vedic Scholars.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
          <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">Our Vision for the Future
          </h3>
          <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
            We envision a world where astrology is not seen as mere superstition, but as a deeply respected psychological and cosmic tool for self-realization. We aim to make highly personalized, actionable, and ethical astrological guidance accessible to everyone, empowering them to navigate life's toughest challenges with confidence and peace.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-black text-[#32131b] mb-6">The 4 Core Pillars of Astrology in Bharat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Strict Expert Verification
              </h4>
              <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Every astrologer on our platform undergoes a rigorous 3-step screening process, testing their academic knowledge, predictive accuracy, and ethical counseling skills.</p>
            </div>
            <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">100% Data Privacy
              </h4>
              <p className="text-[14px] text-gray-600 font-medium leading-relaxed">Your birth details and consultation history are sacred. We employ bank-grade encryption to ensure your private life remains strictly confidential.</p>
            </div>
            <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Holistic Healing
              </h4>
              <p className="text-[14px] text-gray-600 font-medium leading-relaxed">We don't just predict the future; we help you shape it. Our experts provide actionable remedies including Gemstones, Mantras, and customized Vedic Pujas.</p>
            </div>
            <div className="bg-[#fffaf5] border border-orange/10 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-orange text-[17px] mb-2 flex items-center gap-2">Ethical Practices
              </h4>
              <p className="text-[14px] text-gray-600 font-medium leading-relaxed">We strictly prohibit fear-mongering (Dosh-scare tactics). Our astrologers are trained to deliver guidance with empathy, positivity, and absolute honesty.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-10 rounded-r-xl">
          <h3 className="text-[17px] font-bold text-amber-900 mb-2 flex items-center gap-2">A Note from the Founder
          </h3>
          <p className="text-amber-900 text-[14.5px] leading-relaxed italic font-medium">
            "Astrology is the language of the cosmos, written in the stars and decoded by the wise. Our goal at Astrology in Bharat is not to dictate your destiny, but to give you the cosmic roadmap so you can drive your life with absolute clarity."
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-black text-[#32131b] mb-6">Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
              <h4 className="font-bold text-orange text-[16px] mb-2">Why should I trust the Astrologers here over local ones?</h4>
              <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
                Finding a genuinely qualified astrologer locally is often a matter of luck. We take the guesswork out by meticulously vetting hundreds of applicants and selecting only the top 5% who possess deep scriptural knowledge and proven predictive track records.
              </p>
            </div>
            
            <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
              <h4 className="font-bold text-orange text-[16px] mb-2">Do you provide offline/in-person consulting?</h4>
              <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
                Our primary platform is digital to ensure global accessibility. However, for specialized services like Home Visit Pujas and Vastu consultations, our verified Pandits and Experts do travel to your location (currently available in select major cities).
              </p>
            </div>

            <div className="bg-[#fffaf5] p-5 rounded-2xl border border-orange/10">
              <h4 className="font-bold text-orange text-[16px] mb-2">Are your astrological products authentic?</h4>
              <p className="text-gray-600 font-medium text-[14.5px] leading-relaxed">
                Yes. Every single gemstone and Rudraksha shipped from Astromall is accompanied by a genuine, verifiable laboratory certificate. Furthermore, all products are energized (Pran Pratishtha) by Vedic scholars before dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
