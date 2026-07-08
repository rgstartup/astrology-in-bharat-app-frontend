import React from "react";

export default function CopyrightSeoContent() {
  return (
    <section className="not-prose pt-0 pb-10 md:pb-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-8 rounded-[3px]">
          
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#F26500] inline-flex pb-2">
            <i className="fa-solid fa-copyright text-[#F26500]"></i> Intellectual Property Rights
          </h2>
          
          <p className="text-gray-700 text-[15px] leading-relaxed mb-6 font-medium">
            Astrology in Bharat is committed to delivering highly authentic, original, and research-backed Vedic astrological content. Every article, calculator algorithm, layout design, and expert profile on this platform is the result of thousands of hours of hard work by our team of developers, researchers, and Vedic scholars. We strictly enforce our intellectual property rights globally.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-blue-900 mb-2">⚖️ Permitted vs. Prohibited Usage</h3>
            <p className="text-blue-800 text-[14.5px] leading-relaxed font-medium">
              You are completely free to read, share links to our articles, and use our calculators for your <strong>personal</strong> spiritual growth. However, scraping our data, copying our horoscope algorithms, cloning our UI/UX, or using our Astromall product images for commercial resale without a written licensing agreement is strictly prohibited and constitutes copyright infringement.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block pb-1">
              🛡️ Our Core Protected Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-code"></i> Platform Source Code & Algorithms
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">The mathematical logic powering our Kundali generation, Matchmaking, and Numerology calculators are proprietary trade secrets.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-camera"></i> Astromall Media
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">All high-resolution images of Gemstones, Rudrakshas, and Yantras are copyrighted. Unauthorized use on other e-commerce sites will result in immediate DMCA takedowns.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-pen-nib"></i> Vedic Research & Content
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">Our daily horoscopes, festival articles (Panchang), and astrological blogs are uniquely written by our scholars and cannot be syndicated without permission.</p>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-[3px] shadow-sm">
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-user-shield"></i> Expert Profiles
                </h4>
                <p className="text-[14px] text-gray-700 font-medium">The biographies, ratings, and reviews of the astrologers hosted on our platform are exclusive to Astrology in Bharat.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-10 rounded-r-md">
            <h3 className="text-[17px] font-bold text-orange-900 mb-2">📜 DMCA & Legal Action</h3>
            <p className="text-orange-800 text-[14.5px] leading-relaxed font-medium">
              We actively monitor the internet for content theft using automated tracking tools. If we discover our content hosted on unauthorized platforms, we will issue immediate Digital Millennium Copyright Act (DMCA) takedown notices to web hosts and search engines (like Google) without prior warning, followed by legal action under Indian Copyright Law.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-black mb-6 border-b-2 border-[#F26500] inline-block whitespace-nowrap pb-1">
              ❓ Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">Can I quote an article from Astrology in Bharat on my blog?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  Yes, under the "Fair Use" doctrine, you may quote short excerpts (up to 50 words) from our articles, provided you give clear and visible credit by placing a "dofollow" backlink directly to the original article on our website.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-[#F26500] text-[16px] mb-2">How do I report someone stealing your content?</h4>
                <p className="text-gray-700 text-[14.5px] leading-relaxed font-medium">
                  If you notice another website, app, or social media page copying our horoscopes, calculators, or product images, please email us at copyright@astrologyinbharat.com. We highly appreciate our community helping us maintain authenticity.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
