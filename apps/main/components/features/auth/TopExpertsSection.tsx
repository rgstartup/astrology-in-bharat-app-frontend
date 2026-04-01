"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api as http } from "@/lib/api";

interface ExpertUser {
    name: string;
    avatar: string;
}

interface TopExpert {
    id: number;
    user: ExpertUser;
    is_online: boolean;
    rating: number;
    specialization: string;
}

const TopExpertsSection: React.FC = () => {
    const [topExperts, setTopExperts] = useState<TopExpert[]>([]);
    const [expertsLoading, setExpertsLoading] = useState(false);

    useEffect(() => {
        const fetchTopExperts = async () => {
            setExpertsLoading(true);
            const [res, error] = await http.get<TopExpert[]>('/expert/top-rated?limit=3');
            
            if (error) {
                setTopExperts([]);
            } else {
                setTopExperts(Array.isArray(res) ? res : []);
            }
            setExpertsLoading(false);
        };

        fetchTopExperts();
    }, []);

    return (
        <div className="mt-8 hidden md:block">
            <h3 className="text-2xl font-black text-[#301118] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
                    <i className="fa-solid fa-crown text-orange text-sm"></i>
                </span>
                Top Rated Experts
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {expertsLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange"></div>
                    </div>
                ) : topExperts.length > 0 ? (
                    topExperts.map((expert, idx) => (
                        <div className="group" key={expert.id || idx}>
                            <div className="bg-white rounded-3xl border-2 border-gray-100 p-4 text-center hover:border-orange/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
                                <div className="relative inline-block mb-3">
                                    <Image
                                        src={expert.user?.avatar || "/images/dummy-astrologer.jpg"}
                                        alt={expert.user?.name || "Expert"}
                                        height={80}
                                        width={80}
                                        className="rounded-full object-cover border-2 border-orange/20 p-1 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {expert.is_online && (
                                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                    )}
                                </div>
                                <h6 className="font-bold text-[#301118] leading-tight mb-1 truncate px-1">
                                    {expert.user?.name || 'Expert'}
                                </h6>
                                <div className="flex items-center justify-center gap-1 mb-1 bg-orange/5 rounded-full py-0.5 px-2 w-fit mx-auto">
                                    <i className="fa-solid fa-star text-orange text-[10px]"></i>
                                    <span className="text-xs font-black text-orange">{expert.rating || '5.0'}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate block opacity-70">
                                    {expert.specialization || "Astrology"}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    [1, 2, 3].map((_, idx) => (
                        <div className="opacity-50" key={idx}>
                            <div className="bg-white rounded-3xl border-2 border-gray-50 p-4 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-3 animate-pulse"></div>
                                <div className="h-4 bg-gray-50 rounded w-2/3 mx-auto mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-50 rounded w-1/2 mx-auto animate-pulse"></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopExpertsSection;
