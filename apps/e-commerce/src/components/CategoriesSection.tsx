import React from "react";

const CategoriesSection = () => {
  const categories = [
    {
      title: "Bracelets",
      image: "/images/product-2.webp",
    },
    {
      title: "Yantras",
      image: "/images/product-5.jpg",
    },
    {
      title: "Rings",
      image: "/images/atrology-ring.png", // Hypothetical asset name, will fallback
    },
    {
      title: "Malas",
      image: "/images/product-1.webp",
    },
  ];

  return (
    <section className="py-12 bg-theme-ivory">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-theme-brown mb-8 font-pl">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-orange-50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-[#f8f8f8] rounded-xl flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  // onError={(e) =>
                  //   (e.currentTarget.src =
                  //     "https://cdn-icons-png.flaticon.com/512/2645/2645843.png")
                  // }
                />
              </div>
              <h3 className="text-lg font-bold text-theme-brown font-pl group-hover:text-theme-orange transition-colors">
                {cat.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

