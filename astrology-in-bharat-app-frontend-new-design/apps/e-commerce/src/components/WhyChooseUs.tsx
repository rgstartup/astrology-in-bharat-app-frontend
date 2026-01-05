import React from "react";

const WhyChooseUs = () => {
  const values = [
    {
      icon: "fa-hands-holding-circle",
      title: "Ancient Wisdom",
      description:
        "Products blessed with traditional Vedic rituals passed down through generations",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "fa-microscope",
      title: "Modern Verification",
      description:
        "Every gemstone is lab-tested and comes with authentic certification",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: "fa-heart-circle-check",
      title: "Customer First",
      description:
        "Your satisfaction and spiritual growth is our highest priority",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "fa-globe",
      title: "Global Reach",
      description:
        "Serving spiritual seekers worldwide with fast and secure shipping",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl">🕉️</div>
        <div className="absolute bottom-10 right-10 text-9xl">✨</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-white text-theme-orange px-4 py-2 rounded-full text-sm font-semibold mb-4 font-outfit shadow-md">
            💫 Our Values
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            The Perfect Blend of{" "}
            <span className="text-theme-orange">Tradition & Technology</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit text-lg">
            We honor ancient wisdom while embracing modern standards of quality
            and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-theme-orange relative overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-theme-orange to-purple-500 rounded-3xl"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-20 h-20 mb-6 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  <i
                    className={`fa-solid ${value.icon} text-3xl text-white`}
                  ></i>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-pl group-hover:text-theme-orange transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-outfit leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-pl">
                Experience the Difference Today
              </h3>
              <p className="text-gray-600 font-outfit text-lg">
                Join thousands of satisfied customers on their spiritual journey
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="px-8 py-4 bg-theme-orange hover:bg-theme-orange-dark text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl font-pl whitespace-nowrap"
              >
                Start Shopping
              </a>
              <a
                href="/about"
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-semibold transition-all font-pl whitespace-nowrap"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
