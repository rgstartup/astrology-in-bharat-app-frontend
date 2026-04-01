"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import { api as http } from "@/lib/api";

const { Star } = LucideIcons as any;

type SessionSummaryModalProps = {
    showModal: boolean;
    isDarkMode: boolean;
    sessionSummary: any;
    freeMinutes: number;
    reviewRating: number;
    setReviewRating: (val: number) => void;
    reviewComment: string;
    setReviewComment: (val: string) => void;
    reviewSubmitted: boolean;
    setReviewSubmitted: (val: boolean) => void;
    sessionId: string | null;
    expertData: any;
    router: any;
};

export default function SessionSummaryModal({
    showModal,
    isDarkMode,
    sessionSummary,
    freeMinutes,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewSubmitted,
    setReviewSubmitted,
    sessionId,
    expertData,
    router
}: SessionSummaryModalProps) {
    if (!showModal) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 ${isDarkMode ? 'bg-[#0a0505]/95' : 'bg-black/60'} backdrop-blur-xl animate-in fade-in duration-500`}>
            <div className={`${isDarkMode ? 'bg-[#1a0c0c]' : 'bg-white'} w-full max-w-md rounded-[32px] overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-[#fd6410]/20'} shadow-[0_0_50px_rgba(253,100,16,0.15)] animate-in zoom-in-95 duration-300 relative max-h-[90vh] flex flex-col`}>
                <div className="p-6 md:p-8 flex flex-col items-center text-center relative z-10 overflow-y-auto custom-scrollbar">

                    <h2 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'} tracking-tight uppercase`}>
                        {sessionSummary?.status === 'expired' ? 'Session Expired' : sessionSummary?.status === 'terminated' ? 'Admin Terminated Session' : 'Session Summary'}
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[11px] font-bold tracking-widest uppercase mb-6`}>
                        {sessionSummary?.status === 'expired' ? 'Expert missed the request' : sessionSummary?.status === 'terminated' ? null : 'Consulation Finished'}
                    </p>

                    {sessionSummary?.status === 'terminated' && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-6 w-full">
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Authorization Action</p>
                            <p className="text-red-400 text-sm leading-relaxed">
                                {sessionSummary?.reason || sessionSummary?.message || "Your session was terminated by an administrator for policy violation or security reasons."}
                            </p>
                        </div>
                    )}

                    {sessionSummary?.status !== 'terminated' && (
                        <div className={`w-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl p-5 mb-6 space-y-3 flex-shrink-0`}>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 font-bold uppercase tracking-tighter">Total Duration</span>
                                <span className="font-black">
                                    {sessionSummary?.durationMins ? (
                                        <>
                                            {Math.floor(sessionSummary.durationMins) > 0 && `${Math.floor(sessionSummary.durationMins)} Min `}
                                            {Math.round((sessionSummary.durationMins % 1) * 60)} Sec
                                        </>
                                    ) : '0 Sec'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-50 font-bold uppercase tracking-tighter">Charge per minute</span>
                                <span className="font-black">₹{sessionSummary?.pricePerMinute || (sessionSummary as any)?.price_per_minute || 0}</span>
                            </div>
                            <div className="h-px bg-current opacity-10"></div>
                            {sessionSummary?.isFree && (
                                <div className="flex justify-between items-center text-xs text-green-500 font-bold mb-2">
                                    <span className="uppercase tracking-tighter">Free Minutes Discount</span>
                                    <span className="bg-green-500/10 px-2 py-0.5 rounded">-{sessionSummary?.freeMinutes || freeMinutes} Mins</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[#fd6410] font-black uppercase tracking-tighter text-sm">Amount Deducted</span>
                                <span className="text-xl font-black">₹{sessionSummary?.totalCost || (sessionSummary as any)?.total_cost || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs opacity-60">
                                <span>Remaining Balance</span>
                                <span className="font-black">₹{Math.floor(sessionSummary?.remainingBalance || 0)}</span>
                            </div>
                        </div>
                    )}

                    {/* Review Section - Show only if NOT expired and NOT terminated */}
                    {sessionSummary?.status !== 'expired' && sessionSummary?.status !== 'terminated' && (
                        <div className="w-full mb-6">
                            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rate your Experience</h3>
                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="transition-all hover:scale-110 active:scale-90"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Sharing your experience helps others..."
                                className={`w-full p-4 rounded-xl text-sm mb-4 resize-none outline-none border transition-all focs:ring-2 focus:ring-[#fd6410] ${isDarkMode
                                    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-800'
                                    }`}
                                rows={2}
                            />
                            <button
                                onClick={async () => {
                                    if (reviewSubmitted) return;

                                    // Validation
                                    const sid = parseInt(sessionId || '0');
                                    if (!sid) {
                                        toast.error("Invalid Session ID. Cannot submit review.");
                                        return;
                                    }

                                    if (reviewRating === 0) {
                                        toast.warning("Please select a rating before submitting");
                                        return;
                                    }

                                    const payload = {
                                        sessionId: sid,
                                        expertId: expertData?.id || expertData?.userId,
                                        rating: reviewRating,
                                        comment: reviewComment.trim()
                                    };

                                    console.log("[UserChatDebug] Submitting Review Payload:", payload);

                                    setReviewSubmitted(true);
                                    
                                    const [res, err] = await http.post('/reviews', payload);

                                    if (err) {
                                        setReviewSubmitted(false);
                                        toast.error(err.message || "Failed to submit review. Please try again.");
                                    } else {
                                        toast.success("Thank you for your feedback!");
                                        setTimeout(() => router.push('/'), 1500);
                                    }
                                }}
                                disabled={reviewSubmitted}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all ${reviewSubmitted
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : 'bg-[#fd6410] text-white hover:bg-[#e05600]'
                                    }`}
                            >
                                {reviewSubmitted ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Submitted
                                    </span>
                                ) : "Submit Review"}
                            </button>
                        </div>
                    )}

                    {sessionSummary?.status === 'expired' && (
                        <div className="w-full space-y-4">
                            <button onClick={() => router.push('/wallet')} className="w-full py-5 bg-[#fd6410] text-white rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(253,100,16,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
                                Recharge Wallet
                            </button>
                            <button onClick={() => router.push('/')} className={`w-full py-4 rounded-[24px] border ${isDarkMode ? 'border-white/5 text-gray-400' : 'border-black/5 text-gray-500'} font-bold transition-all text-sm uppercase tracking-widest`}>
                                Go to Home
                            </button>
                        </div>
                    )}
                    {sessionSummary?.status === 'terminated' && (
                        <div className="w-full space-y-4">
                            <button onClick={() => router.push('/')} className="w-full py-5 bg-[#fd6410] text-white rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(253,100,16,0.3)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest">
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
