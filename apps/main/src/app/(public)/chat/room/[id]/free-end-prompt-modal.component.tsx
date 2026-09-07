"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

const { Clock } = LucideIcons as any;

type FreeEndPromptModalProps = {
    showFreeEndPrompt: boolean;
    isDarkMode: boolean;
    continuationTimer: number;
    freeLimitData: any;
    expertData: any;
    router: any;
    chatSocket: any;
    sessionId: string | null;
    handleEndChat: () => void;
};

export default function FreeEndPromptModal({
    showFreeEndPrompt,
    isDarkMode,
    continuationTimer,
    freeLimitData,
    expertData,
    router,
    chatSocket,
    sessionId,
    handleEndChat
}: FreeEndPromptModalProps) {
    if (!showFreeEndPrompt) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1a0c0c] border-white/10' : 'bg-[#1A1A1A] border-[#fd6410]/20'} w-full max-w-sm rounded-[32px] overflow-hidden border p-8 text-center shadow-2xl relative`}>
                {/* 30s Countdown Ring */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-[#fd6410]/20 flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#fd6410]">{continuationTimer}s</span>
                </div>

                <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Clock className="w-7 h-7 text-yellow-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Free Time Ended</h3>
                <p className="text-xs opacity-60 leading-relaxed mb-6">
                    {freeLimitData?.message || `Your free consultation is over. Continue at ₹${freeLimitData?.expertPrice || expertData.price}/min?`}
                </p>

                {freeLimitData?.requireRecharge && (
                    <div className="mb-6 p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 text-[10px] font-bold uppercase">
                        ⚠️ Low Balance: ₹{freeLimitData?.balance || 0}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {freeLimitData?.requireRecharge ? (
                        <button onClick={() => router.push('/client/profile?tab=wallet')} className="w-full py-5 bg-[#fd6410] text-white rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(253,100,16,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
                            Recharge Wallet
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                chatSocket.emit('confirm_paid_continuation', { sessionId: sessionId });
                            }}
                            className="w-full py-4 bg-[#fd6410] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Continue Chat
                        </button>
                    )}
                    <button
                        onClick={handleEndChat}
                        className={`w-full py-4 rounded-2xl border ${isDarkMode ? 'border-white/5 text-gray-400' : 'border-gray-800 text-gray-400'} font-bold text-xs uppercase tracking-widest hover:bg-red-500/5 hover:text-red-500 transition-all`}
                    >
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );
}
