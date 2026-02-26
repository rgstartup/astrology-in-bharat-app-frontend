import React from "react";

const ZodiacSection = () => {
  const zodiacs = [
    { name: "Aries", icon: "♈", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", icon: "♉", dates: "Apr 20 - May 20" },
    { name: "Gemini", icon: "♊", dates: "May 21 - Jun 20" },
    { name: "Cancer", icon: "♋", dates: "Jun 21 - Jul 22" },
    { name: "Leo", icon: "♌", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", icon: "♍", dates: "Aug 23 - Sep 22" },
    { name: "Libra", icon: "♎", dates: "Sep 23 - Oct 22" },
    { name: "Scorpio", icon: "♏", dates: "Oct 23 - Nov 21" },
    { name: "Sagittarius", icon: "♐", dates: "Nov 22 - Dec 21" },
    { name: "Capricorn", icon: "♑", dates: "Dec 22 - Jan 19" },
    { name: "Aquarius", icon: "♒", dates: "Jan 20 - Feb 18" },
    { name: "Pisces", icon: "♓", dates: "Feb 19 - Mar 20" },
  ];

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            Shop by <span className="text-theme-orange">Zodiac Sign</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit text-lg">
            Find products specifically curated for your astrological profile
          </p>
        </div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {zodiacs.map((zodiac, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-theme-orange cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm group-hover:drop-shadow-md">
                {zodiac.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 font-pl group-hover:text-theme-orange transition-colors">
                {zodiac.name}
              </h3>
              <p className="text-xs text-gray-500 font-outfit">
                {zodiac.dates}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="text-theme-orange font-semibold hover:underline font-pl flex items-center justify-center gap-2 mx-auto group">
            Get personalized recommendations
            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ZodiacSection;

