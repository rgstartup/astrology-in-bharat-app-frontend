import React from "react";
import { Star } from "lucide-react";
import Button from "../ui/Button";
import { RatingSkeleton } from "./DashboardSkeletons";

interface RatingDistribution {
    stars: number;
    count: number;
}

interface ConsultationRatingsProps {
    averageRating: number;
    totalRatings: number;
    distribution: RatingDistribution[];
    loading?: boolean;
    onViewAllClick?: () => void;
}

export const ConsultationRatings: React.FC<ConsultationRatingsProps> = ({
    averageRating,
    totalRatings,
    distribution,
    loading = false,
    onViewAllClick
}) => {
    // Calculate max count for proportional bars
    const maxCount = Math.max(...distribution.map((d) => d.count), 1);

    if (loading) {
        return <RatingSkeleton />;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-500 text-black">
            <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-1 shrink-0">
                        <Star className="w-5 h-5 text-white" />
                    </div>
                    <span className="break-words leading-tight">Consultation Ratings</span>
                </h3>
                {onViewAllClick && (
                    <Button
                        onClick={onViewAllClick}
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 font-medium hover:underline hover:bg-transparent whitespace-nowrap shrink-0"
                    >
                        View All
                    </Button>
                )}
            </div>

            {/* Descriptive Content */}
            <p className="mb-6 text-sm opacity-100 leading-relaxed text-gray-800">
                Your consultation ratings reflect the quality and satisfaction experienced by your clients.
                Maintaining high ratings helps build trust and credibility on the platform.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Average Rating */}
                <div className="flex flex-col items-center">
                    <div className="text-black text-6xl font-bold select-all">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-orange-600 fill-orange-600' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-700 mt-2">
                        Based on <strong>{totalRatings.toLocaleString()}</strong> consultations
                    </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 w-full">
                    {distribution
                        .sort((a, b) => b.stars - a.stars)
                        .map(({ stars, count }) => {
                            const widthPercent = (count / (totalRatings || 1)) * 100;
                            return (
                                <div key={stars} className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 w-8">
                                        <span className="text-sm font-medium w-3">{stars}</span>
                                        <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
                                    </div>
                                    <div className="flex-1 bg-yellow-100 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-orange-600 h-full rounded-full"
                                            style={{ width: `${widthPercent}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-sm text-gray-800 text-right tabular-nums font-medium">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};


