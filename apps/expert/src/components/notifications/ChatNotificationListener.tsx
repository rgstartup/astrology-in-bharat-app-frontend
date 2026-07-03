"use client";

import React, { useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { chatSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

export const ChatNotificationListener: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleReject = async (sessionId: string) => {
        toast.dismiss();
        const [_, error] = await api.post(`/consultations/reject/${sessionId}`);
        if (error) {
            console.error("[ChatNotification] Failed to reject session:", error);
        }
    };

    const registerExpert = useCallback(() => {
        if (!user) return;
        const registrationId = user.profileId || user.id;
        chatSocket.emit('register_expert', { expert_id: registrationId });
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const registrationId = user.profileId || user.id;

        const onConnect = () => {
            console.log('[ChatNotification] ✅ Socket connected! Registering expert:', registrationId);
            chatSocket.emit('register_expert', { expert_id: registrationId });
        };

        const handleNewRequest = (session: any) => {
            console.log('[ChatNotification] 🔔 New chat request received:', session);
            const isFree = !!session.isFree;
            const callerName = session.user?.name || "A Client";
            const callerAvatar = 
                session.user?.avatar || 
                session.user?.image || 
                session.user?.profile_client?.profile_picture || 
                session.user_image;

            toast.info(
                (<div className="p-2">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-500/20">
                                {callerAvatar ? (
                                    <img src={callerAvatar} alt="Caller" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xl">
                                        {callerName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                            </div>
                            {/* Pulsing ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-40" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">New Chat Request</h4>
                                {isFree && (
                                    <span className="bg-green-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full">FREE</span>
                                )}
                            </div>
                            <p className="text-sm font-black text-neutral-900 leading-tight">{callerName}</p>
                            <p className="text-[10px] font-bold text-neutral-400 mt-0.5 italic">
                                {isFree ? "First free consultation initiated!" : "Client is waiting for you..."}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                toast.dismiss();
                                router.push(`/dashboard/chat/${session.id}`);
                            }}
                            className="flex-[2] bg-[#fd6410] text-white py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:bg-[#e55a0e] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Accept & Join
                        </button>
                        <button
                            onClick={() => handleReject(session.id)}
                            className="flex-1 bg-neutral-100 text-neutral-400 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-neutral-200 transition-all border border-neutral-200/50"
                        >
                            Ignore
                        </button>
                    </div>
                </div>),
                {
                    containerId: "notification",
                    position: "bottom-right",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    className: "rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 p-2 bg-white/95 backdrop-blur-md overflow-hidden max-w-[95vw] mx-auto sm:min-w-[320px] !mb-2 mt-2",
                }
            );
        };

        const handleSessionEnded = (data: any) => {
            if (window.location.pathname.includes(`/dashboard/chat/${data.id || data.sessionId}`)) return;

            const total = data?.split?.totalAmount || data?.total_cost || 0;
            const expertShare = data?.split?.expertShare || (total * 0.8);

            toast.success(
                (<div className="p-1">
                    <p className="font-black text-sm text-neutral-800">Chat Consultation Ended</p>
                    <div className="mt-2 p-3 bg-green-50 rounded-2xl border border-green-100">
                        <div className="flex justify-between text-[10px] font-bold text-green-700 uppercase tracking-wider">
                            <span>Client Paid:</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-green-800 mt-1">
                            <span>Your Earning:</span>
                            <span>₹{expertShare}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2 italic font-bold text-center uppercase tracking-widest">Credited to your wallet</p>
                </div>),
                {
                    position: "top-right",
                    autoClose: 10000,
                    className: "rounded-3xl shadow-xl border border-green-100",
                }
            );
        };

        // Register listeners
        chatSocket.on('connect', onConnect);
        chatSocket.on('new_chat_request', handleNewRequest);
        chatSocket.on('session_ended', handleSessionEnded);

        // If already connected, register immediately
        if (chatSocket.connected) {
            console.log('[ChatNotification] Already connected, registering expert immediately:', registrationId);
            chatSocket.emit('register_expert', { expert_id: registrationId });
        } else {
            console.log('[ChatNotification] Socket not connected yet, will register on connect...');
            chatSocket.connect();
        }

        return () => {
            chatSocket.off('new_chat_request', handleNewRequest);
            chatSocket.off('session_ended', handleSessionEnded);
            chatSocket.off('connect', onConnect);
        };
    }, [isAuthenticated, user, router, registerExpert]);

    return null;
};


