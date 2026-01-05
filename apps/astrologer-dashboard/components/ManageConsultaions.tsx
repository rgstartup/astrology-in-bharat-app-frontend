"use client";

import React from "react";
import { ChevronDown, Plus, Video, Phone} from "lucide-react";

export const ManageConsultaions: React.FC = () => {
    const services = [
        {
            name: "15 Min Call Consultation",
            category: "Phone",
            duration: "15 min",
            price: "₹499",
            icon: Phone,
            status: "Active",
        },
        {
            name: "30 Min Video Consultation",
            category: "Video",
            duration: "30 min",
            price: "₹999",
            icon: Video,
            status: "Active",
        },

    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 w-2/5">Manage Consultations </h3>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <span>All Services</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm shadow-sm">
                        <Plus className="w-4 h-4" />
                        <span>Add Service</span>
                    </button>
                </div>
            </div>

            {/* Grid of services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center rounded-lg">
                                <service.icon className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                <p className="text-xs text-gray-500">{service.category}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 flex flex-col flex-1 justify-between">
                            <div className="mb-3">
                                <p className="text-sm text-gray-600">Duration: {service.duration}</p>
                                <p className="text-sm font-bold text-gray-900">{service.price}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Status */}
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {service.status}
                                </span>

                                <button className="text-sm text-yellow-600 hover:underline font-medium">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
