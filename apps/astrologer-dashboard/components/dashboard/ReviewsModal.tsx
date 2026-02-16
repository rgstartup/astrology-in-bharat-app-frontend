"use client";

import React, { useEffect, useState } from "react";
import { X, Star, User, Loader2 } from "lucide-react";
import { getExpertReviews, Review } from "@/lib/reviews";

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    expertId: number;
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
            const data = await getExpertReviews(expertId, page, 10);
            setReviews(data.data || []);
            setTotal(data.total || 0);
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
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading && page === 1 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin mb-2" />
                            <p className="text-gray-500">Loading all reviews...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.user.name}</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
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
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:text-yellow-600 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500 font-medium">
                            Page {page} of {Math.ceil(total / 10)}
                        </span>
                        <button
                            disabled={page >= Math.ceil(total / 10) || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:text-yellow-600 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


