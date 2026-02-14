import React from "react";

const TrustBadgesSection = () => {
  const badges = [
    {
      icon: "fa-certificate",
      title: "100% Certified",
      description: "Lab certified gemstones",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "fa-shield-halved",
      title: "Secure Payments",
      description: "100% safe transactions",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: "fa-truck-fast",
      title: "Fast Delivery",
      description: "Pan India shipping",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: "fa-headset",
      title: "24/7 Support",
      description: "Expert guidance available",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: "fa-rotate-left",
      title: "Easy Returns",
      description: "7-day return policy",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: "fa-star",
      title: "Top Rated",
      description: "4.8/5 customer rating",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            Why Trust <span className="text-theme-orange">Our Store?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit">
            We are committed to authenticity, quality, and customer satisfaction
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`${badge.bgColor} rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group hover:shadow-lg`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                <i
                  className={`fa-solid ${badge.icon} text-2xl ${badge.color}`}
                ></i>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 font-pl">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-600 font-outfit">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 bg-gradient-brown rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-theme-orange mb-2 font-pl group-hover:scale-110 transition-transform">
                50K+
              </div>
              <p className="text-white font-outfit">Happy Customers</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-theme-orange mb-2 font-pl group-hover:scale-110 transition-transform">
                100%
              </div>
              <p className="text-white font-outfit">Authentic Products</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-theme-orange mb-2 font-pl group-hover:scale-110 transition-transform">
                200+
              </div>
              <p className="text-white font-outfit">Products Available</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-theme-orange mb-2 font-pl group-hover:scale-110 transition-transform">
                24/7
              </div>
              <p className="text-white font-outfit">Expert Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
