import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Mumbai",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "The gemstone I purchased was authentic and brought positive changes to my life. Highly recommended!",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      title: "Delhi",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Excellent quality Rudraksha mala. The energization was done perfectly. Thank you!",
    },
    {
      id: 3,
      name: "Anita Desai",
      title: "Bangalore",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "The Shree Yantra is beautiful and I can feel the positive energy in my home.",
    },
    {
      id: 4,
      name: "Vikram Singh",
      title: "Jaipur",
      image: "https://i.pravatar.cc/150?img=13",
      rating: 5,
      text: "Fast delivery and genuine products. The astrology consultation was also very helpful.",
    },
    {
      id: 5,
      name: "Meera Patel",
      title: "Ahmedabad",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
      text: "Best place to buy authentic spiritual products. The team is very knowledgeable.",
    },
    {
      id: 6,
      name: "Arjun Reddy",
      title: "Hyderabad",
      image: "https://i.pravatar.cc/150?img=14",
      rating: 5,
      text: "The bracelet is working wonders for me. My career has taken a positive turn!",
    },
    {
      id: 7,
      name: "Kavita Joshi",
      title: "Pune",
      image: "https://i.pravatar.cc/150?img=10",
      rating: 5,
      text: "Genuine products with proper certification. Worth every penny!",
    },
    {
      id: 8,
      name: "Sanjay Gupta",
      title: "Kolkata",
      image: "https://i.pravatar.cc/150?img=15",
      rating: 5,
      text: "The customer service is excellent and products are of premium quality.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            What Our <span className="text-theme-orange">Customers Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit text-lg">
            Trusted by thousands across India for authentic spiritual products
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-theme-orange shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Rating Badge */}
                <div className="absolute -bottom-2 -right-2 bg-theme-orange text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
                  {testimonial.rating}★
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-sm font-pl">
                {testimonial.name}
              </h4>
              <p className="text-xs text-gray-500 font-outfit">
                {testimonial.title}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-theme-orange mr-3"
                />
                <div>
                  <h4 className="font-bold text-gray-900 font-pl">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i
                        key={i}
                        className="fa-solid fa-star text-theme-orange text-xs"
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm font-outfit italic">
                &quot;{testimonial.text}&quot;
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-theme-orange hover:bg-theme-orange-dark text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl font-pl">
            Read More Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

