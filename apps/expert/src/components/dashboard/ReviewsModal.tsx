"use client";

import React, { useEffect, useState } from "react";
import { X, Star, User } from "lucide-react";
import { Loading } from "@repo/ui";
import { getReviews, Review } from "@/lib/reviews";
import { getErrorMessage } from "@repo/lib";
import Button from "../ui/Button";

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    expertId: string;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose, expertId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (isOpen && expertId) {
            fetchReviews();
        }
    }, [isOpen, expertId, page]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const [data, error] = await getReviews(expertId, page, 10);
            if (error) throw new Error(getErrorMessage(error));
            
            setReviews(data?.reviews || []);
            setTotal(data?.total || 0);
        } catch (error) {
            console.error("Error fetching reviews list:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">All Client Reviews</h3>
                        <p className="text-sm text-gray-500">{total} Reviews Total</p>
                    </div>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading && page === 1 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loading size="lg" text="Loading all reviews..." />
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center overflow-hidden border border-yellow-100 flex-shrink-0">
                                            {(review.user?.avatar || review.client?.avatar || review.client?.profile_picture || review.client?.user?.avatar) ? (
                                                <img
                                                    src={review.user?.avatar || review.client?.avatar || review.client?.profile_picture || review.client?.user?.avatar}
                                                    alt={review.user?.name || review.client?.name || review.client?.user?.name || "Anonymous"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as any).src = ""; // Clear src if it fails
                                                        (e.target as any).style.display = 'none'; // Hide image
                                                    }}
                                                />
                                            ) : (
                                                <User className="w-5 h-5 text-orange-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.user?.name || review.client?.name || review.client?.user?.name || "Anonymous"}</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-4 h-4 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(review.created_at || Date.now()).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed pl-13">
                                    {review.comment || "No comment provided."}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-10">No reviews found.</p>
                    )}
                </div>

                {/* Footer / Pagination */}
                {total > 10 && (
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                        <Button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 disabled:opacity-50 hover:text-orange-600 transition-colors"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-500 font-medium">
                            Page {page} of {Math.ceil(total / 10)}
                        </span>
                        <Button
                            disabled={page >= Math.ceil(total / 10) || loading}
                            onClick={() => setPage(p => p + 1)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 disabled:opacity-50 hover:text-orange-600 transition-colors"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};


