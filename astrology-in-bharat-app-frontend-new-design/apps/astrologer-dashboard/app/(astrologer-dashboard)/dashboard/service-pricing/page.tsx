import React from 'react'
import { Star, Edit3, Gift } from "lucide-react";

const page = () => {
  const services = [
    {
      name: "Chat Consultation",
      price: "₹20 / min",
      description: "Quick answers through chat with expert astrologers.",
      offer: "10% off first session",
    },
    {
      name: "Call Consultation",
      price: "₹50 / min",
      description: "Direct voice consultation with Our astrologers.",
      offer: "15% off first session",
    },
    {
      name: "Video Consultation",
      price: "₹100 / min",
      description: "Face-to-face video consultation for detailed guidance.",
      offer: "25% off weekends",
    },
    {
      name: "Report Writing",
      price: "₹999 / report",
      description: "Get a detailed astrology report delivered to you.",
      offer: "16% off first session",
    },
    {
      name: "Horoscope",
      price: "₹199 / month",
      description: "Daily and monthly personalized horoscope readings.",
      offer: "First month free",
    },
  ]
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-yellow-700 tracking-tight">
          Services & Pricing
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Manage your services, set attractive pricing, and create offers for your clients.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative bg-white p-7 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform border border-gray-200 group"
          >
            {/* Floating Star Icon */}
            <div className="absolute -top-5 -right-5 bg-gradient-to-tr from-yellow-500 to-yellow-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-white" />
            </div>

            {/* Service Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>

            {/* Price */}
            <div className="text-lg font-bold text-yellow-700 mb-3">{service.price}</div>

            {/* Offer Tag */}
            {service.offer && (
              <div className="inline-flex items-center px-3 py-1 mb-4 text-sm font-medium text-green-700 bg-green-100 rounded-full select-none">
                <Gift className="w-4 h-4 mr-1" /> {service.offer}
              </div>
            )}

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1">
              <Edit3 className="w-4 h-4" />
              Edit Service
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page