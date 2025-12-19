import React from "react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Horoscope Reading",
    description:
      "Get detailed insights into your future with our accurate daily, monthly, and yearly horoscope readings.",
    icon: "fa-solid fa-star",
  },
  {
    id: 2,
    title: "Kundli Matching",
    description:
      "Ensure a harmonious marriage with our precise Kundli (Gun Milan) matching services.",
    icon: "fa-solid fa-heart",
  },
  {
    id: 3,
    title: "Tarot Card Reading",
    description:
      "Unlock the mysteries of your life path through the ancient wisdom of Tarot cards.",
    icon: "fa-solid fa-layer-group",
  },
  {
    id: 4,
    title: "Vedic Astrology",
    description:
      "Consult with expert Vedic astrologers to understand planetary influences on your life.",
    icon: "fa-solid fa-om",
  },
  {
    id: 5,
    title: "Palmistry",
    description:
      "Your destiny is in your hands. Let our experts read your palm lines to predict your future.",
    icon: "fa-solid fa-hand",
  },
  {
    id: 6,
    title: "Numerology",
    description:
      "Discover the hidden meaning of numbers in your life and how they shape your personality.",
    icon: "fa-solid fa-arrow-up-9-1",
  },
  {
    id: 7,
    title: "Gemstone Consultation",
    description:
      "Find the perfect gemstone to bring luck, health, and prosperity into your life.",
    icon: "fa-regular fa-gem",
  },
  {
    id: 8,
    title: "Vastu Shastra",
    description:
      "Optimize your living and working spaces for positive energy flow with Vastu consultation.",
    icon: "fa-solid fa-house-chimney",
  },
  {
    id: 9,
    title: "Puja Services",
    description:
      "Book online puja rituals performed by experienced priests for your well-being.",
    icon: "fa-solid fa-fire-flame-curved",
  },
];

const ServicesPage = () => {
  return (
    <section className="services-page-section">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="title-primary color-secondary">
            Our Premium Services
          </h1>
          <p className="p-lg mt-2">
            Comprehensive Spiritual & Astrological Solutions
          </p>
        </div>

        <div className="services-grid-page">
          {services.map((service) => (
            <div key={service.id} className="service-page-card">
              <div className="service-icon-box">
                <i className={service.icon}></i>
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
              <Link href="/our-astrologers" className="service-btn">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
