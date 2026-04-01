"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api as http } from "@/lib/api";
import { chatSocket } from "@/libs/socket";
import { uploadClientDocument } from "@/libs/api-profile";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

import { ChatMessage, ChatSession, Astrologer } from "@/lib/types";

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

    const { clientUser, isClientAuthenticated, refreshBalance } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessionStatus, setSessionStatus] = useState<'pending' | 'active' | 'completed'>('pending');
    const [expertData, setExpertData] = useState<Astrologer | null>(null);
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

    useEffect(() => {
        if (!isClientAuthenticated) return;

        const fetchData = async () => {
            const [res, error] = await http.get<any>(`/chat/user-session/${id}${sessionId ? `?sessionId=${sessionId}` : ''}`);
            if (error) {
                toast.error(error.message || "Failed to load chat session");
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
                setMessages(data.session.messages || []);
                setElapsedTime(data.session.elapsedSeconds ?? 0);
                setTimeLeft(data.session.remainingSeconds ?? 0);
            }

            if (data.session.status === 'completed') {
                setSessionSummary(data.session);
                setShowModal(true);
            }
        };

        fetchData();
    }, [id, sessionId, isClientAuthenticated]);

    useEffect(() => {
        if (!sessionId) return;

        chatSocket.connect();
        chatSocket.emit('join_room', { sessionId: parseInt(sessionId) });

        chatSocket.on('new_message', (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
            setTypingStatus(null);
        });

        chatSocket.on('typing_status', (data: { senderName: string; isTyping: boolean }) => {
            setTypingStatus(data);
        });

        chatSocket.on('session_activated', (dataValue: any) => {
            setSessionStatus('active');
            // Backend sends remainingSeconds directly — use it to avoid NaN from missing expiresAt
            if (dataValue.remainingSeconds !== undefined) {
                setTimeLeft(dataValue.remainingSeconds);
                setElapsedTime(dataValue.elapsedSeconds ?? 0);
            } else {
                const now = new Date().getTime();
                const end = new Date(dataValue.expiresAt || dataValue.expires_at).getTime();
                if (!isNaN(end)) setTimeLeft(Math.floor((end - now) / 1000));
            }
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
            if (data.remainingSeconds !== undefined) {
                setTimeLeft(data.remainingSeconds);
            } else {
                const now = new Date().getTime();
                const end = new Date(data.expiresAt || data.expires_at).getTime();
                if (!isNaN(end)) setTimeLeft(Math.floor((end - now) / 1000));
            }
            toast.success("Consultation continued as paid session");
        });

        return () => {
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
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionStatus]);

    useEffect(() => {
        if (showFreeEndPrompt && continuationTimer > 0) {
            const timer = setInterval(() => {
                setContinuationTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (showFreeEndPrompt && continuationTimer === 0) {
            handleEndChat();
        }
    }, [showFreeEndPrompt, continuationTimer]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(Math.abs(seconds) / 60);
        const secs = Math.abs(seconds) % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() && !pendingAttachment) return;
        if (!sessionId || !clientUser) return;

        const payload: any = {
            sessionId: parseInt(sessionId),
            senderId: clientUser.id,
            senderType: 'user',
            content: inputValue.trim(),
        };

        if (pendingAttachment) {
            payload.attachmentUrl = pendingAttachment.url;
            payload.attachmentType = pendingAttachment.type;
        }

        chatSocket.emit('send_message', payload);
        setInputValue("");
        setPendingAttachment(null);
    };

    const handleEndChat = () => {
        if (!sessionId) return;
        if (!confirm("Are you sure you want to end this session?")) return;

        isEndingSession.current = true;

        if (clientUser && sessionId) {
            chatSocket.emit('send_message', {
                sessionId: parseInt(sessionId),
                senderId: clientUser.id,
                senderType: 'admin',
                content: "User has ended the consultation.",
            });
        }

        chatSocket.emit('end_chat', { sessionId: parseInt(sessionId) });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId || !clientUser) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        const [uploadRes, error] = await uploadClientDocument(file);

        if (error) {
            console.error("Upload error:", error);
            toast.error(error.message || "Upload failed");
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

    if (!expertData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#1a0c0c]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fd6410]"></div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#1a0c0c] text-white' : 'bg-[#FFF9F5] text-[#2A0A0A]'} overflow-hidden font-outfit transition-colors duration-500`}>
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
                timeLeft={timeLeft}
                handleEndChat={handleEndChat}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#2A0A0A]' : 'bg-[#FFF9F5]'} relative transition-colors duration-500`}>
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
        <Suspense fallback={<div>Loading...</div>}>
            <ChatRoomContent />
        </Suspense>
    );
}
