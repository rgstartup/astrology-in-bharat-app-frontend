"use client";

import React from "react";
import { Star, User } from "lucide-react";
import { Review } from "@/lib/reviews";

interface ReviewsListProps {
    reviews: Review[];
    loading?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, loading }) => {
    if (loading) {
        return <div className="p-4 text-center">Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No reviews yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-2">Recent Reviews</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400">
                                {new Date((review as any).created_at || review.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                            "{review.comment || "No comment provided."}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};


