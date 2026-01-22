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
    const [inputValue, setInputValue] = useState("");
    const [isActivating, setIsActivating] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [clientName, setClientName] = useState("Client");

    useEffect(() => {
        if (!sessionId || !isAuthenticated || !user) return;

        // 0. Fetch Session Status and Client Info
        const fetchSessionInfo = async () => {
            try {
                console.log("[ExpertChatDebug] Fetching status for session:", sessionId);

                // Fetch basic session info
                const sessionRes = await apiClient.get(`/chat/session/${sessionId}`);
                if (sessionRes.data) {
                    setSessionStatus(sessionRes.data.status);
                    if (sessionRes.data.user?.name) {
                        setClientName(sessionRes.data.user.name);
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
            console.log("[ExpertChatDebug] Session activated event received!", session);
            setSessionStatus('active');
            toast.success("Consultation started! Billing is now active.");
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
            chatSocket.disconnect();
        };
    }, [sessionId, isAuthenticated, user]);

    useEffect(() => {
        if (sessionStatus !== 'active') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev + 1);
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
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                            {clientName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 leading-tight">Consultation with {clientName}</h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${sessionStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                                {sessionStatus === 'active' ? 'Live Session' : sessionStatus === 'completed' ? 'Session Completed' : 'Waiting to start'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {sessionStatus === 'active' && (
                        <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 flex items-center gap-3">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-bold text-yellow-700 tabular-nums uppercase tracking-tight">Active: {formatTime(timeLeft)}</span>
                        </div>
                    )}

                    {sessionStatus === 'pending' && (
                        <button
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Power className="w-4 h-4" />
                            {isActivating ? 'Activating...' : 'Start Session'}
                        </button>
                    )}

                    {sessionStatus === 'active' && (
                        <button
                            onClick={handleEndChat}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-red-100 flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            End session
                        </button>
                    )}
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
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
                    <div key={msg.id} className={`flex ${msg.senderType === "expert" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] flex flex-col ${msg.senderType === "expert" ? "items-end" : "items-start"}`}>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
                                {msg.senderType === "expert" ? "You (Expert)" : "Client"}
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
                    <button className="p-3 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2 focus-within:border-yellow-600 focus-within:ring-1 focus-within:ring-yellow-600 transition-all">
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
                        className="bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:bg-yellow-700 active:scale-90 transition-all disabled:opacity-50"
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
