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

        const registerExpert = () => {
            console.log("[ChatNotificationDebug] Registering expert PROFILE ID:", registrationId);
            chatSocket.emit('register_expert', { expertId: registrationId }, (res: any) => {
                console.log("[ChatNotificationDebug] Registration acknowledgment:", res);
            });
        };

        const setupSocket = () => {
            console.log("[ChatNotificationDebug] Setting up socket... Status:", chatSocket.connected ? "Connected" : "Disconnected");

            if (!chatSocket.connected) {
                chatSocket.connect();
            } else {
                // If already connected, register immediately
                registerExpert();
            }
        };

        setupSocket();

        // Ensure we re-register on reconnection (crucial for notifications)
        const onConnect = () => {
            console.log("[ChatNotificationDebug] Socket reconnected automatically. Re-registering expert...");
            registerExpert();
        };

        chatSocket.on('connect', onConnect);

        // Listen for new requests
        const handleNewRequest = (session: any) => {
            console.log("[ChatNotificationDebug] 🚨 New chat request RECEIVED:", session);

            const isFree = !!session.isFree;

            // Show a custom toast with an action
            toast.info(
                (<div>
                    <div className="flex items-center justify-between">
                        <p className="font-bold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> New Chat Request!
                        </p>
                        {isFree && (
                            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border border-green-200">
                                FREE
                            </span>
                        )}
                    </div>
                    <p className="text-xs mt-1">
                        {isFree
                            ? "A client has initiated their FIRST FREE consultation!"
                            : "A client is waiting for you to join the session."}
                    </p>
                    {session.expiresAt && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 animate-pulse">
                            ⏳ Be quick! This request expires soon.
                        </p>
                    )}
                    <button
                        onClick={() => {
                            toast.dismiss();
                            router.push(`/chat/${session.id}`);
                        }}
                        className="mt-2 w-full bg-yellow-600 text-white px-3 py-2 rounded text-[10px] font-bold uppercase transition hover:bg-yellow-700 shadow-sm"
                    >
                        Accept & Start Chat
                    </button>
                </div>),
                {
                    position: "bottom-right", // Changed from top-right to bottom-right as per common dashboard UX
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
            chatSocket.off('connect', onConnect);
        };
    }, [isAuthenticated, user, router]);

    return null;
};


