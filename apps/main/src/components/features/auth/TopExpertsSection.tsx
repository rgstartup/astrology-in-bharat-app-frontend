"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api as http } from "@/lib/api";
import Skeleton from "@/components/ui/Skeleton";

interface ExpertUser {
    name: string;
    avatar: string;
}

interface TopExpert {
    id: string;
    user: ExpertUser;
    is_online: boolean;
    rating: number;
    specialization: string;
}

const DUMMY_TOP_EXPERTS: TopExpert[] = [
    {
        id: "dummy-exp-1",
        user: { name: "Acharya Vivek", avatar: "/images/dummy-expert.jpg" },
        is_online: true,
        rating: 4.9,
        specialization: "Vedic Astrology, Numerology"
    },
    {
        id: "dummy-exp-2",
        user: { name: "Pandit Sharma", avatar: "/images/dummy-expert.jpg" },
        is_online: true,
        rating: 4.8,
        specialization: "Vastu Shastra, Kundli"
    },
    {
        id: "dummy-exp-3",
        user: { name: "Astrologer Ravi", avatar: "/images/dummy-expert.jpg" },
        is_online: false,
        rating: 4.7,
        specialization: "Tarot Reading, Palmistry"
    }
];

const TopExpertsSection: React.FC = () => {
    const [topExperts, setTopExperts] = useState<TopExpert[]>([]);
    const [expertsLoading, setExpertsLoading] = useState(false);

    useEffect(() => {
        const fetchTopExperts = async () => {
            setExpertsLoading(true);
            const [res, error] = await http.get<TopExpert[]>('/expert/top-rated?limit=3');
            
            if (error) {
                console.warn("⚠️ Failed to fetch top experts, using dummy data.", error);
                setTopExperts(DUMMY_TOP_EXPERTS);
            } else {
                setTopExperts(res?.length > 0 ? res : DUMMY_TOP_EXPERTS);
            }
            setExpertsLoading(false);
        };

        fetchTopExperts();
    }, []);

    // Real-time status synchronization
    useEffect(() => {
        const { socket } = require("@/lib/socket");

        const handleStatusSync = (data: any) => {
            const userIdFromEvent = data.userId || data.id || data.expert_id;
            const isAvailable = data.is_available ?? data.is_online;

            setTopExperts(prev => prev.map(expert => {
                // Check if the update matches this expert (either profile ID or user ID)
                const isMatch = String(expert.id) === String(userIdFromEvent) || 
                                (expert.user as any)?.id && String((expert.user as any).id) === String(userIdFromEvent);

                if (isMatch) {
                    console.log(`[Presence] TopExpertsSection: Expert ${expert.user?.name} is now ${isAvailable ? 'Online' : 'Offline'}`);
                    return { ...expert, is_online: isAvailable };
                }
                return expert;
            }));
        };

        socket.on("expert_status_changed", handleStatusSync);

        return () => {
            socket.off("expert_status_changed", handleStatusSync);
        };
    }, []);

    return (
        <div className="mt-8 mb-8 md:mb-0">
            <h3 className="text-2xl font-black text-[#301118] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
                    <i className="fa-solid fa-crown text-orange text-sm"></i>
                </span>
                Top Rated Experts
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {expertsLoading || topExperts.length === 0 ? (
                    [1, 2, 3].map((_, idx) => (
                        <div className="w-full" key={idx}>
                            <div className="bg-white rounded-3xl border-2 border-orange/50 p-4 text-center animate-pulse">
                                <div className="relative inline-block mb-3">
                                    <Skeleton variant="circular" width={80} height={80} className="border-2 border-orange/20 p-1" />
                                </div>
                                <div className="flex flex-col items-center gap-2 mb-2">
                                    <Skeleton width="70%" height={16} className="rounded-md" />
                                    <Skeleton width={40} height={12} className="rounded-full" />
                                </div>
                                <Skeleton width="50%" height={10} className="rounded-md mx-auto" />
                            </div>
                        </div>
                    ))
                ) : (
                    topExperts.map((expert, idx) => (
                        <div className="group" key={expert.id || idx}>
                            <div className="bg-white rounded-3xl border-2 border-orange p-4 text-center hover:shadow-[0_10px_30px_rgba(255,107,0,0.15)] transition-all duration-300">
                                <div className="relative inline-block mb-3">
                                    <Image
                                        src={expert.user?.avatar || "/images/dummy-expert.jpg"}
                                        alt={expert.user?.name || "Expert"}
                                        height={80}
                                        width={80}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-orange/20 p-1 group-hover:scale-105 transition-transform duration-300"
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
                                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider truncate block">
                                    {expert.specialization || "Astrology"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopExpertsSection;
