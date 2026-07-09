import React from "react";

export default function DahejSeoContent() {
  return (
    <section className="!bg-[#edeef1] py-10 md:py-16 mt-0">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          
          <h2 className="section-heading-premium mb-6">
            <span>Understanding the Dahej Calculator: A Tool for Awareness</span>
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            Welcome to the Dahej (Dowry) Calculator. At first glance, this might seem like a tool to calculate a "price tag" for marriage based on education, profession, and city. However, <strong>this calculator is completely satirical and designed to raise social awareness</strong> against the regressive practice of dowry. 
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded-r-md">
            <p className="text-red-800 text-[14px]">
              <strong>CRITICAL LEGAL NOTE:</strong> Dowry is a serious social evil and a criminal offense in India under the <strong>Dowry Prohibition Act, 1961</strong>. Giving or taking dowry is punishable by imprisonment and heavy fines. This tool does not promote or support the dowry system in any way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-[20px] font-bold text-black mb-4 border-b-2 border-[#F26500] inline-block pb-1">Why Did We Build This?
              </h3>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                The purpose of this calculator is to hold a mirror to society. It highlights how marriages are often incorrectly treated as business transactions rather than sacred unions. By turning human achievements (like education and profession) into algorithmic "rates," we aim to expose the absurdity and dehumanizing nature of the dowry system. 
              </p>
            </div>
            
            <div>
              <h3 className="text-[20px] font-bold text-black mb-4 border-b-2 border-[#F26500] inline-block pb-1">Real Marriages Built on Equality
              </h3>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                A true partnership is based on mutual respect, love, trust, and shared responsibilities. A person's worth cannot and should not be calculated based on their income bracket or degree. Let's pledge to build a society where marriages are free of financial extortion and societal pressure.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Is this calculator accurate?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed">
                  No. The amounts generated are completely arbitrary and satirical. Human life and relationships have no monetary value, and trying to calculate it is exactly the mentality we wish to discourage.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What is the Dowry Prohibition Act?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed">
                  Enacted in 1961, this Indian law prohibits the request, payment, or acceptance of a dowry. Violators can face severe penalties, including a minimum of 5 years of imprisonment and significant fines.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">How can I help stop the dowry system?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed">
                  You can start by refusing to give or accept dowry in your own family. Educate others, support financial independence for all genders, and report any dowry harassment to the authorities or women's helplines immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 rounded-[3px] text-center">
            <h3 className="text-[18px] font-bold text-black mb-2">Join the Movement</h3>
            <p className="text-gray-700 text-[14.5px] leading-relaxed">
              Let's normalize marriages based on compatibility, astrology, and mutual understanding—not bank balances. Say NO to Dahej, and YES to respect.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
