import React from "react";
import {
    AstrologyServicesData,
    ConsultationServicesData,
} from "@/components/AstrologyServices/homePagaData";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: {
        slug: string;
    };
}

const ServiceDetailsPage = ({ params }: PageProps) => {
    const { slug } = params;

    // Search in both data arrays
    const service =
        AstrologyServicesData.find((item) => item.slug === slug) ||
        ConsultationServicesData.find((item) => item.slug === slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative h-64 sm:h-80 md:h-96">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <h1 className="text-3xl md:text-4xl font-bold text-white p-6 md:p-8">
                            {service.title}
                        </h1>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            <h2 className="text-xl font-semibold text-[#1e0b0f] border-l-4 border-[#fd6410] pl-3">
                                Overview
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {service.description || "No description available."}
                            </p>

                            {service.longDescription && (
                                <>
                                    <h2 className="text-xl font-semibold text-[#1e0b0f] border-l-4 border-[#fd6410] pl-3 mt-8">
                                        Detailed Insight
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {service.longDescription}
                                    </p>
                                </>
                            )}

                            {service.benefits && service.benefits.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-[#1e0b0f] border-l-4 border-[#fd6410] pl-3 mb-4">
                                        Key Benefits
                                    </h2>
                                    <ul className="space-y-2">
                                        {service.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-600">
                                                <span className="text-[#fd6410] mt-1">✓</span>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {service.process && service.process.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-[#1e0b0f] border-l-4 border-[#fd6410] pl-3 mb-4">
                                        How It Works
                                    </h2>
                                    <div className="space-y-4">
                                        {service.process.map((step, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#fff5f0] text-[#fd6410] flex items-center justify-center font-bold border border-[#fee2d5]">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-600 pt-1">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {service.faq && service.faq.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-[#1e0b0f] border-l-4 border-[#fd6410] pl-3 mb-4">
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-4">
                                        {service.faq.map((item, index) => (
                                            <div key={index} className="bg-[#f8f9fa] p-4 rounded-lg">
                                                <h3 className="font-medium text-[#1e0b0f] mb-2">{item.question}</h3>
                                                <p className="text-gray-600 text-sm">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-80 flex-shrink-0 bg-[#fff5f0] p-6 rounded-xl border border-[#fee2d5]">
                            <div className="text-center mb-6">
                                <span className="block text-gray-500 text-sm mb-1">Consultation Fee</span>
                                <span className="text-3xl font-bold text-[#fd6410]">
                                    ₹{service.price || "On Request"}
                                </span>
                            </div>

                            <button className="w-full bg-[#fd6410] text-white py-3 rounded-lg font-semibold hover:bg-[#e0550a] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                Book Now
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 mb-2">
                                    Secure Payment • 100% Private
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#fd6410] transition-colors font-medium">
                            ← Back to Services
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
