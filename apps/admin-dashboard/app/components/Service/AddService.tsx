"use client";
import React from "react";
import { X, Clock, Sparkles } from "lucide-react";
import { Button } from "../../../../shared/components/Button";

interface AddServiceProps {
  onClose: () => void;
}

const AddService: React.FC<AddServiceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      {/* MODAL (SIZE SAME) */}
      <div className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-[#fafafa] to-[#f1f1f1]
                      rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4
                        bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="text-lg font-semibold">Add New Service</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition"
          >
            <X />
          </button>
        </div>

        {/* BODY (SCROLL SAME) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div
              className="
    bg-white rounded-xl p-5 space-y-5
    border border-gray-200
    transition-all duration-300
    hover:shadow-lg hover:-translate-y-0.5
    hover:border-orange-300
  "
            >
              {/* Title */}
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                Service Details
              </h3>

              {/* Service Name */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-800">
                  Service Name
                </label>
                <input
                  className="
      w-full px-4 py-3 
      border border-gray-300
      rounded-xl
      bg-white
      text-gray-800
      placeholder:text-gray-400
      transition-all duration-200
      hover:border-orange-300
      focus:border-orange-500
      focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
      outline-none
    "
                  placeholder="Birth Chart Reading"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-900 tracking-tight">
                  Category
                </label>
                <select
                  className="
      w-full px-4 py-3 
      border border-gray-300
      rounded-xl
      bg-white
      text-gray-800
      transition-all duration-200
      hover:border-orange-300
      focus:border-orange-500
      focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
      outline-none
      appearance-none
      cursor-pointer
    "
                >
                  <option className="text-gray-400">Select Category</option>
                  <option>Vedic Astrology</option>
                  <option>Marriage</option>
                  <option>Career</option>
                </select>
              </div>

              {/* Duration + Demand */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900">
                    Duration
                  </label>
                  <input
                    className="
        w-full px-4 py-3 
        border border-gray-300
        rounded-xl
        bg-white
        text-gray-800
        placeholder:text-gray-400
        transition-all duration-200
        hover:border-orange-300
        focus:border-orange-500
        focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
        outline-none
      "
                    placeholder="30 min"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900">
                    Demand
                  </label>
                  <select
                    className="
        w-full px-4 py-3 
        border border-gray-300
        rounded-xl
        bg-white
        text-gray-800
        transition-all duration-200
        hover:border-orange-300
        focus:border-orange-500
        focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
        outline-none
        appearance-none
        cursor-pointer
      "
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-orange-500"
                  />
                  <span className="text-gray-700 group-hover:text-orange-600 transition">
                    Active
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-orange-500"
                  />
                  <span className="text-gray-700 group-hover:text-orange-600 transition">
                    Featured
                  </span>
                </label>
              </div>
            </div>

            {/* CENTER */}
            <div className="bg-white rounded-xl p-6 space-y-5 border border-gray-200
                hover:shadow-lg transition-all duration-300">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Description</h3>
                <p className="text-sm text-gray-500">Add detailed description about the service</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-900">
                  Service Description
                </label>
                <textarea
                  className="
        w-full px-4 py-3 
        border border-gray-300
        rounded-xl
        bg-white
        text-gray-800
        placeholder:text-gray-400
        transition-all duration-200
        hover:border-orange-300
        focus:border-orange-500
        focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
        outline-none
        resize-none
        h-32
      "
                  placeholder="Short service description"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-900">
                  Key Points / Specifications
                </label>
                <textarea
                  className="
        w-full px-4 py-3 
        border border-gray-300
        rounded-xl
        bg-white
        text-gray-800
        placeholder:text-gray-400
        transition-all duration-200
        hover:border-orange-300
        focus:border-orange-500
        focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
        outline-none
        resize-none
        h-28
      "
                  placeholder="Key points / Specifications"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-xl p-5 border border-gray-100
                            hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-3">
                Service Preview
              </h3>

              <div className="border rounded-xl overflow-hidden bg-white">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
                  alt="Astrology"
                  className="h-40 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>

                  <h4 className="font-semibold text-gray-800">
                    Birth Chart Reading
                  </h4>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} /> 30 min
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-600">
                      ₹799
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹999
                    </span>
                  </div>

                  <Button size="sm" className="w-full">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-white border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Add Service
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AddService;
