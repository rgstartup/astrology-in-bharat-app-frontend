"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatSocket } from "@/lib/socket";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";

const {
    ChevronLeft, Paperclip, Send, Clock, User, Phone,
    MoreVertical, Power, MessageSquare, AlertCircle
} = LucideIcons as any;

interface Message {
    id: number;
    senderId: number;
    senderType: "user" | "expert";
    content: string;
    type?: string;
    createdAt?: string;
}

function ExpertChatRoomContent() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const { user, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionStatus, setSessionStatus] = useState<'pending' | 'active' | 'completed'>('pending');
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0); // Count-up timer
    const [inputValue, setInputValue] = useState("");
    const [isActivating, setIsActivating] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [clientName, setClientName] = useState("Client");
    const [clientAvatar, setClientAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId || !isAuthenticated || !user) return;

        // 0. Fetch Session Status and Client Info
        const fetchSessionInfo = async () => {
            try {
                console.log("[ExpertChatDebug] Fetching status for session:", sessionId);

                // Fetch basic session info
                const sessionRes = await apiClient.get(`/chat/session/${sessionId}?_t=${Date.now()}`);
                if (sessionRes.data) {
                    const status = sessionRes.data.status;
                    setSessionStatus(status);
                    if (sessionRes.data.user?.name) {
                        setClientName(sessionRes.data.user.name);
                    }
                    if (sessionRes.data.user?.avatar) {
                        setClientAvatar(sessionRes.data.user.avatar);
                    }

                    // Pure sync from backend's improved fields
                    console.log("[ExpertChatDebug] Server Sync Data:", {
                        remainingSeconds: sessionRes.data.remainingSeconds,
                        elapsedSeconds: sessionRes.data.elapsedSeconds
                    });

                    if (sessionRes.data.remainingSeconds !== undefined) {
                        setTimeLeft(sessionRes.data.remainingSeconds);
                    }
                    if (sessionRes.data.elapsedSeconds !== undefined) {
                        setElapsedTime(sessionRes.data.elapsedSeconds);
                    }
                }

                // Fetch history
                const historyRes = await apiClient.get(`/chat/history/${sessionId}`);
                setMessages(historyRes.data);
            } catch (err) {
                console.error("Failed to fetch info:", err);
            }
        };
        fetchSessionInfo();

        // 2. Socket Connection
        chatSocket.connect();
        chatSocket.emit('join_room', { sessionId: parseInt(sessionId) });

        // Registration for general notifications
        const registrationId = user.profileId || user.id;
        chatSocket.emit('register_expert', { expertId: registrationId });

        chatSocket.on('new_message', (msg: Message) => {
            console.log("[ExpertChatDebug] New message received:", msg);
            setMessages((prev) => [...prev, msg]);
        });

        chatSocket.on('session_activated', (session: any) => {
            console.log("[ExpertChatDebug] Session activated socket event:", session);
            setSessionStatus('active');

            if (session.remainingSeconds !== undefined) {
                setTimeLeft(session.remainingSeconds);
            }
            if (session.elapsedSeconds !== undefined) {
                setElapsedTime(session.elapsedSeconds);
            }
            toast.success("Consultation started!");
        });

        chatSocket.on('session_ended', () => {
            console.log("[ExpertChatDebug] Session ended event received!");
            setSessionStatus('completed');
            toast.info("Session has ended.");
        });

        return () => {
            chatSocket.off('new_message');
            chatSocket.off('session_activated');
            chatSocket.off('session_ended');
            // Do NOT disconnect, as the shared socket is needed for global notifications (ChatNotificationListener)
            // chatSocket.disconnect(); 
        };
    }, [sessionId, isAuthenticated, user]);

    useEffect(() => {
        if (sessionStatus !== 'active') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [sessionStatus]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleActivate = async () => {
        setIsActivating(true);
        try {
            console.log("[ExpertChatDebug] Activating session...", sessionId);

            // 1. Socket hit (Instant/Real-time) - Do this first to mark status in Gateway
            chatSocket.emit('activate_session', { sessionId: parseInt(sessionId) });

            // 2. API call (Data Persistence)
            await apiClient.post(`/chat/activate/${sessionId}`);

            // Note: The UI will update via the 'session_activated' socket event
        } catch (err: any) {
            console.error("[ExpertChatDebug] Activation failed:", err);
            // If it's already active, we don't need to show an error
            if (err.response?.data?.message?.includes("active")) {
                setSessionStatus('active');
            } else {
                toast.error(err.response?.data?.message || "Failed to activate session");
            }
        } finally {
            setIsActivating(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || !sessionId || !user) return;

        const payload = {
            sessionId: parseInt(sessionId),
            senderId: user.id,
            senderType: 'expert',
            content: inputValue,
        };

        console.log("[ExpertChatDebug] Sending message:", payload);
        chatSocket.emit('send_message', payload);
        setInputValue("");
    };

    const handleEndChat = async () => {
        if (!confirm("Are you sure you want to end this consultation?")) return;
        try {
            await apiClient.post(`/chat/end/${sessionId}`);
            toast.success("Consultation finalized successfully.");

            // Small delay to allow backend to settle and socket events to propagate
            setTimeout(() => {
                router.push('/dashboard/appointment');
            }, 1000);
        } catch (err) {
            console.error("End session failed:", err);
            toast.error("Failed to end session");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#fd6410] to-[#ff8c4a] px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black overflow-hidden border border-white/30 shadow-sm">
                            {clientAvatar ? (
                                <img
                                    src={clientAvatar}
                                    alt={clientName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                clientName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-white leading-tight">Consultation with {clientName}</h2>
                            <p className="text-[10px] text-white/80 font-bold flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${sessionStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`}></span>
                                {sessionStatus === 'active' ? 'Live Session' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Timers Section */}
                    {sessionStatus === 'active' && (
                        <div className="flex items-center gap-4 md:gap-5">
                            {/* Active Duration - High Contrast */}
                            <div className="hidden sm:flex flex-col items-end gap-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">Elapsed</span>
                                <span className="text-sm md:text-base font-black tabular-nums text-white drop-shadow-sm leading-none">{formatTime(elapsedTime)}</span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-8 bg-white/20 hidden sm:block"></div>

                            {/* Time Left Capsule Design */}
                            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-4 border border-white/30 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-1.5 bg-white/10 rounded-full">
                                    <Clock className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">Time Left</span>
                                    <span className="text-sm md:text-base font-black tabular-nums text-white drop-shadow-sm leading-none">{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {sessionStatus === 'pending' && (
                        <button
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 border border-white/20"
                        >
                            <Power className="w-4 h-4" />
                            {isActivating ? 'Activating...' : 'Start Session'}
                        </button>
                    )}

                    {sessionStatus === 'active' && (
                        <button
                            onClick={handleEndChat}
                            className="bg-white text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center gap-2 border border-white/20"
                        >
                            <AlertCircle className="w-4 h-4" />
                            End session
                        </button>
                    )}
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url('/images/back-image.webp')", // Dark overlay + Image
                backgroundRepeat: "repeat",
                backgroundSize: "300px",
                backgroundColor: "#f9fafb" // Fallback color
            }}>
                {sessionStatus === 'pending' && (
                    <div className="flex justify-center my-4">
                        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-2xl text-xs font-bold border border-yellow-200 flex items-center gap-2 shadow-sm">
                            <MessageSquare className="w-4 h-4" />
                            SESSION IS NOT YET ACTIVE. CLICK "START SESSION" TO BEGIN CONSULTATION.
                        </div>
                    </div>
                )}

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
                        <MessageSquare className="w-20 h-20 mb-4" />
                        <p className="font-bold text-lg uppercase tracking-widest">No messages yet</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.senderType === "expert" ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-yellow-100 flex items-center justify-center text-[10px] font-bold text-yellow-700">
                            {msg.senderType === "expert" ? (
                                user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'E'
                                )
                            ) : (
                                clientAvatar ? (
                                    <img src={clientAvatar} className="w-full h-full object-cover" />
                                ) : (
                                    clientName.charAt(0)
                                )
                            )}
                        </div>

                        {/* Message Content */}
                        <div className={`max-w-[70%] flex flex-col ${msg.senderType === "expert" ? "items-end" : "items-start"}`}>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
                                {msg.senderType === "expert" ? "You (Expert)" : (clientName || "Client")}
                            </span>
                            <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.senderType === "expert"
                                ? "bg-yellow-600 text-white rounded-tr-none"
                                : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <p className={`text-[9px] mt-1 opacity-60 font-bold ${msg.senderType === "expert" ? "text-white" : "text-gray-400"}`}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                    <button className="p-3 text-gray-400 hover:text-[#fd6410] hover:bg-orange-50 rounded-xl transition-all">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2 focus-within:border-[#fd6410] focus-within:ring-1 focus-within:ring-[#fd6410] transition-all">
                        <textarea
                            rows={1}
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-gray-400 resize-none min-h-[40px] max-h-32 py-2"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`p-4 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center ${!inputValue.trim()
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#fd6410] text-white hover:bg-[#e35d0f] shadow-orange-200'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ExpertChatRoom() {
    return (
        <Suspense fallback={<div>Loading chat session...</div>}>
            <ExpertChatRoomContent />
        </Suspense>
    );
}
