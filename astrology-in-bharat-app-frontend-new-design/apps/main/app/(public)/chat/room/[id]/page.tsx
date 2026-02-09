"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import { chatSocket } from "@/libs/socket";
import apiClient from "@/libs/api-profile";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { toast } from "react-toastify";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

const Image = NextImage as any;
const {
    ChevronLeft, Paperclip, Send, Clock, Star, Phone, MoreVertical, Wallet, X, Home, User: UserIcon, Sun, Moon, AlertTriangle, AlertCircle
} = LucideIcons as any;

interface Message {
    id: number;
    senderId: number;
    senderType: "user" | "expert";
    content: string;
    type?: string;
    createdAt?: string;
}

// Waiting Countdown Component for User Side
function WaitingCountdown({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    useEffect(() => {
        const calculateSeconds = () => {
            const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
            if (diff <= 0) {
                setSecondsLeft(0);
                setTimeout(onExpire, 1000); // Small buffer before showing ended state
                return true; // Finished
            } else {
                setSecondsLeft(diff);
                return false;
            }
        };

        const finished = calculateSeconds();
        if (finished) return;

        const interval = setInterval(() => {
            if (calculateSeconds()) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 bg-black/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-orange-500 font-black tabular-nums text-xs">
                    Auto-Expires in: {mins}:{secs.toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );
}

function ChatRoomContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const sessionId = searchParams.get('sessionId');

    const { clientUser, isClientAuthenticated, refreshBalance } = useClientAuth();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0); // Initialize at 0
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionStatus, setSessionStatus] = useState<'pending' | 'active' | 'completed'>('pending');
    const [expertData, setExpertData] = useState<any>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [isFree, setIsFree] = useState<boolean>(false);
    const [freeMinutes, setFreeMinutes] = useState<number>(0);
    const [showFreeEndPrompt, setShowFreeEndPrompt] = useState(false);
    const [freeLimitData, setFreeLimitData] = useState<any>(null);
    const [continuationTimer, setContinuationTimer] = useState<number>(30);

    // Review States
    const [reviewRating, setReviewRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>("");
    const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
    const [reviewLoading, setReviewLoading] = useState<boolean>(false);

    const [sessionSummary, setSessionSummary] = useState<any>(null);
    const [inputValue, setInputValue] = useState("");
    const [typingStatus, setTypingStatus] = useState<{ senderName: string; isTyping: boolean } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Fetch Expert Data
    useEffect(() => {
        const fetchExpertData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/expert/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setExpertData({
                        id: data.id,
                        userId: data.user?.id,
                        image: data.user?.avatar || "/images/astro-img1.png",
                        name: data.user?.name || "Astrologer",
                        expertise: data.specialization || "Vedic Astrology",
                        experience: data.experience_in_years || 0,
                        language: data.languages?.join(", ") || "Hindi",
                        price: data.chat_price || data.price || 0,
                        ratings: data.rating || 5,
                        is_available: data.is_available || false,
                        total_likes: data.total_likes || 0,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch expert data:", error);
            }
        };
        if (id) fetchExpertData();
    }, [id, API_BASE_URL]);

    useEffect(() => {
        if (!sessionId || !isClientAuthenticated) return;

        // 1. Fetch History & Session Info
        const fetchInitialData = async () => {
            try {
                // Fetch history
                const historyRes = await apiClient.get(`/chat/history/${sessionId}`);
                setMessages(historyRes.data);

                // Fetch session details for expiresAt
                const sessionRes = await apiClient.get(`/chat/session/${sessionId}?_t=${Date.now()}`);
                if (sessionRes.data) {
                    console.log(`[UserChatDebug] Session Data Loaded: Status=${sessionRes.data.status}, maxMinutes=${sessionRes.data.maxMinutes}, isFree=${sessionRes.data.isFree}`);
                    setExpiresAt(sessionRes.data.expiresAt);
                    setSessionStatus(sessionRes.data.status);

                    const freeChat = !!sessionRes.data.isFree;
                    const mins = sessionRes.data.freeMinutes || 0;
                    setIsFree(freeChat);
                    setFreeMinutes(mins);

                    // Pure sync from backend's improved fields
                    console.log("[UserChatDebug] Server Sync Data:", {
                        status: sessionRes.data.status,
                        remainingSeconds: sessionRes.data.remainingSeconds,
                        elapsedSeconds: sessionRes.data.elapsedSeconds,
                        expiresAt: sessionRes.data.expiresAt
                    });

                    if (sessionRes.data.remainingSeconds !== undefined) {
                        setTimeLeft(sessionRes.data.remainingSeconds);
                    }
                    if (sessionRes.data.elapsedSeconds !== undefined) {
                        setElapsedTime(sessionRes.data.elapsedSeconds);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch initial chat data:", err);
            }
        };
        fetchInitialData();

        // 2. Socket Connection
        console.log("[UserChatDebug] Connecting to chat socket for session:", sessionId);
        chatSocket.connect();

        const onConnect = () => {
            console.log("[UserChatDebug] Socket connected, joining room:", sessionId);
            chatSocket.emit('join_room', { sessionId: parseInt(sessionId) });
        };

        if (chatSocket.connected) {
            onConnect();
        } else {
            chatSocket.on('connect', onConnect);
        }

        chatSocket.on('new_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        chatSocket.on('free_limit_reached', (data: any) => {
            console.log("[UserChatDebug] Free limit reached:", data);
            setFreeLimitData(data);
            setShowFreeEndPrompt(true);
            setContinuationTimer(30);
        });

        chatSocket.on('continuation_confirmed', (data: any) => {
            console.log("[UserChatDebug] Continuation confirmed:", data);
            setShowFreeEndPrompt(false);
            toast.success("Chat continued in paid mode!");
        });

        chatSocket.on('session_activated', (session: any) => {
            console.log("[UserChatDebug] Session activated socket event:", session);
            setSessionStatus('active');

            if (session.remainingSeconds !== undefined) {
                setTimeLeft(session.remainingSeconds);
            }
            if (session.elapsedSeconds !== undefined) {
                setElapsedTime(session.elapsedSeconds);
            }

            toast.success("Consultation Started!");
        });

        chatSocket.on('balance_warning', (data: { message: string }) => {
            toast.warning(data.message);
        });

        chatSocket.on('balance_updated', (data: { maxMinutes?: number }) => {
            console.log("[UserChatDebug] Balance updated:", data);
            if (data.maxMinutes) {
                setTimeLeft(data.maxMinutes * 60);
            }
        });

        chatSocket.on('session_ended', (data: any) => {
            console.log("[UserChatDebug] Session ended event received", data);
            setSessionStatus(data.status === 'expired' ? 'completed' : 'completed');

            // We use 'completed' for UI state, but use data.status for Modal content
            setSessionSummary(data);
            setShowModal(true);
        });

        chatSocket.on('typing_status', (data: { senderName: string; isTyping: boolean }) => {
            setTypingStatus(data.isTyping ? data : null);
        });

        return () => {
            console.log("[UserChatDebug] Cleaning up listeners");
            chatSocket.off('connect', onConnect);
            chatSocket.off('new_message');
            chatSocket.off('session_activated');
            chatSocket.off('balance_warning');
            chatSocket.off('session_ended');
            chatSocket.off('typing_status');
            chatSocket.disconnect();
        };
    }, [sessionId, isClientAuthenticated]);

    useEffect(() => {
        if (!showFreeEndPrompt || continuationTimer <= 0) return;
        const interval = setInterval(() => {
            setContinuationTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowFreeEndPrompt(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showFreeEndPrompt, continuationTimer]);

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

    const handleSendMessage = () => {
        if (!inputValue.trim() || !sessionId || !clientUser) return;

        const payload = {
            sessionId: parseInt(sessionId),
            senderId: clientUser.id,
            senderType: 'user',
            content: inputValue,
        };
        chatSocket.emit('send_message', payload);
        setInputValue("");
    };

    const handleEndChat = () => {
        if (!sessionId) return;
        if (!confirm("Are you sure you want to end this session?")) return;

        // New Backend Logic: Emit 'end_chat' event directly
        console.log("[UserChatDebug] Emitting end_chat socket event:", sessionId);
        chatSocket.emit('end_chat', { sessionId: parseInt(sessionId) });

        // Note: We don't need to manually update state here.
        // The backend will broadcast 'session_ended', which triggers our listener to show the Summary Modal.
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            toast.warning("Please select a rating before submitting");
            return;
        }

        setReviewLoading(true);
        try {
            await apiClient.post('/reviews', {
                sessionId: parseInt(sessionId || '0'),
                expertId: parseInt(id || '0'),
                rating: reviewRating,
                comment: reviewComment.trim()
            });

            setReviewSubmitted(true);
            toast.success("Thank you for your feedback!");

            // Close modal and redirect after 2 seconds
            setTimeout(() => {
                setShowModal(false);
                router.push('/');
            }, 2000);
        } catch (error: any) {
            console.error("Failed to submit review:", error);
            const errorMsg = error.response?.data?.message || "Failed to submit review";
            toast.error(errorMsg);
        } finally {
            setReviewLoading(false);
        }
    };

    // Loading fallback during data fetch
    if (!expertData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#1a0c0c]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fd6410]"></div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#1a0c0c] text-white' : 'bg-[#FFF9F5] text-[#2A0A0A]'} overflow-hidden font-outfit transition-colors duration-500`}>
            {/* Header */}
            <header className="bg-[#fd6410] px-4 md:px-8 py-1.5 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-black/10">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1.5 hover:bg-black/10 rounded-xl transition-all active:scale-90 flex flex-col items-center">
                        <ChevronLeft className="w-5 h-5 text-white" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-white">Back</span>
                    </button>
                    <div className="w-px h-6 bg-black/10 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/20 overflow-hidden relative shadow-sm">
                            <Image src={expertData.image} alt={expertData.name} width={40} height={40} className="object-cover" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-sm leading-none text-white flex items-center gap-2">
                                {expertData.name}
                                {isFree && <span className="bg-white text-[#fd6410] px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm animate-bounce">Free Chat</span>}
                            </h1>
                            <p className="text-[9px] text-white/80 flex items-center gap-1 mt-0.5">
                                {sessionStatus === 'active' ? 'Live Session' : sessionStatus === 'completed' ? 'Session Ended' : 'Waiting for Expert'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
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
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">
                                        {isFree ? 'Free Time' : 'Time Left'}
                                    </span>
                                    <span className="text-sm md:text-base font-black tabular-nums text-white drop-shadow-sm leading-none">{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {sessionStatus === 'active' && (
                        <button
                            onClick={handleEndChat}
                            className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-bold text-xs md:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 mx-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">End Session</span>
                        </button>
                    )}

                    <div className="w-px h-6 bg-black/10 mx-1 hidden md:block"></div>

                    {/* Nav Buttons & Toggle */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => router.push('/')} className="p-2 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white">
                            <Home className="w-4 h-4" />
                            <span className="text-[8px] font-bold uppercase">Home</span>
                        </button>
                        <button onClick={() => router.push('/profile')} className="p-2 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white">
                            <UserIcon className="w-4 h-4" />
                            <span className="text-[8px] font-bold uppercase">Profile</span>
                        </button>
                        <div className="w-px h-5 bg-black/10 mx-1"></div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-inner"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Chat Section */}
                <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#2A0A0A]' : 'bg-[#FFF9F5]'} relative transition-colors duration-500`}>
                    {/* Welcome Banner */}
                    <div className={`md:hidden ${isDarkMode ? 'bg-[#3D1414]' : 'bg-[#FFF1E6]'} py-2 px-4 flex justify-between items-center border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#fd6410]'}`}>
                            {sessionStatus === 'active' ? 'Session Live' : sessionStatus === 'completed' ? 'Finished' : 'Initializing...'}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] opacity-50">Secure Connection</span>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="flex justify-center mb-10">
                                <div className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${isDarkMode ? 'bg-white/5 opacity-30 border-white/5' : 'bg-[#fd6410]/10 text-[#fd6410] border-[#fd6410]/20'}`}>
                                    {sessionStatus === 'active' ? 'Consultation in Progress' : sessionStatus === 'completed' ? 'Session Ended' : 'Start your celestial journey'}
                                </div>
                            </div>

                            {/* ... (rest of messages mapping identical) ... */}
                            {messages.map((msg: Message) => (
                                <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.senderType === "user" ? "flex-row-reverse" : "flex-row"} items-start`}>
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ${msg.senderType === "user" ? "border-white/10" : "border-[#fd6410]/30"} overflow-hidden shadow-lg flex items-center justify-center bg-[#fd6410]`}>
                                            {msg.senderType === "user" && clientUser?.avatar ? (
                                                <Image
                                                    src={clientUser.avatar}
                                                    alt="You"
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : msg.senderType === "expert" && expertData.image ? (
                                                <Image
                                                    src={expertData.image}
                                                    alt={expertData.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-xs">
                                                    {msg.senderType === "user" ? (clientUser?.name?.charAt(0) || 'U') : (expertData.name?.charAt(0) || 'E')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`flex flex-col ${msg.senderType === "user" ? "items-end" : msg.senderType === "admin" ? "items-center w-full" : "items-start"} max-w-[85%] md:max-w-[70%] ${msg.senderType === "admin" ? "mx-auto" : ""}`}>
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-30 mb-1 px-2">
                                            {msg.senderType === "user" ? "You" : msg.senderType === "admin" ? "System Message" : expertData.name}
                                        </span>
                                        <div className={`w-full ${msg.senderType === "user"
                                            ? "bg-gradient-to-br from-[#fff9f2] to-[#fff3e6] text-[#2A0A0A] rounded-2xl rounded-br-none px-5 py-3 md:px-6 md:py-4"
                                            : msg.senderType === "admin"
                                                ? "bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl px-5 py-3 md:px-6 md:py-4 text-center font-bold"
                                                : "bg-white text-[#2A0A0A] rounded-2xl rounded-bl-none px-5 py-3 md:px-6 md:py-4"
                                            } shadow-xl relative transition-all hover:scale-[1.01]`}>
                                            <p className="text-[14px] md:text-base leading-relaxed">{msg.content}</p>
                                            <div className={`mt-1 flex ${msg.senderType === "user" ? "justify-end" : msg.senderType === "admin" ? "justify-center" : "justify-start"} text-black font-medium text-[10px] opacity-40`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {typingStatus && (
                                <div className="flex items-center gap-3 animate-pulse pl-4 py-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-[#fd6410] rounded-full drop-shadow-[0_0_8px_rgba(253,100,16,0.6)]"></div>
                                        <div className="w-2 h-2 bg-[#fd6410] rounded-full delay-100"></div>
                                        <div className="w-2 h-2 bg-[#fd6410] rounded-full delay-200"></div>
                                    </div>
                                    <span className={`text-xs font-bold italic ${isDarkMode ? 'text-[#fd6410]/80' : 'text-[#fd6410]'}`}>{typingStatus.senderName} is reflecting on your stars...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Footer / Input Area */}
                    <div className={`p-4 md:p-6 ${isDarkMode ? 'bg-[#1a0c0c]' : 'bg-white'} border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'} transition-colors duration-500`}>
                        <div className="max-w-4xl mx-auto">
                            {sessionStatus === 'active' ? (
                                <div className="flex items-end gap-3 md:gap-4">
                                    <button className={`w-12 h-12 md:w-14 md:h-14 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} rounded-2xl flex items-center justify-center transition-all active:scale-95 border ${isDarkMode ? 'border-white/5' : 'border-black/5'} group`}>
                                        <Paperclip className="w-5 h-5 md:w-6 md:h-6 text-[#fd6410] group-hover:scale-110 transition" />
                                    </button>
                                    <div className={`flex-1 ${isDarkMode ? 'bg-white/5 focus-within:bg-black/20 border-white/5 focus-within:border-[#fd6410]/50' : 'bg-gray-100 focus-within:bg-white border-transparent focus-within:border-[#fd6410]/30'} rounded-[24px] px-6 py-3 md:py-4 flex items-center border transition-all shadow-2xl`}>
                                        <textarea
                                            rows={1}
                                            placeholder="Ask about your future, career, or love life..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className={`bg-transparent border-none outline-none ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'} text-[15px] md:text-base w-full placeholder:text-gray-500 resize-none max-h-32`}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-[#fd6410] to-[#ff914d] rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 active:scale-90 hover:brightness-110 transition-all"
                                    >
                                        <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    {sessionStatus === 'pending' ? (
                                        <div className={`space-y-3 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
                                            {isFree && (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-2 mb-2 inline-block animate-pulse">
                                                    <p className="text-green-500 font-black text-[10px] uppercase tracking-widest">🎉 Congratulations! You have {freeMinutes} mins FREE</p>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-2 h-2 bg-[#fd6410] rounded-full animate-ping"></div>
                                                <p className="font-black text-sm uppercase tracking-widest text-[#fd6410]">Expert is joining...</p>
                                            </div>
                                            {expiresAt && <WaitingCountdown expiresAt={expiresAt} onExpire={() => setSessionStatus('completed')} />}
                                            <p className="text-[11px] font-bold text-orange-500/80 max-w-sm mx-auto leading-relaxed px-4">
                                                Important: If the expert does not accept your request within the timer above, this session will expire automatically for your security.
                                            </p>
                                            <p className="text-[9px] opacity-40 max-w-xs mx-auto leading-relaxed">Please do not refresh or close this window while connecting.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertTriangle className="w-6 h-6 text-red-500 opacity-50" />
                                            <p className="text-red-500/50 font-black uppercase tracking-widest text-xs">
                                                This consultation session has ended
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-2 opacity-20 pt-4 text-center">
                                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-white' : 'text-black'}`}>Encrypted & Confidential</span>
                                {sessionStatus === 'active' && <button onClick={handleEndChat} className="text-[10px] text-red-500 uppercase font-black tracking-widest ml-4 hover:underline">End Session</button>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`hidden lg:flex flex-col w-[380px] ${isDarkMode ? 'bg-[#1a0c0c] border-white/5' : 'bg-[#FFF1E6] border-black/5'} border-l p-6 space-y-6 overflow-y-auto transition-colors duration-500`}>
                    <div className="scale-90 origin-top">
                        <AstrologerCard astrologerData={expertData} />
                    </div>
                </aside>
            </div>

            {/* Session Summary Modal */}
            {
                showModal && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 ${isDarkMode ? 'bg-[#0a0505]/95' : 'bg-black/60'} backdrop-blur-xl animate-in fade-in duration-500`}>
                        <div className={`${isDarkMode ? 'bg-[#1a0c0c]' : 'bg-white'} w-full max-w-md rounded-[32px] overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-[#fd6410]/20'} shadow-[0_0_50px_rgba(253,100,16,0.15)] animate-in zoom-in-95 duration-300 relative max-h-[90vh] flex flex-col`}>
                            <div className="p-6 md:p-8 flex flex-col items-center text-center relative z-10 overflow-y-auto custom-scrollbar">

                                <h2 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-[#2A0A0A]'} tracking-tight uppercase`}>
                                    {sessionSummary?.status === 'expired' ? 'Session Expired' : 'Session Summary'}
                                </h2>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[11px] font-bold tracking-widest uppercase mb-6`}>
                                    {sessionSummary?.status === 'expired' ? 'Expert missed the request' : 'Consulation Finished'}
                                </p>

                                <div className={`w-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl p-5 mb-6 space-y-3 flex-shrink-0`}>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-50 font-bold uppercase tracking-tighter">Total Duration</span>
                                        <span className="font-black">{sessionSummary?.durationMins || 0} Minutes</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-50 font-bold uppercase tracking-tighter">Charge per minute</span>
                                        <span className="font-black">₹{sessionSummary?.pricePerMinute || 0}</span>
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
                                        <span className="text-xl font-black">₹{sessionSummary?.totalCost || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs opacity-60">
                                        <span>Remaining Balance</span>
                                        <span className="font-black">₹{Math.floor(sessionSummary?.remainingBalance || 0)}</span>
                                    </div>
                                </div>

                                {/* Review Section - Show only if NOT expired */}
                                {sessionSummary?.status !== 'expired' && (
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
                                                if (reviewRating === 0) {
                                                    toast.warning("Please select a rating before submitting");
                                                    return;
                                                }

                                                try {
                                                    setReviewSubmitted(true);

                                                    // Real API call to backend
                                                    await apiClient.post('/reviews', {
                                                        sessionId: parseInt(sessionId || '0'),
                                                        expertId: expertData?.id || expertData?.userId,
                                                        rating: reviewRating,
                                                        comment: reviewComment.trim()
                                                    });

                                                    toast.success("Thank you for your feedback!");

                                                    // Wait a bit then redirect
                                                    setTimeout(() => router.push('/'), 1500);
                                                } catch (err: any) {
                                                    setReviewSubmitted(false);
                                                    const errorMsg = err.response?.data?.message || "Failed to submit review. Please try again.";
                                                    toast.error(errorMsg);
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
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Free Chat Ending Prompt Modal */}
            {showFreeEndPrompt && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`${isDarkMode ? 'bg-[#1a0c0c] border-white/10' : 'bg-white border-[#fd6410]/20'} w-full max-w-sm rounded-[32px] overflow-hidden border p-8 text-center shadow-2xl relative`}>
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
                                <button
                                    onClick={() => router.push('/wallet')}
                                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    Recharge Wallet
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        chatSocket.emit('confirm_paid_continuation', { sessionId: parseInt(sessionId || '0') });
                                        // Loading state could be added here
                                    }}
                                    className="w-full py-4 bg-[#fd6410] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    Continue Chat
                                </button>
                            )}
                            <button
                                onClick={handleEndChat}
                                className={`w-full py-4 rounded-2xl border ${isDarkMode ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400'} font-bold text-xs uppercase tracking-widest hover:bg-red-500/5 hover:text-red-500 transition-all`}
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default function ChatRoom() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatRoomContent />
        </Suspense>
    );
}
