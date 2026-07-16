"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api as http } from "@/lib/api";
import { chatSocket } from "@/libs/socket";
import { uploadClientDocument } from "@/libs/api-profile";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

import * as LucideIcons from "lucide-react";
import { Button, Loading } from "@repo/ui";
import { ChatMessage, ChatSession, Expert } from "@/lib/types";

import WaitingCountdown from "./waiting-countdown.component";
import Header from "./header.component";
import MessageArea from "./message-area.component";
import ChatFooter from "./chat-footer.component";
import Sidebar from "./sidebar.component";
import SessionSummaryModal from "./session-summary-modal.component";
import FreeEndPromptModal from "./free-end-prompt-modal.component";

function ChatRoomContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const sessionId = searchParams.get('sessionId');

    const { user, isAuthenticated, refreshBalance } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessionStatus, setSessionStatus] = useState<'pending' | 'active' | 'completed'>('pending');
    const [expertData, setExpertData] = useState<Expert | null>(null);
    const [startedAt, setStartedAt] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [isFree, setIsFree] = useState<boolean>(false);
    const [freeMinutes, setFreeMinutes] = useState<number>(0);
    const [showFreeEndPrompt, setShowFreeEndPrompt] = useState(false);
    const [freeLimitData, setFreeLimitData] = useState<any>(null);
    const [continuationTimer, setContinuationTimer] = useState<number>(30);

    const [reviewRating, setReviewRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>("");
    const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

    const [sessionSummary, setSessionSummary] = useState<ChatSession | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [typingStatus, setTypingStatus] = useState<{ senderName: string; isTyping: boolean } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [pendingAttachment, setPendingAttachment] = useState<{ url: string; type: "image" | "document"; name: string } | null>(null);

    const isEndingSession = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !mounted) return;

        const fetchData = async () => {
            if (!id || id === 'undefined') return;
            const [res, error] = await http.get<any>(`/chat/user-session/${id}${sessionId ? `?sessionId=${sessionId}` : ''}`);
            if (error) {
                toast.error(getErrorMessage(error) || "Failed to load chat session");
                return;
            }

            const data = res?.data ?? res;
            setExpertData(data.expert);
            setSessionStatus(data.session.status);
            setIsFree(data.session.isFree || false);
            setFreeMinutes(data.session.freeMinutes || 0);

            if (data.session.status === 'pending') {
                setExpiresAt(data.session.expiresAt || data.session.expires_at);
            }

            if (data.session.status === 'active') {
                if (data.session.expiresAt || data.session.expires_at) setExpiresAt(data.session.expiresAt || data.session.expires_at);
                if (data.session.startedAt || data.session.started_at) setStartedAt(data.session.startedAt || data.session.started_at);
                
                const currentSessionId = sessionId || data.session.id;
                if (currentSessionId) {
                    const [historyRes, historyErr] = await http.get<any>(`/chat/history/${currentSessionId}`);
                    if (!historyErr && historyRes) {
                        setMessages(historyRes);
                    } else {
                        setMessages(data.session.messages || []);
                    }
                } else {
                    setMessages(data.session.messages || []);
                }
                
                setElapsedTime(data.session.elapsedSeconds ?? 0);
                setTimeLeft(data.session.remainingSeconds ?? 0);
            }

            if (data.session.status === 'completed') {
                setSessionSummary(data.session);
                setShowModal(true);
            }
        };

        fetchData();

        // Fallback polling if socket event is missed
        const pollInterval = setInterval(() => {
            setSessionStatus(current => {
                if (current === 'pending') {
                    fetchData();
                }
                return current;
            });
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [id, sessionId, isAuthenticated, mounted]);

    useEffect(() => {
        if (!sessionId) return;

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

        chatSocket.on('new_message', (message: ChatMessage) => {
            console.log(`[Socket] 📩 Received new_message:`, message);
            setMessages(prev => [...prev, message]);
            setTypingStatus(null);
        });

        chatSocket.on('typing_status', (data: { senderName: string; isTyping: boolean }) => {
            setTypingStatus(data);
        });

        chatSocket.on('session_activated', (dataValue: any) => {
            setSessionStatus('active');
            if (dataValue.startedAt || dataValue.started_at) setStartedAt(dataValue.startedAt || dataValue.started_at);
            if (dataValue.expiresAt || dataValue.expires_at) setExpiresAt(dataValue.expiresAt || dataValue.expires_at);
            
            if (dataValue.remainingSeconds !== undefined) setTimeLeft(dataValue.remainingSeconds);
            if (dataValue.elapsedSeconds !== undefined) setElapsedTime(dataValue.elapsedSeconds);
        });

        chatSocket.on('session_ended', (summary: ChatSession) => {
            setSessionStatus('completed');
            setSessionSummary(summary);
            setShowModal(true);
            refreshBalance();
        });

        chatSocket.on('free_time_ending_soon', (data: any) => {
            setFreeLimitData(data);
            setShowFreeEndPrompt(true);
            setContinuationTimer(30);
        });

        chatSocket.on('paid_continuation_confirmed', (data: any) => {
            setShowFreeEndPrompt(false);
            setIsFree(false);
            if (data.expiresAt || data.expires_at) setExpiresAt(data.expiresAt || data.expires_at);
            if (data.remainingSeconds !== undefined) {
                setTimeLeft(data.remainingSeconds);
            }
            toast.success("Consultation continued as paid session");
        });

        return () => {
            chatSocket.off('connect', joinRoom);
            chatSocket.off('new_message');
            chatSocket.off('typing_status');
            chatSocket.off('session_activated');
            chatSocket.off('session_ended');
            chatSocket.off('free_time_ending_soon');
            chatSocket.off('paid_continuation_confirmed');
        };
    }, [sessionId, refreshBalance]);

    useEffect(() => {
        if (sessionStatus !== 'active') return;

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
            setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : prev === null ? null : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionStatus, startedAt, expiresAt]);

    useEffect(() => {
        if (sessionStatus === 'active' && timeLeft === 0 && expiresAt && !isFree) {
            console.log("[ChatRoom] Balance exhausted, waiting for backend termination.", {
                sessionStatus, timeLeft, expiresAt, isFree
            });
        }
    }, [timeLeft, sessionStatus, expiresAt, isFree]);

    useEffect(() => {
        if (showFreeEndPrompt && continuationTimer > 0) {
            const timer = setInterval(() => {
                setContinuationTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showFreeEndPrompt, continuationTimer]);

    useEffect(() => {
        // Use a small timeout to ensure the DOM has rendered the new message
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, typingStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(Math.abs(seconds) / 60);
        const secs = Math.abs(seconds) % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() && !pendingAttachment) return;
        if (!sessionId || !user) return;

        const payload: any = {
            sessionId: sessionId,
            senderId: user.profile || user.id,
            senderType: 'user',
            content: inputValue.trim(),
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
                    // Check if already exists to prevent duplicate if broadcast DOES work
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

    const handleEndChat = (force = false) => {
        if (!sessionId) return;
        if (!force && !confirm("Are you sure you want to end this session?")) return;

        isEndingSession.current = true;

        if (user && sessionId) {
            chatSocket.emit('send_message', {
                sessionId: sessionId,
                senderId: user.profile || user.id,
                senderType: 'admin',
                content: "User has ended the consultation.",
            });
        }

        chatSocket.emit('end_chat', { sessionId: sessionId });
    };

    const handleInputTyping = () => {
        if (!sessionId || !user) return;
        chatSocket.emit('typing', {
            sessionId,
            senderName: user.name || 'User',
            isTyping: true
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            chatSocket.emit('typing', {
                sessionId,
                senderName: user.name || 'User',
                isTyping: false
            });
        }, 1500);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId || !user) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        const [uploadRes, error] = await uploadClientDocument(file);

        if (error) {
            console.error("Upload error:", error);
            toast.error(getErrorMessage(error) || "Upload failed");
        } else if (uploadRes && uploadRes.url) {
            const attachmentType = file.type.startsWith("image") ? "image" : "document";
            setPendingAttachment({
                url: uploadRes.url,
                type: attachmentType as any,
                name: file.name
            });
            toast.info("File uploaded! Click send to share.");
        }
        setUploading(false);
        if (e.target) e.target.value = "";
    };

    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!expertData && mounted) {
            const timer = setTimeout(() => {
                if (!expertData) setLoadError(true);
            }, 10000); // 10 second timeout
            return () => clearTimeout(timer);
        }
    }, [expertData, mounted]);

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#1a0c0c] p-6 text-center">
                <LucideIcons.AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-white font-bold text-xl mb-2">Failed to Load Session</h2>
                <p className="text-white/60 mb-6">We couldn't retrieve your chat details. Please try again or go back to home.</p>
                <Button onClick={() => window.location.reload()} className="bg-[#fd6410]">Retry</Button>
            </div>
        );
    }

    if (!expertData || !mounted) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#1a0c0c]">
                <Loading size="lg" text="Connecting to chat..." />
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 flex flex-col ${isDarkMode ? 'bg-[#1a0c0c] text-white' : 'bg-[#FFF9F5] text-[#2A0A0A]'} overflow-hidden font-outfit transition-colors duration-500 z-50`}>
            {sessionStatus === 'pending' && expiresAt && (
                <WaitingCountdown expiresAt={expiresAt} onExpire={() => router.push('/')} />
            )}

            <Header
                router={router}
                expertData={expertData}
                isFree={isFree}
                sessionStatus={sessionStatus}
                formatTime={formatTime}
                elapsedTime={elapsedTime}
                timeLeft={timeLeft || 0}
                handleEndChat={handleEndChat}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <div 
                    className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#2A0A0A]' : ''} relative transition-colors duration-500`}
                    style={!isDarkMode ? { backgroundImage: "url('/images/white-background.png')", backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                    <div className={`md:hidden ${isDarkMode ? 'bg-[#3D1414]' : 'bg-[#FFF1E6]'} py-2 px-4 flex justify-between items-center border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                        <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#fd6410]'}`}>
                            {sessionStatus === 'active' ? 'Session Live' : sessionStatus === 'completed' ? 'Finished' : 'Initializing...'}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] opacity-50">Secure Connection</span>
                        </div>
                    </div>

                    <MessageArea
                        isDarkMode={isDarkMode}
                        sessionStatus={sessionStatus}
                        sessionSummary={sessionSummary}
                        messages={messages}
                        expertData={expertData}
                        typingStatus={typingStatus}
                        messagesEndRef={messagesEndRef}
                        user={user}
                    />

                    <ChatFooter
                        isDarkMode={isDarkMode}
                        sessionStatus={sessionStatus}
                        pendingAttachment={pendingAttachment}
                        setPendingAttachment={setPendingAttachment}
                        handleFileUpload={handleFileUpload}
                        fileInputRef={fileInputRef}
                        uploading={uploading}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        handleInputTyping={handleInputTyping}
                    />
                </div>

                <Sidebar isDarkMode={isDarkMode} expertData={expertData} />
            </div>

            <SessionSummaryModal
                showModal={showModal}
                isDarkMode={isDarkMode}
                sessionSummary={sessionSummary}
                freeMinutes={freeMinutes}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                reviewSubmitted={reviewSubmitted}
                setReviewSubmitted={setReviewSubmitted}
                sessionId={sessionId}
                expertData={expertData}
                router={router}
            />

            <FreeEndPromptModal
                showFreeEndPrompt={showFreeEndPrompt}
                isDarkMode={isDarkMode}
                continuationTimer={continuationTimer}
                freeLimitData={freeLimitData}
                expertData={expertData}
                router={router}
                chatSocket={chatSocket}
                sessionId={sessionId}
                handleEndChat={handleEndChat}
            />
        </div>
    );
}

export default function ChatRoom() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#1a0c0c]"><Loading size="lg" /></div>}>
            <ChatRoomContent />
        </Suspense>
    );
}
