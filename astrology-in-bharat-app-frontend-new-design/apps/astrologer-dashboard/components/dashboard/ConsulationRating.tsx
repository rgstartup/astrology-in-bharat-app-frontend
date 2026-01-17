"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingDistribution {
    stars: number;
    count: number;
}

interface ConsultationRatingsProps {
    averageRating: number;
    totalRatings: number;
    distribution: RatingDistribution[];
}

export const ConsultationRatings: React.FC<ConsultationRatingsProps> = ({
    averageRating,
    totalRatings,
    distribution,
}) => {
    // Calculate max count for proportional bars
    const maxCount = Math.max(...distribution.map((d) => d.count), 1);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100   text-black">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">

                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center mr-1">
                    <Star className="w-5 h-5 text-white " />
                </div>
                Consultation Ratings
            </h3>

            {/* Descriptive Content */}
            <p className="mb-6 text-sm opacity-90 leading-relaxed">
                Your consultation ratings reflect the quality and satisfaction experienced by your clients.
                Maintaining high ratings helps build trust and credibility on the platform, encouraging more clients
                to seek your astrological guidance. Here you can see the average rating, total reviews, and a detailed
                distribution of ratings received from 1 to 5 stars.
            </p>

            <div className="flex items-center gap-6">
                {/* Average Rating */}
                <div className="text-black text-6xl font-bold  select-all">
                    {averageRating.toFixed(1)}
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1">
                    {distribution
                        .sort((a, b) => b.stars - a.stars)
                        .map(({ stars, count }) => {
                            const widthPercent = (count / maxCount) * 100;
                            return (
                                <div key={stars} className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 w-12">
                                        {Array.from({ length: stars }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-600" />
                                        ))}
                                    </div>
                                    <div className="w-full bg-yellow-400/30 h-3 rounded overflow-hidden">
                                        <div
                                            className="bg-yellow-600 h-3 rounded"
                                            style={{ width: `${widthPercent}%` }}
                                        />
                                    </div>
                                    <div className="w-10 text-sm text-white text-right tabular-nums select-none">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                    <p className="text-xs opacity-90 mt-1">
                        Based on <strong>{totalRatings.toLocaleString()}</strong> consultations
                    </p>
                </div>
            </div>
        </div>
    );
};
