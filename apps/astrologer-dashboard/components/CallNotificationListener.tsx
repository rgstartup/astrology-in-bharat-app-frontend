"use client";

import React, { useEffect } from "react";
import { callSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";

const { Phone, Video, Loader2 } = LucideIcons as any;

export const CallNotificationListener: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const expertId = user.profileId || user.id;

        const registerExpert = () => {
            console.log("[CallSocket] Registering expert:", expertId);
            callSocket.emit('register_expert', { expertId });
        };

        if (!callSocket.connected) {
            callSocket.connect();
        } else {
            registerExpert();
        }

        const onConnect = () => {
            console.log("[CallSocket] Connected. Registering expert...");
            registerExpert();
        };

        const handleNewCall = (data: any) => {
            console.log("[CallSocket] 🚨 New CALL request received:", data);
            const { session, token, roomName } = data;
            const callerName = session.user?.name || "A Client";
            const callType = session.type || 'audio';

            // Show interactive toast
            toast.info(
                (<div className="p-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                            {callType === 'video' ? <Video className="text-primary" /> : <Phone className="text-primary" />}
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wider text-neutral-800">Incoming {callType} Call</p>
                            <p className="text-xs font-bold text-neutral-500">{callerName} is calling...</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                toast.dismiss();
                                const route = callType === 'video'
                                    ? `/video/${session.id}`
                                    : `/call/${session.id}`;
                                router.push(route);
                            }}
                            className="flex-1 bg-primary text-white py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                        >
                            Accept & Join
                        </button>
                        <button
                            onClick={() => toast.dismiss()}
                            className="px-4 py-2.5 rounded-xl border-2 border-neutral-100 font-bold text-neutral-400 text-[10px] uppercase hover:bg-neutral-50 transition-all"
                        >
                            Ignore
                        </button>
                    </div>
                </div>),
                {
                    position: "bottom-right",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    className: "rounded-3xl shadow-2xl border border-primary/10 p-0 overflow-hidden",
                }
            );

            // Optional: Play ringtone
            const audio = new Audio('/sounds/ringtone.mp3');
            audio.play().catch(() => console.log("Audio play blocked by browser"));
        };

        callSocket.on('connect', onConnect);
        callSocket.on('new_call_request', handleNewCall);

        return () => {
            callSocket.off('connect', onConnect);
            callSocket.off('new_call_request', handleNewCall);
        };
    }, [isAuthenticated, user, router]);

    return null;
};
