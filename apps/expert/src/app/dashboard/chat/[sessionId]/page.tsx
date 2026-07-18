"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatSocket } from "@/lib/socket";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";
import { getErrorMessage } from "@repo/lib";

const {
    ChevronLeft, Paperclip, Send, Clock, User, Phone,
    MoreVertical, Power, MessageSquare, AlertCircle, X, MapPin
} = LucideIcons as any;

import { SummaryModal } from "@/components/common/SummaryModal";
import { ChatMessage, ChatSessionStatus, PendingAttachment } from "@/types/chat";
import { Avatar, Loading } from "@repo/ui";

function ExpertChatRoomContent() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const { user, isAuthenticated } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessionStatus, setSessionStatus] = useState<ChatSessionStatus>('pending');
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0); // Count-up timer
    const [startedAt, setStartedAt] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isActivating, setIsActivating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [typingStatus, setTypingStatus] = useState<{ senderName: string; isTyping: boolean } | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [clientName, setClientName] = useState("Client");
    const [clientAvatar, setClientAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId || !isAuthenticated || !user) return;

        // 0. Fetch Session Status and Client Info
        const fetchSessionInfo = async () => {


            // Fetch basic session info
            const [sessionRes, sessionErr] = await api.get<any>(`/chat/session/${sessionId}?_t=${Date.now()}`);
            if (sessionErr) {
                console.error("Failed to fetch session info:", sessionErr);
            } else if (sessionRes) {
                const status = sessionRes.status;
                setSessionStatus(status);
                if (sessionRes.client?.user?.name || sessionRes.user?.name) {
                    setClientName(sessionRes.client?.user?.name || sessionRes.user?.name);
                }
                
                const clientAvatarUrl = sessionRes.client?.profile_picture || sessionRes.client?.user?.avatar || sessionRes.user?.profile_picture || sessionRes.user?.avatar;
                if (clientAvatarUrl) {
                    setClientAvatar(clientAvatarUrl);
                }

                if (sessionRes.startedAt || sessionRes.started_at) setStartedAt(sessionRes.startedAt || sessionRes.started_at);
                if (sessionRes.expiresAt || sessionRes.expires_at) setExpiresAt(sessionRes.expiresAt || sessionRes.expires_at);

                if (sessionRes.remainingSeconds !== undefined) {
                    setTimeLeft(sessionRes.remainingSeconds);
                }
                if (sessionRes.elapsedSeconds !== undefined) {
                    setElapsedTime(sessionRes.elapsedSeconds);
                }
            }

            // Fetch history
            const [historyRes, historyErr] = await api.get<any>(`/chat/history/${sessionId}`);
            if (historyErr) {
                console.error("Failed to fetch history:", historyErr);
            } else {
                setMessages(historyRes || []);
            }
        };
        fetchSessionInfo();

        // 2. Socket Connection
        const joinRoom = () => {
            console.log(`[Socket] ✅ Connected! Joining room_${sessionId}...`);
            chatSocket.emit('join_room', { sessionId: sessionId });
        };

        // If already connected, join room immediately
        if (chatSocket.connected) {
            joinRoom();
        }

        // Join room when socket connects (or reconnects)
        chatSocket.on('connect', joinRoom);

        console.log(`[Socket] Connecting to chat socket for session ${sessionId}...`);
        chatSocket.connect();

        chatSocket.on('new_message', (msg: ChatMessage) => {
            console.log(`[Socket] 📩 Received new_message:`, msg);
            setMessages((prev) => [...prev, msg]);
            setTypingStatus(null);
        });

        chatSocket.on('typing_status', (data: { senderName: string; isTyping: boolean }) => {
            setTypingStatus(data);
        });

        chatSocket.on('session_activated', (session: any) => {

            setSessionStatus('active');

            if (session.startedAt || session.started_at) setStartedAt(session.startedAt || session.started_at);
            if (session.expiresAt || session.expires_at) setExpiresAt(session.expiresAt || session.expires_at);

            if (session.remainingSeconds !== undefined) {
                setTimeLeft(session.remainingSeconds);
            }
            if (session.elapsedSeconds !== undefined) {
                setElapsedTime(session.elapsedSeconds);
            }
            toast.success("Consultation started!", { toastId: `session_activated_${sessionId}` });
        });

        chatSocket.on('session_ended', (data: any) => {
            setSessionStatus('completed');

            if (data?.terminatedBy === 'admin') {
                toast.error(`SESSION TERMINATED BY ADMIN: ${data.interventionMessage || 'Administrative action'}`);
            }

            // Show summary popup - rely entirely on backend split data
            if (data?.split) {
                setSummaryData(data);
                setShowSummary(true);
            } else {
                console.warn("[ExpertChatDebug] ⚠️ No split data in session_ended event", data);
                toast.info("Session has ended. Redirecting...", { autoClose: 2000 });
                setTimeout(() => {
                    router.back();
                }, 2000);
            }
        });

        return () => {
            chatSocket.off('connect', joinRoom);
            chatSocket.off('new_message');
            chatSocket.off('typing_status');
            chatSocket.off('session_activated');
            chatSocket.off('session_ended');
            // Do NOT disconnect, as the shared socket is needed for global notifications (ChatNotificationListener)
            // chatSocket.disconnect(); 
        };
    }, [sessionId, isAuthenticated, user]);

    useEffect(() => {
        if (sessionStatus !== 'active') return;
        const timer = setInterval(() => {
            const now = Date.now();
            
            if (startedAt) {
                const s = new Date(startedAt).getTime();
                if (!isNaN(s)) {
                    const elapsed = Math.floor((now - s) / 1000);
                    setElapsedTime(elapsed > 0 ? elapsed : 0);
                }
            } else {
                setElapsedTime((prev) => prev + 1);
            }

            if (expiresAt) {
                const e = new Date(expiresAt).getTime();
                if (!isNaN(e)) {
                    const left = Math.floor((e - now) / 1000);
                    setTimeLeft(left > 0 ? left : 0);
                }
            } else {
                setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionStatus, startedAt, expiresAt]);

    // Auto-end if time runs out
    useEffect(() => {
        if (sessionStatus === 'active' && timeLeft === 0 && expiresAt) {
            console.log("[ExpertChat] 💸 Time expired, waiting for backend to handle grace period.");
            // We NO LONGER force end the chat here. The backend has a 30-second grace period logic.
            // handleEndChat(true); 
        }
    }, [timeLeft, sessionStatus, expiresAt]);

    useEffect(() => {
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, typingStatus]);

    const handleActivate = async () => {
        setIsActivating(true);


        // 1. API call (Data Persistence) - This now triggers the single automated card and socket broadcast
        const [_, error] = await api.post(`/chat/activate/${sessionId}`);

        if (error) {
            console.error("[ExpertChatDebug] Activation failed:", error);
            // If it's already active, we don't need to show an error
            if (getErrorMessage(error).includes("active")) {
                setSessionStatus('active');
            } else {
                toast.error(getErrorMessage(error) || "Failed to activate session");
            }
        }
        setIsActivating(false);
    };

    const handleInputTyping = () => {
        if (!sessionId || !user) return;
        chatSocket.emit('typing', {
            sessionId,
            senderName: user.name || 'Expert',
            isTyping: true
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            chatSocket.emit('typing', {
                sessionId,
                senderName: user.name || 'Expert',
                isTyping: false
            });
        }, 1500);
    };

    const handleSendMessage = () => {
        if ((!inputValue.trim() && !pendingAttachment) || !sessionId || !user) return;

        const payload: any = {
            sessionId: sessionId,
            senderId: user.id,
            senderType: 'expert',
            content: inputValue.trim() || (pendingAttachment?.type === "image" ? "Sent an image" : "Sent an attachment"),
        };

        if (pendingAttachment) {
            payload.attachmentUrl = pendingAttachment.url;
            payload.attachmentType = pendingAttachment.type;
        }


        console.log(`[Socket] 📤 Sending message:`, payload);
        chatSocket.emit('send_message', payload, (response: any) => {
            console.log(`[Socket] 📬 Received ACK for send_message:`, response);
            // Fallback: If socket broadcast doesn't work for the sender, append it manually from ACK
            if (response && response.id) {
                setMessages(prev => {
                    if (!prev.some(m => m.id === response.id)) {
                        console.log(`[Socket] 🔧 Appending message manually from ACK`);
                        return [...prev, response];
                    }
                    return prev;
                });
            }
        });
        setInputValue("");
        setPendingAttachment(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId || !user) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const [data, error] = await api.post<any>(`/expert/upload-file`, formData);

            if (error) {
                console.error("Upload error:", error);
                toast.error(getErrorMessage(error) || "Upload failed");
                return;
            }

            if (data?.url) {
                const attachmentType = file.type.startsWith("image") ? "image" : "document";
                setPendingAttachment({
                    url: data.url,
                    type: attachmentType as any,
                    name: file.name
                });
                toast.info("File uploaded! Click send to share.");
            }
        } finally {
            setUploading(false);
            if (e.target) e.target.value = "";
        }
    };

    const handleEndChat = async (force = false) => {
        if (!force && !confirm("Are you sure you want to end this consultation?")) return;

        // Send a system message before ending the chat for history
        if (user && sessionId) {
            chatSocket.emit('send_message', {
                sessionId: sessionId,
                senderId: user.id, // Using user ID but marked as system/admin message logically if desired, or just show as expert ended it. 
                // However, user asked for "admin ne session end kiya to ya user ne session end kiya". 
                // Usually 'admin' senderType is for system messages. 
                senderType: 'admin',
                content: "Expert has ended the consultation.",
            });
        }

        // Use socket emit to align with User side logic ("New Backend Logic")

        chatSocket.emit('end_chat', { sessionId: sessionId });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white md:relative md:inset-auto md:z-auto md:h-[calc(100vh-120px)] md:rounded-2xl md:shadow-sm md:border md:border-gray-100 overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#fd6410] to-[#ff8c4a] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md gap-2">
                <div className="flex items-center gap-1 sm:gap-4 min-w-0">
                    <button onClick={() => router.back()} className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black overflow-hidden border border-white/30 shadow-sm shrink-0">
                            <Avatar
                                src={clientAvatar}
                                alt={clientName || "Client"}
                                size="md"
                                fallback="/images/default-avatar.svg"
                                className="border-0 bg-transparent text-white w-full h-full"
                            />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                            <h2 className="font-bold text-white leading-tight truncate text-sm sm:text-base">Consultation with {clientName}</h2>
                            <p className="text-[9px] sm:text-[10px] text-white/80 font-bold flex items-center gap-1.5 mt-0.5 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sessionStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`}></span>
                                {sessionStatus === 'active' ? 'Live Session' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6 shrink-0">
                    {/* Timers Section — hidden on mobile to save space */}
                    {sessionStatus === 'active' && (
                        <div className="hidden sm:flex items-center gap-4 md:gap-5">
                            {/* Active Duration */}
                            <div className="hidden md:flex flex-col items-end gap-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">Elapsed</span>
                                <span className="text-sm md:text-base font-black tabular-nums text-white drop-shadow-sm leading-none">{formatTime(elapsedTime)}</span>
                            </div>
                            <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                            {/* Time Left */}
                            <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/30 shadow-xl">
                                <Clock className="w-3.5 h-3.5 text-white" />
                                <div className="flex flex-col items-start">
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 leading-none">Left</span>
                                    <span className="text-sm font-black tabular-nums text-white leading-none">{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile timer — compact */}
                    {sessionStatus === 'active' && (
                        <div className="flex sm:hidden items-center gap-1 bg-black/20 px-2 py-1 rounded-full border border-white/20">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-xs font-black tabular-nums text-white">{formatTime(timeLeft)}</span>
                        </div>
                    )}

                    {sessionStatus === 'pending' && (
                        <button
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 border border-white/20"
                        >
                            <Power className="w-4 h-4" />
                            <span className="hidden xs:inline">{isActivating ? 'Starting...' : 'Start'}</span>
                            <span className="xs:hidden">{isActivating ? '...' : 'Start'}</span>
                        </button>
                    )}

                    {sessionStatus === 'active' && (
                        <button
                            onClick={handleEndChat}
                            className="bg-white text-red-600 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all active:scale-95 border border-white/20 whitespace-nowrap"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>End</span>
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

                {messages.map((msg) => {
                    const mSenderType = msg.senderType || (msg as any).sender_type;
                    const isAdmin = mSenderType === "admin";
                    const isExpert = mSenderType === "expert";

                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isExpert ? "flex-row-reverse" : "flex-row"} ${isAdmin ? "justify-center w-full" : ""}`}>
                            {/* Avatar */}
                            {!isAdmin && (
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    {isExpert ? (
                                        <Avatar
                                            src={user?.profilePic || user?.avatar}
                                            alt={user?.name || "Expert"}
                                            size="sm"
                                            fallback="/images/dummy-expert.jpg"
                                            className="border-gray-200"
                                        />
                                    ) : (
                                        <Avatar
                                            src={clientAvatar}
                                            alt={clientName || "Client"}
                                            size="sm"
                                            fallback="/images/default-avatar.svg"
                                            className="border-gray-200"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Message Content */}
                            <div className={`max-w-[70%] flex flex-col ${isExpert ? "items-end" : isAdmin ? "items-center" : "items-start"} ${isAdmin ? "w-full" : ""}`}>
                                {!isAdmin && (
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
                                        {isExpert ? "You (Expert)" : (clientName || "Client")}
                                    </span>
                                )}
                                <div className={`px-4 py-3 rounded-2xl shadow-sm ${isExpert
                                    ? "bg-orange-600 text-white rounded-tr-none"
                                    : isAdmin
                                        ? "bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-center w-full shadow-red-100"
                                        : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"
                                    }`}>
                                    {isAdmin && (
                                        <div className="flex items-center justify-center gap-2 mb-1 text-[10px] font-black uppercase tracking-tighter">
                                            <AlertCircle className="w-3 h-3" /> System Intervention
                                        </div>
                                    )}
                                    {msg.content.startsWith('[INTRO_CARD]') ? (
                                        <div className="bg-gradient-to-br from-[#FFD700] via-[#FFEA00] to-[#FFD700] p-1 rounded-2xl shadow-xl border-2 border-white/50 w-full">
                                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20">
                                                <div className="flex items-center gap-3 mb-4 border-b border-black/5 pb-3">
                                                    <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-black" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-black font-black text-xs uppercase tracking-widest">Birth Details</h3>
                                                        <p className="text-black opacity-60 text-[10px] uppercase font-bold tracking-tighter">Shared Profile Info</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {(() => {
                                                        try {
                                                            const data = JSON.parse(msg.content.replace('[INTRO_CARD]', ''));
                                                            return (
                                                                <>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">Name</span>
                                                                        <p className="text-sm font-black text-black">{data.name || "N/A"}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">Gender</span>
                                                                        <p className="text-sm font-black text-black capitalize">{data.gender || "N/A"}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">Date of Birth</span>
                                                                        <p className="text-sm font-black text-black">
                                                                            {data.dob && data.dob !== "N/A" ? (
                                                                                !isNaN(new Date(data.dob).getTime()) 
                                                                                ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                                                                : data.dob
                                                                            ) : "N/A"}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">Time of Birth</span>
                                                                        <p className="text-sm font-black text-black">{data.tob || "N/A"}</p>
                                                                    </div>
                                                                    <div className="col-span-2 space-y-1">
                                                                        <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">Place of Birth</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <MapPin className="w-3 h-3 text-black/40" />
                                                                            <p className="text-sm font-black text-black">{data.pob || "N/A"}</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        } catch (e) {
                                                            return <p className="text-red-500">Invalid Card Data</p>;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Attachment Display */}
                                            {(msg.attachmentUrl || msg.attachment_url || msg.imageUrl || msg.mediaUrl) && (
                                                <div className="mb-2">
                                                    {(
                                                        msg.attachmentType?.toLowerCase() === "image" ||
                                                        msg.attachment_type?.toLowerCase() === "image" ||
                                                        (msg.attachmentUrl || msg.attachment_url || msg.imageUrl || msg.mediaUrl)?.match(/\.(jpg|jpeg|png|gif|webp)$|images/i)
                                                    ) ? (
                                                        <div 
                                                            onClick={() => setPreviewImage(msg.attachmentUrl || msg.attachment_url || msg.imageUrl || msg.mediaUrl || null)}
                                                            className="cursor-pointer"
                                                        >
                                                            <img
                                                                src={msg.attachmentUrl || msg.attachment_url || msg.imageUrl || msg.mediaUrl}
                                                                className="rounded-lg max-h-60 w-auto object-contain shadow-sm hover:opacity-90 transition border border-white/10"
                                                                alt="Attachment"
                                                                onError={(e) => {
                                                                    (e.target as any).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <a
                                                            href={msg.attachmentUrl || msg.attachment_url || msg.imageUrl || msg.mediaUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 bg-black/10 p-2 rounded-lg border border-white/5 hover:bg-black/20 transition"
                                                        >
                                                            <Paperclip className="w-4 h-4" />
                                                            <span className="text-[10px] font-bold">Document</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            <p className={`text-sm leading-relaxed ${isAdmin ? "font-black" : ""}`}>{msg.content}</p>
                                        </>
                                    )}
                                    <p className={`text-[9px] mt-1 opacity-60 font-bold ${isExpert ? "text-white" : isAdmin ? "text-red-400" : "text-gray-400"}`}>
                                        {(msg.createdAt || (msg as any).created_at) ? new Date(msg.createdAt || (msg as any).created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="!mt-4">
                    {typingStatus?.isTyping && (
                        <div className="flex gap-3 items-center animate-pulse py-1">
                            <div className="w-6 h-6 rounded-full bg-gray-500/10 flex items-center justify-center">
                                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s] mx-0.5"></div>
                                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{typingStatus.senderName} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-6 border-t border-gray-100 bg-white">
                <div className="flex flex-col bg-gray-50 border-2 border-[#fd6410] rounded-[24px] md:rounded-[34px] p-1.5 md:p-2 shadow-[0_0_0_4px_rgba(253,100,16,0.1)] transition-all">
                    {/* Preview Area */}
                    {pendingAttachment && (
                        <div className="flex items-center self-start gap-2 bg-orange-100 border border-orange-200 rounded-xl px-3 py-2 mb-2 ml-2 animate-in slide-in-from-bottom-2">
                            {pendingAttachment.type === 'image' ? (
                                <img src={pendingAttachment.url} className="w-8 h-8 rounded object-cover border border-orange-200" alt="Preview" />
                            ) : (
                                <Paperclip className="w-4 h-4 text-[#fd6410]" />
                            )}
                            <span className="text-[10px] font-bold text-[#fd6410] truncate max-w-[150px]">{pendingAttachment.name}</span>
                            <button onClick={() => setPendingAttachment(null)} className="p-1 hover:bg-orange-100 rounded-full">
                                <X className="w-3.5 h-3.5 text-[#fd6410]" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-3 px-1 md:px-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={`p-2.5 sm:p-3 text-gray-400 hover:text-[#fd6410] bg-white hover:bg-orange-50 rounded-full transition-all shadow-sm border border-black/5 ${uploading ? 'animate-pulse' : ''} shrink-0`}
                        >
                            {uploading ? <div className="w-5 h-5 border-2 border-[#fd6410]/30 border-t-[#fd6410] rounded-full animate-spin" /> : <Paperclip className="w-5 h-5" />}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        <div className="flex-1 min-w-0">
                            <textarea
                                rows={1}
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    handleInputTyping();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-gray-400 resize-none min-h-[36px] sm:min-h-[40px] max-h-32 py-2 px-2"
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() && !pendingAttachment}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                inputValue.trim() || pendingAttachment
                                    ? 'bg-[#fd6410] text-white shadow-lg shadow-orange-500/30 hover:bg-[#e55a0e] hover:-translate-y-0.5'
                                    : 'bg-white text-gray-400 border border-black/5 shadow-sm'
                            }`}
                        >
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button 
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
                            onClick={(e) => e.stopPropagation()} 
                        />
                    </div>
                </div>
            )}

            <SummaryModal 
                isOpen={showSummary && !!summaryData} 
                data={summaryData?.split} 
                title="Chat Session Ended"
            />
        </div>
    );
}

export default function ExpertChatRoom() {
    return (
        <Suspense fallback={<Loading fullScreen />}>
            <ExpertChatRoomContent />
        </Suspense>
    );
}
