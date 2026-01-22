"use client";

import React, { useEffect } from "react";
import { chatSocket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";

const { MessageSquare } = LucideIcons as any;

export const ChatNotificationListener: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            console.log("[ChatNotificationDebug] Not authenticated, skipping socket setup");
            return;
        }

        const registrationId = user.profileId || user.id;

        const setupSocket = () => {
            console.log("[ChatNotificationDebug] Setting up socket... Status:", chatSocket.connected ? "Connected" : "Disconnected");

            if (!chatSocket.connected) {
                chatSocket.connect();
            }

            console.log("[ChatNotificationDebug] Registering expert PROFILE ID:", registrationId);
            chatSocket.emit('register_expert', { expertId: registrationId }, (res: any) => {
                console.log("[ChatNotificationDebug] Registration acknowledgment:", res);
            });
        };

        setupSocket();

        // Listen for new requests
        const handleNewRequest = (session: any) => {
            console.log("[ChatNotificationDebug] 🚨 New chat request RECEIVED:", session);

            // Show a custom toast with an action
            toast.info(
                (<div>
                    <p className="font-bold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> New Chat Request!
                    </p>
                    <p className="text-xs mt-1">A client is waiting for you.</p>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            router.push(`/chat/${session.id}`);
                        }}
                        className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase transition hover:bg-yellow-700"
                    >
                        Accept & Chat
                    </button>
                </div>),
                {
                    position: "top-right",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                }
            );
        };

        chatSocket.on('new_chat_request', handleNewRequest);

        return () => {
            console.log("[ChatNotificationDebug] Cleaning up listeners");
            chatSocket.off('new_chat_request', handleNewRequest);
        };
    }, [isAuthenticated, user, router]);

    return null;
};
