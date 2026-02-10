"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip, Image as ImageIcon, FileText, Download, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getNotificationSocket, getSupportSocket } from "@packages/ui/src/utils/socket";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { getDisputeMessages, sendDisputeMessage, markDisputeMessagesRead, uploadClientDocument, getDisputeById } from "@/libs/api-profile";

// Define message types locally since we can't import from admin
interface Message {
    id: number;
    disputeId: number;
    senderType: "user" | "admin";
    senderId: number;
    senderName: string;
    message?: string;
    attachmentUrl?: string;
    attachmentType?: "image" | "document" | "pdf";
    isRead: boolean;
    createdAt: string;
    isSystemNote?: boolean;
    is_system_note?: boolean;
}

interface UserDisputeChatModalProps {
    disputeId: number; // Just ID needed
    category?: string; // Optional context
    onClose: () => void;
}

const XIcon = X as any;
const SendIcon = Send as any;
const PaperclipIcon = Paperclip as any;
const FileTextIcon = FileText as any;
const AlertCircleIcon = AlertCircle as any;

export default function UserDisputeChatModal({ disputeId, category, onClose }: UserDisputeChatModalProps) {
    const { clientUser } = useClientAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userEndRequestedAt, setUserEndRequestedAt] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll functionality
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const socket = getSupportSocket();

        const joinRoom = () => {
            console.log("🏠 [UserSocket] Joining dispute room:", disputeId);
            socket.emit('join_dispute_room', { disputeId });
        };

        if (socket.connected) {
            joinRoom();
        } else {
            console.log("🔌 [UserSocket] Connecting...");
            socket.on('connect', joinRoom);
            socket.connect();
        }

        const handleNewMessage = (message: any) => {
            if (Number(message.disputeId) === Number(disputeId)) {
                setMessages((prev) => {
                    if (prev.some(m => m.id === message.id)) return prev;
                    return [...prev, message];
                });
                markDisputeMessagesRead(disputeId).catch(console.error);
            }
        };

        const handleEndChatBroadcast = (data: any) => {
            console.log("🚨 [UserSocket] End chat broadcast received:", data);
            if (Number(data.disputeId) === Number(disputeId)) {
                setUserEndRequestedAt(new Date().toISOString());
                // No longer injecting manually - backend will send a 'new_message' 
                // for the system note or it will appear on next refresh
                fetchMessages();
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('dispute_close_requested', handleEndChatBroadcast);

        return () => {
            console.log("👋 [UserSocket] Cleanup");
            socket.off('connect', joinRoom);
            socket.off('new_message', handleNewMessage);
            socket.off('dispute_close_requested', handleEndChatBroadcast);
        };
    }, [disputeId]);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            // 1. Fetch Dispute Status for persistent banner after refresh
            const response = await getDisputeById(disputeId);
            const disputeData = response.data || response.dispute || response;

            console.log("📄 [UserAPI] Dispute status:", disputeData?.status);

            // 2. Fetch Messages
            const data = await getDisputeMessages(disputeId);
            let msgs: Message[] = Array.isArray(data) ? data : (data.messages || data.data || []);

            if (disputeData?.status === "close_requested" || disputeData?.status === "resolved") {
                setUserEndRequestedAt(disputeData.updatedAt || new Date().toISOString());
            }

            setMessages(msgs);

            if (msgs.length > 0) {
                markDisputeMessagesRead(disputeId).catch(err => console.error("Mark read error:", err));
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchMessages();
    }, [disputeId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setLoading(true);
            const msgData = await sendDisputeMessage(disputeId, { message: newMessage });

            if (msgData && msgData.id) {
                setMessages((prev) => [...prev, msgData]);
            } else {
                fetchMessages();
            }
            setNewMessage("");
        } catch (error) {
            console.error("Send error:", error);
            toast.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            setUploading(true);
            const uploadRes = await uploadClientDocument(file);

            if (uploadRes && uploadRes.url) {
                const attachmentType = file.type.startsWith("image") ? "image" : "document";
                const msgData = await sendDisputeMessage(disputeId, {
                    attachmentUrl: uploadRes.url,
                    attachmentType
                });

                if (msgData && msgData.id) {
                    setMessages((prev) => [...prev, msgData]);
                } else {
                    fetchMessages();
                }
                toast.success("File sent!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleRequestEndChat = () => {
        if (window.confirm("Are you sure you want to request to end this chat?")) {
            const socket = getSupportSocket();
            console.log("📣 [UserChat] Emitting request_end_chat", { disputeId, userId: clientUser?.id });
            socket.emit('request_end_chat', { disputeId, userId: clientUser?.id });
            toast.info("End chat request sent to admin");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col mx-4 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="px-5 py-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            Support Chat
                            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                                #{disputeId}
                            </span>
                        </h2>
                        <p className="text-xs text-white/90">{category || "General Issue"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRequestEndChat}
                            className="text-[10px] sm:text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 text-white"
                        >
                            <AlertCircleIcon className="w-3 h-3" />
                            End Chat
                        </button>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 relative">
                    {/* Persistent sticky status banner if request already exists (e.g. after refresh) */}
                    {userEndRequestedAt && (
                        <div className="sticky top-0 z-20 flex justify-center mb-4 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-start gap-3 shadow-lg backdrop-blur-sm max-w-[95%]">
                                <div className="bg-orange-500 p-2 rounded-xl shadow-md flex-shrink-0">
                                    <AlertCircleIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-orange-900 font-bold uppercase tracking-wider mb-0.5">End Chat Requested</span>
                                    <p className="text-[11px] text-orange-800/80 font-medium leading-relaxed">
                                        Your request to end this chat is being reviewed by our support team. Sent at {new Date(userEndRequestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => {
                        // CASE 1: System Note (End Chat Request)
                        if (msg.isSystemNote || msg.is_system_note) {
                            return (
                                <div key={`sys-${idx}`} className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex flex-col items-center gap-1 shadow-sm max-w-[90%]">
                                        <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                                            <AlertCircleIcon className="w-4 h-4" />
                                            End Chat Requested
                                        </div>
                                        <div className="text-[10px] text-yellow-600 font-medium italic text-center">
                                            {msg.message || `End chat requested at ${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // CASE 2: Normal Message
                        const isMe = msg.senderType === "user";
                        const msgKey = msg.id ? `msg-${msg.id}-${idx}` : `idx-${idx}`;

                        return (
                            <div key={msgKey} className={`flex flex-col !w-full mb-3 ${isMe ? "items-end" : "items-start"}`}>
                                <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} items-end max-w-[85%]`}>
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border-2 border-white shadow-sm">
                                            <img
                                                src={isMe
                                                    ? "https://ui-avatars.com/api/?name=User&background=f97316&color=fff&size=128"
                                                    : "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&size=128"
                                                }
                                                alt={isMe ? "You" : "Admin"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                            ? "bg-orange-500 text-white rounded-br-none"
                                            : "bg-white border text-gray-800 rounded-bl-none"
                                            }`}>
                                            {msg.attachmentUrl && (
                                                <div className="mb-2">
                                                    {msg.attachmentType === "image" ? (
                                                        <img src={msg.attachmentUrl} className="rounded-lg max-h-48 object-cover" alt="Attachment" />
                                                    ) : (
                                                        <div className="flex items-center gap-2 bg-black/10 p-2 rounded">
                                                            <FileTextIcon className="w-4 h-4" /> Document
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white rounded-b-2xl flex-shrink-0">
                    <div className="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        />

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            disabled={!newMessage.trim() || loading}
                            className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <SendIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
