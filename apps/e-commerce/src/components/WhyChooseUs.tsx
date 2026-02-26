import React from "react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Verified Astrological Products",
      description:
        "Direct from the astrologers, authentic and energized products to bring positive energy.",
      icon: "/images/icon1.png", // Using existing icon assets
    },
    {
      title: "Accurate Predictions & Solutions",
      description:
        "Get accurate predictions and personalized solutions based on your birth chart.",
      icon: "/images/icon2.png",
    },
    {
      title: "100% Privacy & Transparency",
      description:
        "We ensure total privacy of your data and transparency in all our products and services.",
      icon: "/images/icon3.png",
    },
    {
      title: "Quick & Secure Shipping",
      description:
        "Fast and secure delivery of your sacred items across Bharat and beyond.",
      icon: "/images/icon4.png",
    },
  ];

  return (
    <section className="py-20 bg-theme-ivory">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-theme-brown mb-12 font-pl">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-[2rem] flex items-start gap-6 shadow-sm border border-orange-50 hover:shadow-lg transition-all"
            >
              <div className="w-20 h-20 bg-[#fef5ec] rounded-2xl flex items-center justify-center flex-shrink-0 p-3">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                  // onError={(e) => (e.currentTarget.src = "/images/medal.svg")}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-theme-brown mb-2 font-pl">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-outfit text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

