"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import apiClient from "@/libs/api-profile";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";

import { getActiveChatSessions, getPendingChatSessions } from "@/libs/api-profile";

const { MessageSquare, X } = LucideIcons as any;

export default function FloatingChatButton() {
    const [activeSession, setActiveSession] = useState<any>(null);
    const [position, setPosition] = useState({ x: 24, y: 24 }); // Bottom-right offset
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const { isClientAuthenticated, clientUser } = useClientAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isClientAuthenticated) return;

        const checkActiveSession = async () => {
            try {
                // Securely fetch the active session for this client from backend
                const response = await apiClient.get('/chat/sessions/active-client');
                const session = response.data;

                console.log("[FloatingChatDebug] Backend response:", session);

                if (session && (session.status === 'active' || session.status === 'pending')) {
                    setActiveSession(session);
                } else {
                    setActiveSession(null);
                }
            } catch (error) {
                // Silent catch, session might simply not exist
                setActiveSession(null);
            }
        };

        checkActiveSession();
        const interval = setInterval(checkActiveSession, 20000); // Check every 20s
        return () => clearInterval(interval);
    }, [isClientAuthenticated]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: window.innerHeight - e.clientY - position.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        // Calculate new position from bottom-right
        const newX = e.clientX - dragStart.x;
        const newY = window.innerHeight - e.clientY - dragStart.y;

        // Constrain to screen
        const constrainedX = Math.max(20, Math.min(window.innerWidth - 80, newX));
        const constrainedY = Math.max(20, Math.min(window.innerHeight - 80, newY));

        setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!activeSession) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: `${position.y}px`,
                right: `${position.x}px`,
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className="z-[9999] animate-in fade-in zoom-in duration-500"
        >
            <style>
                {`
                @keyframes pulse-ring {
                    0% { transform: scale(.33); }
                    80%, 100% { opacity: 0; }
                }
                .pulse-ring-active::before {
                    content: '';
                    position: absolute;
                    display: block;
                    width: 250%;
                    height: 250%;
                    box-sizing: border-box;
                    margin-left: -75%;
                    margin-top: -75%;
                    border-radius: 50%;
                    background-color: #fd6410;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    pointer-events: none;
                    z-index: 1;
                }
                `}
            </style>

            <div className="relative group">
                {/* Floating Content */}
                <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 group-hover:scale-100">
                    <span className="bg-white/90 backdrop-blur-md text-[#2A0A0A] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl border border-orange-500/20">
                        {activeSession.expert?.user?.name || "Expert"} is waiting
                    </span>
                    <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-tighter self-end shadow-sm animate-pulse">
                        Return to Chat
                    </span>
                </div>

                {/* Main Action Button */}
                <button
                    onMouseDown={handleMouseDown}
                    onClick={() => {
                        if (!isDragging) {
                            router.push(`/chat/room/${activeSession.expertId}?sessionId=${activeSession.id}`);
                        }
                    }}
                    className={`relative w-16 h-16 bg-gradient-to-tr from-[#fd6410] to-[#ff8c4a] rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(253,100,16,0.4)] hover:shadow-[0_20px_60px_rgba(253,100,16,0.6)] transition-all active:scale-90 cursor-grab active:cursor-grabbing border-4 border-white overflow-visible`}
                >
                    <div className="absolute inset-0 pulse-ring-active"></div>
                    <div className="relative z-10">
                        <MessageSquare className="w-7 h-7 text-white fill-white/20" />
                    </div>

                    {/* Tiny notification dot */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full z-20 animate-bounce shadow-md"></div>
                </button>
            </div>
        </div>
    );
}
