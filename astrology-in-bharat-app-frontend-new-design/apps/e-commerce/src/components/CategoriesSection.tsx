import React from "react";

const CategoriesSection = () => {
  const categories = [
    {
      icon: "💎",
      title: "Gemstones",
      description: "Natural & Certified",
      count: "50+ Products",
      bgColor: "bg-orange-100",
      hoverBg: "hover:bg-theme-orange",
    },
    {
      icon: "📿",
      title: "Rudraksha",
      description: "Energized Beads",
      count: "30+ Products",
      bgColor: "bg-purple-100",
      hoverBg: "hover:bg-purple-600",
    },
    {
      icon: "🕉️",
      title: "Yantras",
      description: "Sacred Geometry",
      count: "25+ Products",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-600",
    },
    {
      icon: "🔔",
      title: "Puja Items",
      description: "Ritual Essentials",
      count: "40+ Products",
      bgColor: "bg-green-100",
      hoverBg: "hover:bg-green-600",
    },
    {
      icon: "📖",
      title: "Books",
      description: "Astrology Guides",
      count: "20+ Products",
      bgColor: "bg-yellow-100",
      hoverBg: "hover:bg-yellow-600",
    },
    {
      icon: "👔",
      title: "Accessories",
      description: "Bracelets & Rings",
      count: "35+ Products",
      bgColor: "bg-pink-100",
      hoverBg: "hover:bg-pink-600",
    },
  ];

  return (
    <section className="py-16 bg-gradient-brown relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-theme-orange opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-theme-orange opacity-10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-pl">
            Explore Our <span className="text-theme-orange">Categories</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto font-outfit text-lg">
            Discover authentic spiritual products across various categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group ${category.bgColor} ${category.hoverBg} rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 font-pl transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-gray-700 group-hover:text-white/90 mb-1 font-outfit transition-colors">
                {category.description}
              </p>
              <span className="text-xs text-gray-600 group-hover:text-white/80 font-outfit transition-colors">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
