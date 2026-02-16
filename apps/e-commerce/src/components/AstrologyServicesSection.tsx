import React from "react";

const AstrologyServicesSection = () => {
  const services = [
    {
      icon: "fa-user-tie",
      title: "Personal Consultation",
      description:
        "Get personalized guidance from expert astrologers to choose the right products for you",
      features: [
        "Kundli Analysis",
        "Gemstone Recommendation",
        "Remedy Suggestion",
      ],
      link: "/consultation",
    },
    {
      icon: "fa-book-open",
      title: "Product Guide",
      description:
        "Learn about the benefits and usage of various spiritual products",
      features: ["Gemstone Properties", "Rudraksha Benefits", "Yantra Usage"],
      link: "/guides",
    },
    {
      icon: "fa-bolt",
      title: "Energization Service",
      description:
        "All products are energized with Vedic mantras by certified pandits",
      features: ["Vedic Rituals", "Mantra Chanting", "Proper Activation"],
      link: "/energization",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 text-9xl">🕉️</div>
        <div className="absolute bottom-20 right-10 text-9xl">💎</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            Our <span className="text-theme-orange">Astrology Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit text-lg">
            Expert guidance and authentic products for your spiritual journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 via-white to-purple-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-orange-100 group relative overflow-hidden"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-theme-orange opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <i
                    className={`fa-solid ${service.icon} text-3xl text-white`}
                  ></i>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-pl">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 font-outfit">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <i className="fa-solid fa-check-circle text-theme-orange"></i>
                      <span className="font-outfit text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={service.link}
                  className="inline-flex items-center gap-2 text-theme-orange font-semibold hover:gap-3 transition-all font-pl group-hover:text-theme-orange-dark"
                >
                  Learn More <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-brown rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4 font-pl">
            Not Sure Which Product to Buy?
          </h3>
          <p className="text-gray-300 mb-6 font-outfit text-lg">
            Connect with our expert astrologers for personalized recommendations
          </p>
          <button className="bg-theme-orange hover:bg-white hover:text-theme-orange text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl font-pl text-lg">
            Book Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default AstrologyServicesSection;

