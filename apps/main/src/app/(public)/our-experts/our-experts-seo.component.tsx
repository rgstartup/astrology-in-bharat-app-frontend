import React from "react";

export default function OurExpertsSeoContent() {
  return (
    <section className="bg-[#edeef1] py-10 md:py-16 mt-8">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">
            <i className="fa-solid fa-users-viewfinder text-[#F26500]"></i> Connect with India's Most Trusted Astrologers
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
            Finding a genuine astrologer in today's digital age can be overwhelming. At Astrology in Bharat, we have curated a premium panel of India's most learned Vedic scholars, Tarot readers, and Numerologists. Whether you need deep Kundali analysis or a quick Tarot spread for immediate clarity, our experts are available 24/7 to guide you through life's most complex challenges.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-certificate"></i> Our Rigorous 3-Step Verification Process
            </h3>
            <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
              We reject over 90% of astrologer applications. Every expert you see on this page has passed a strict vetting process: (1) Academic Verification of their astrological degrees, (2) Multiple live interview rounds testing their predictive accuracy, and (3) A psychological evaluation to ensure they counsel with empathy and never use fear-mongering tactics.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block pb-1">
              🔮 Explore Diverse Areas of Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star-and-crescent"></i> Vedic Astrology (Jyotish)
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">The ancient Indian science of light. Best for highly accurate, long-term life predictions regarding career, marriage timing, and deep karmic analysis.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-layer-group"></i> Tarot Card Reading
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">A mystical tool tapping into the subconscious. Best for immediate answers, exploring emotional situations, and understanding someone's current feelings.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-hashtag"></i> Numerology
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">The cosmic mathematics of the universe. Best for discovering your Life Path, choosing lucky numbers, or correcting the spelling of your name for success.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm hover:border-[#F26500]/30 transition-colors">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-house-chimney-crack"></i> Vastu Shastra
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">The science of architectural energy. Best for identifying and correcting energetic imbalances in your home or office to attract health and prosperity.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-orange-900 mb-2">⭐ Real Reviews & Transparent Ratings</h3>
            <p className="text-orange-800 text-[14.5px] leading-relaxed font-medium">
              We believe in 100% transparency. The ratings and reviews displayed on each expert's profile are unfiltered and written by actual users who have completed paid consultations. You can filter astrologers by their rating, experience, or price to find the perfect match for your budget.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">
              ❓ Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">How do I choose the best astrologer for my problem?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Use the "Filter" option on this page! If you have a question about marriage, filter by "Marriage Experts". You can also filter by Language (Hindi, English, Tamil, etc.) to ensure you can communicate comfortably.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">What is the difference between Chat and Call consultation?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  The predictive accuracy is exactly the same for both. Chat is great if you are in a public place or want a written record of the remedies. Call is better if you want a detailed, flowing conversation and want to explain complex emotional situations.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
